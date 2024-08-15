import { Message } from "@tossface-figma/common";
import { useEffect } from "react";

export function postMessage(message: Message) {
  parent.postMessage({ pluginMessage: message, pluginId: __PLUGIN_ID__ }, "*");
}

export function useOnMessage(handler: (message: Message) => void) {
  useEffect(() => {
    const listener = (e: MessageEvent) => handler(e.data.pluginMessage);
    addEventListener("message", listener);

    return () => removeEventListener("message", listener);
  }, [handler]);
}
