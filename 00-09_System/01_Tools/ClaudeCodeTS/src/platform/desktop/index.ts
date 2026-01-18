export type DesktopPlatform = {
  phase: "4";
  host: "desktop";
};

export { createNodeHostCapabilities as createDesktopHostCapabilities } from "../node/host.js";

export * from "./chromeNativeMessaging.js";
