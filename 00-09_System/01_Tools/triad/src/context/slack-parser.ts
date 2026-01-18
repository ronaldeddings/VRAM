// Slack Parser
// Parses Slack exports and builds team communication intelligence

import { config } from "../utils/config";
import { logger } from "../utils/logger";

export interface SlackMessage {
  type: string;
  user: string;
  text: string;
  ts: string;
  team?: string;
  thread_ts?: string;
  reply_count?: number;
  reply_users_count?: number;
  user_profile?: {
    real_name: string;
    name: string;
    display_name?: string;
    image_72?: string;
  };
  reactions?: Array<{
    name: string;
    users: string[];
    count: number;
  }>;
  files?: Array<{
    name: string;
    filetype: string;
    size?: number;
  }>;
  attachments?: Array<{
    title?: string;
    text?: string;
    from_url?: string;
  }>;
  subtype?: string;
  bot_id?: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  messageCount: number;
  participantCount: number;
  participants: Map<string, SlackUser>;
  firstMessage?: Date;
  lastMessage?: Date;
  averageResponseTime?: number;
  threadCount: number;
  topics: string[];
}

export interface SlackUser {
  id: string;
  name: string;
  realName?: string;
  messageCount: number;
  threadCount: number;
  reactionCount: number;
  mentionCount: number;
  channels: Set<string>;
  lastActive?: Date;
  responsiveness: number; // 0-1 scale
}

export interface CommunicationEdge {
  from: string;
  to: string;
  weight: number;
  channels: string[];
  lastInteraction?: Date;
  interactionTypes: string[];
}

export interface CommunicationGraph {
  users: Map<string, SlackUser>;
  edges: CommunicationEdge[];
  bottlenecks: string[];
  isolated: string[];
  hubs: string[];
}

export interface WorkflowDiscussion {
  id: string;
  channel: string;
  topic: string;
  participants: string[];
  startDate: Date;
  endDate?: Date;
  messageCount: number;
  resolved: boolean;
  keywords: string[];
  summary?: string;
}

export interface CommunicationBottleneck {
  type: "single_point_of_failure" | "slow_response" | "overloaded_channel" | "isolated_member";
  severity: "low" | "medium" | "high";
  description: string;
  affectedUsers: string[];
  affectedChannels?: string[];
  recommendation: string;
}

class SlackParser {
  private slackPath: string;
  private channels: Map<string, SlackChannel> = new Map();
  private users: Map<string, SlackUser> = new Map();
  private messages: SlackMessage[] = [];
  private edges: CommunicationEdge[] = [];
  private statePath: string;

  // Known Hacker Valley Media team members
  private knownTeam = new Map<string, string>([
    ["ron", "Ron Eddings"],
    ["chris", "Chris Dingman"],
    ["emily", "Emily"],
    ["josh", "Josh"],
    ["brandie", "Brandie"],
    ["marco", "Marco"],
  ]);

  // Workflow-related keywords
  private workflowKeywords = [
    "deadline", "due", "deliverable", "milestone", "sprint",
    "task", "project", "assigned", "review", "approve",
    "blocked", "blocker", "waiting", "dependency", "help",
    "done", "completed", "finished", "shipped", "launched",
  ];

  constructor() {
    this.slackPath = `${config.vramPath}/10-19_Work/14_Communications/14.02_slack/json`;
    this.statePath = `${config.triadPath}/${config.statePath}/slack-data.json`;
  }

  /**
   * Parse a single Slack message file (daily JSON)
   */
  async parseMessageFile(filePath: string): Promise<SlackMessage[]> {
    try {
      const file = Bun.file(filePath);
      if (!await file.exists()) return [];

      const content = await file.json() as SlackMessage[];
      return content.filter(msg => msg.type === "message" && !msg.bot_id);
    } catch (error) {
      await logger.warn("slack_file_parse_error", {
        file: filePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }

  /**
   * Index all messages from a channel
   */
  async indexChannel(channelName: string): Promise<SlackChannel> {
    const channelPath = `${this.slackPath}/${channelName}`;
    const channel: SlackChannel = {
      id: channelName,
      name: channelName,
      messageCount: 0,
      participantCount: 0,
      participants: new Map(),
      threadCount: 0,
      topics: [],
    };

    try {
      const glob = new Bun.Glob("*.json");
      const files: string[] = [];

      for await (const file of glob.scan({ cwd: channelPath, absolute: true })) {
        files.push(file);
      }

      for (const filePath of files.sort()) {
        const messages = await this.parseMessageFile(filePath);

        for (const msg of messages) {
          channel.messageCount++;
          this.messages.push({ ...msg, team: channelName });

          // Track user
          const userId = msg.user || "unknown";
          const userName = msg.user_profile?.real_name || msg.user_profile?.name || userId;

          if (!channel.participants.has(userId)) {
            channel.participants.set(userId, {
              id: userId,
              name: userName,
              realName: msg.user_profile?.real_name,
              messageCount: 0,
              threadCount: 0,
              reactionCount: 0,
              mentionCount: 0,
              channels: new Set(),
              responsiveness: 0.5,
            });
          }

          const participant = channel.participants.get(userId)!;
          participant.messageCount++;
          participant.channels.add(channelName);

          // Track threads
          if (msg.thread_ts && msg.thread_ts !== msg.ts) {
            participant.threadCount++;
          }
          if (msg.reply_count && msg.reply_count > 0) {
            channel.threadCount++;
          }

          // Track message date
          const msgDate = new Date(parseFloat(msg.ts) * 1000);
          if (!channel.firstMessage || msgDate < channel.firstMessage) {
            channel.firstMessage = msgDate;
          }
          if (!channel.lastMessage || msgDate > channel.lastMessage) {
            channel.lastMessage = msgDate;
          }

          // Update global user map
          this.updateGlobalUser(userId, userName, msg, channelName);

          // Extract mentions and build edges
          this.extractMentions(msg, userId, channelName);
        }
      }

      channel.participantCount = channel.participants.size;
      this.channels.set(channelName, channel);

      await logger.debug("slack_channel_indexed", {
        channel: channelName,
        messages: channel.messageCount,
        participants: channel.participantCount,
      });

    } catch (error) {
      await logger.warn("slack_channel_index_error", {
        channel: channelName,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return channel;
  }

  /**
   * Update global user tracking
   */
  private updateGlobalUser(
    userId: string,
    userName: string,
    msg: SlackMessage,
    channelName: string
  ): void {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        id: userId,
        name: userName,
        realName: msg.user_profile?.real_name,
        messageCount: 0,
        threadCount: 0,
        reactionCount: 0,
        mentionCount: 0,
        channels: new Set(),
        responsiveness: 0.5,
      });
    }

    const user = this.users.get(userId)!;
    user.messageCount++;
    user.channels.add(channelName);

    const msgDate = new Date(parseFloat(msg.ts) * 1000);
    if (!user.lastActive || msgDate > user.lastActive) {
      user.lastActive = msgDate;
    }

    if (msg.thread_ts && msg.thread_ts !== msg.ts) {
      user.threadCount++;
    }

    if (msg.reactions) {
      user.reactionCount += msg.reactions.length;
    }
  }

  /**
   * Extract mentions and build communication edges
   */
  private extractMentions(msg: SlackMessage, fromUser: string, channel: string): void {
    const mentionPattern = /<@(\w+)>/g;
    let match;

    while ((match = mentionPattern.exec(msg.text)) !== null) {
      const toUser = match[1];

      // Update mention count
      if (this.users.has(toUser)) {
        this.users.get(toUser)!.mentionCount++;
      }

      // Find existing edge or create new one
      let edge = this.edges.find(e =>
        (e.from === fromUser && e.to === toUser) ||
        (e.from === toUser && e.to === fromUser)
      );

      if (!edge) {
        edge = {
          from: fromUser,
          to: toUser,
          weight: 0,
          channels: [],
          interactionTypes: [],
        };
        this.edges.push(edge);
      }

      edge.weight++;
      if (!edge.channels.includes(channel)) {
        edge.channels.push(channel);
      }
      edge.lastInteraction = new Date(parseFloat(msg.ts) * 1000);
      if (!edge.interactionTypes.includes("mention")) {
        edge.interactionTypes.push("mention");
      }
    }

    // Track thread replies as interactions
    if (msg.thread_ts && msg.thread_ts !== msg.ts) {
      // Find original thread author in this context (simplified)
      if (!this.edges.find(e => e.interactionTypes.includes("thread_reply"))) {
        // Will be enhanced when we have full thread context
      }
    }
  }

  /**
   * Index all channels
   */
  async indexAllChannels(): Promise<void> {
    try {
      const glob = new Bun.Glob("*");
      const channels: string[] = [];

      for await (const dir of glob.scan({ cwd: this.slackPath, onlyFiles: false })) {
        // Check if it's a directory (has .json files)
        const testGlob = new Bun.Glob("*.json");
        let hasFiles = false;
        for await (const _ of testGlob.scan({ cwd: `${this.slackPath}/${dir}` })) {
          hasFiles = true;
          break;
        }
        if (hasFiles) {
          channels.push(dir);
        }
      }

      for (const channel of channels) {
        await this.indexChannel(channel);
      }

      await logger.info("slack_full_index_complete", {
        channels: this.channels.size,
        users: this.users.size,
        messages: this.messages.length,
        edges: this.edges.length,
      });

    } catch (error) {
      await logger.error("slack_index_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Build communication graph
   */
  buildCommunicationGraph(): CommunicationGraph {
    const graph: CommunicationGraph = {
      users: this.users,
      edges: this.edges,
      bottlenecks: [],
      isolated: [],
      hubs: [],
    };

    // Identify hubs (high degree nodes)
    const userDegrees = new Map<string, number>();
    for (const edge of this.edges) {
      userDegrees.set(edge.from, (userDegrees.get(edge.from) || 0) + edge.weight);
      userDegrees.set(edge.to, (userDegrees.get(edge.to) || 0) + edge.weight);
    }

    const avgDegree = Array.from(userDegrees.values()).reduce((a, b) => a + b, 0) / userDegrees.size || 1;

    for (const [userId, degree] of userDegrees) {
      if (degree > avgDegree * 2) {
        graph.hubs.push(userId);
      }
    }

    // Identify isolated users (no or very few interactions)
    for (const [userId, user] of this.users) {
      const degree = userDegrees.get(userId) || 0;
      if (degree < avgDegree * 0.1 && user.messageCount > 10) {
        graph.isolated.push(userId);
      }
    }

    // Identify bottlenecks (users who are only connection between groups)
    // Simplified: users with high betweenness (connected to many otherwise unconnected users)
    for (const hub of graph.hubs) {
      const hubEdges = this.edges.filter(e => e.from === hub || e.to === hub);
      const connectedUsers = new Set<string>();
      for (const edge of hubEdges) {
        connectedUsers.add(edge.from === hub ? edge.to : edge.from);
      }

      // Check if connected users talk to each other
      let isolatedConnections = 0;
      const connectedArray = Array.from(connectedUsers);
      for (let i = 0; i < connectedArray.length; i++) {
        for (let j = i + 1; j < connectedArray.length; j++) {
          const hasDirectEdge = this.edges.some(e =>
            (e.from === connectedArray[i] && e.to === connectedArray[j]) ||
            (e.from === connectedArray[j] && e.to === connectedArray[i])
          );
          if (!hasDirectEdge) isolatedConnections++;
        }
      }

      if (isolatedConnections > connectedUsers.size) {
        graph.bottlenecks.push(hub);
      }
    }

    return graph;
  }

  /**
   * Identify communication bottlenecks
   */
  identifyBottlenecks(): CommunicationBottleneck[] {
    const bottlenecks: CommunicationBottleneck[] = [];
    const graph = this.buildCommunicationGraph();

    // Single point of failure
    for (const hub of graph.bottlenecks) {
      const user = this.users.get(hub);
      bottlenecks.push({
        type: "single_point_of_failure",
        severity: "high",
        description: `${user?.realName || user?.name || hub} is a critical communication hub`,
        affectedUsers: [hub],
        recommendation: "Cross-train team members and establish backup communication paths",
      });
    }

    // Isolated members
    for (const isolated of graph.isolated) {
      const user = this.users.get(isolated);
      bottlenecks.push({
        type: "isolated_member",
        severity: "medium",
        description: `${user?.realName || user?.name || isolated} has limited team interaction`,
        affectedUsers: [isolated],
        recommendation: "Include in more team discussions and pair activities",
      });
    }

    // Overloaded channels
    for (const [channelName, channel] of this.channels) {
      const messagesPerDay = channel.messageCount /
        Math.max(1, this.daysBetween(channel.firstMessage, channel.lastMessage));

      if (messagesPerDay > 100) {
        bottlenecks.push({
          type: "overloaded_channel",
          severity: "medium",
          description: `#${channelName} has very high traffic (${messagesPerDay.toFixed(0)} msg/day)`,
          affectedUsers: Array.from(channel.participants.keys()),
          affectedChannels: [channelName],
          recommendation: "Consider splitting into topic-specific channels",
        });
      }
    }

    // Slow response patterns (simplified - would need timestamp analysis)
    for (const [userId, user] of this.users) {
      if (user.threadCount > 0 && user.messageCount / user.threadCount < 0.3) {
        bottlenecks.push({
          type: "slow_response",
          severity: "low",
          description: `${user.realName || user.name} may have delayed response patterns`,
          affectedUsers: [userId],
          recommendation: "Consider implementing async communication norms",
        });
      }
    }

    return bottlenecks;
  }

  /**
   * Track workflow discussions
   */
  trackWorkflowDiscussions(): WorkflowDiscussion[] {
    const discussions: WorkflowDiscussion[] = [];
    const threadGroups = new Map<string, SlackMessage[]>();

    // Group messages by thread
    for (const msg of this.messages) {
      const threadId = msg.thread_ts || msg.ts;
      if (!threadGroups.has(threadId)) {
        threadGroups.set(threadId, []);
      }
      threadGroups.get(threadId)!.push(msg);
    }

    // Analyze threads for workflow content
    for (const [threadId, messages] of threadGroups) {
      if (messages.length < 2) continue;

      const fullText = messages.map(m => m.text.toLowerCase()).join(" ");
      const matchedKeywords = this.workflowKeywords.filter(kw => fullText.includes(kw));

      if (matchedKeywords.length >= 2) {
        const participants = [...new Set(messages.map(m => m.user))];
        const firstMsg = messages[0];
        const lastMsg = messages[messages.length - 1];

        // Determine topic from first message
        const topic = this.extractTopic(firstMsg.text);

        // Check if resolved (mentions of "done", "completed", etc.)
        const resolved = ["done", "completed", "finished", "shipped", "resolved"].some(
          word => fullText.includes(word)
        );

        discussions.push({
          id: threadId,
          channel: firstMsg.team || "unknown",
          topic,
          participants,
          startDate: new Date(parseFloat(firstMsg.ts) * 1000),
          endDate: new Date(parseFloat(lastMsg.ts) * 1000),
          messageCount: messages.length,
          resolved,
          keywords: matchedKeywords,
          summary: firstMsg.text.substring(0, 200),
        });
      }
    }

    return discussions.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  /**
   * Extract topic from message text
   */
  private extractTopic(text: string): string {
    // Remove mentions and links
    const cleanText = text
      .replace(/<@\w+>/g, "")
      .replace(/<https?:\/\/[^>]+>/g, "")
      .trim();

    // Take first sentence or first 100 chars
    const firstSentence = cleanText.split(/[.!?]/)[0];
    return firstSentence.length > 100 ? firstSentence.substring(0, 100) + "..." : firstSentence;
  }

  /**
   * Calculate days between two dates
   */
  private daysBetween(start?: Date, end?: Date): number {
    if (!start || !end) return 1;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }

  /**
   * Generate team communication summary
   */
  generateCommunicationSummary(): {
    totalMessages: number;
    totalChannels: number;
    totalUsers: number;
    mostActiveChannel: string;
    mostActiveUser: string;
    avgMessagesPerDay: number;
    threadEngagement: number;
    communicationHealth: number;
    topBottlenecks: CommunicationBottleneck[];
    recentWorkflows: WorkflowDiscussion[];
  } {
    let mostActiveChannel = "";
    let maxChannelMessages = 0;
    let mostActiveUser = "";
    let maxUserMessages = 0;
    let totalThreads = 0;
    let firstDate: Date | undefined;
    let lastDate: Date | undefined;

    for (const [name, channel] of this.channels) {
      if (channel.messageCount > maxChannelMessages) {
        maxChannelMessages = channel.messageCount;
        mostActiveChannel = name;
      }
      totalThreads += channel.threadCount;

      if (!firstDate || (channel.firstMessage && channel.firstMessage < firstDate)) {
        firstDate = channel.firstMessage;
      }
      if (!lastDate || (channel.lastMessage && channel.lastMessage > lastDate)) {
        lastDate = channel.lastMessage;
      }
    }

    for (const [id, user] of this.users) {
      if (user.messageCount > maxUserMessages) {
        maxUserMessages = user.messageCount;
        mostActiveUser = user.realName || user.name;
      }
    }

    const days = this.daysBetween(firstDate, lastDate);
    const avgMessagesPerDay = this.messages.length / days;
    const threadEngagement = totalThreads / Math.max(1, this.messages.length);

    // Communication health score (0-1)
    const bottlenecks = this.identifyBottlenecks();
    const graph = this.buildCommunicationGraph();

    const healthFactors = [
      Math.min(1, this.channels.size / 5), // Channel diversity
      Math.min(1, this.users.size / 5), // User participation
      1 - (graph.isolated.length / Math.max(1, this.users.size)), // Inclusion
      1 - (graph.bottlenecks.length / Math.max(1, graph.hubs.length || 1)), // Distribution
      Math.min(1, threadEngagement * 5), // Thread engagement
    ];

    const communicationHealth = healthFactors.reduce((a, b) => a + b, 0) / healthFactors.length;

    return {
      totalMessages: this.messages.length,
      totalChannels: this.channels.size,
      totalUsers: this.users.size,
      mostActiveChannel,
      mostActiveUser,
      avgMessagesPerDay,
      threadEngagement,
      communicationHealth,
      topBottlenecks: bottlenecks.slice(0, 5),
      recentWorkflows: this.trackWorkflowDiscussions().slice(0, 10),
    };
  }

  /**
   * Get channels list
   */
  getChannels(): SlackChannel[] {
    return Array.from(this.channels.values());
  }

  /**
   * Get users list
   */
  getUsers(): SlackUser[] {
    return Array.from(this.users.values());
  }

  /**
   * Load cached data
   */
  async loadSlackData(): Promise<void> {
    try {
      const file = Bun.file(this.statePath);
      if (await file.exists()) {
        const data = await file.json();

        // Restore channels
        for (const channel of data.channels || []) {
          this.channels.set(channel.id, {
            ...channel,
            firstMessage: channel.firstMessage ? new Date(channel.firstMessage) : undefined,
            lastMessage: channel.lastMessage ? new Date(channel.lastMessage) : undefined,
            participants: new Map(Object.entries(channel.participants || {})),
          });
        }

        // Restore users
        for (const user of data.users || []) {
          this.users.set(user.id, {
            ...user,
            lastActive: user.lastActive ? new Date(user.lastActive) : undefined,
            channels: new Set(user.channels || []),
          });
        }

        // Restore edges
        this.edges = (data.edges || []).map((e: any) => ({
          ...e,
          lastInteraction: e.lastInteraction ? new Date(e.lastInteraction) : undefined,
        }));

        await logger.debug("slack_data_loaded", {
          channels: this.channels.size,
          users: this.users.size,
          edges: this.edges.length,
        });
      }
    } catch (error) {
      await logger.warn("slack_data_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save data to cache
   */
  async saveSlackData(): Promise<void> {
    try {
      const data = {
        channels: Array.from(this.channels.values()).map(c => ({
          ...c,
          participants: Object.fromEntries(c.participants),
        })),
        users: Array.from(this.users.values()).map(u => ({
          ...u,
          channels: Array.from(u.channels),
        })),
        edges: this.edges,
        lastUpdated: new Date().toISOString(),
      };

      await Bun.write(this.statePath, JSON.stringify(data, null, 2));

      await logger.debug("slack_data_saved", {
        channels: this.channels.size,
        users: this.users.size,
      });
    } catch (error) {
      await logger.error("slack_data_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const slackParser = new SlackParser();
