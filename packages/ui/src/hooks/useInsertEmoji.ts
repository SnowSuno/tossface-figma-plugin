import { emojiQuery } from "@/api/emoji";
import { BaseTossEmoji } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { compact } from "es-toolkit";

export function useInsertEmoji() {
  const queryClient = useQueryClient();

  const insertEmoji = async (emoji: BaseTossEmoji) => {
    const emojiData = await queryClient.fetchQuery(emojiQuery(emoji.id));

    parent.postMessage(
      {
        pluginMessage: {
          type: "create",
          emojis: [
            {
              name: compact([emoji.unicode, emoji.label.ko]).join(" "),
              source: emojiData,
            },
          ],
        },
        pluginId: "*",
      },
      "*",
    );
  };

  return { insertEmoji };
}
