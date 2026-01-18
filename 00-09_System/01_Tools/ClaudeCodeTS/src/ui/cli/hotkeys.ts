export type CliScreen = "prompt" | "transcript";

export type CliHotkey = "ctrl+o" | "ctrl+e" | "esc" | "ctrl+c";

export function applyTranscriptHotkey(
  state: { screen: CliScreen; showAllInTranscript: boolean },
  hotkey: CliHotkey
): { screen: CliScreen; showAllInTranscript: boolean } {
  switch (hotkey) {
    case "ctrl+o":
      return { screen: state.screen === "prompt" ? "transcript" : "prompt", showAllInTranscript: false };
    case "ctrl+e":
      if (state.screen !== "transcript") return state;
      return { ...state, showAllInTranscript: !state.showAllInTranscript };
    case "esc":
    case "ctrl+c":
      if (state.screen !== "transcript") return state;
      return { screen: "prompt", showAllInTranscript: false };
  }
}

