import { emojiQuery } from "@/api/emoji";
import { BaseTossEmoji, EmojiId } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

export function useInsertEmoji() {
  const queryClient = useQueryClient();

  const insertEmoji = async (emoji: BaseTossEmoji) => {
    const emojiData = await queryClient.fetchQuery(emojiQuery(emoji.id));

    parent.postMessage(
      {
        pluginMessage: {
          type: "create",
          emojis: [{ name: emoji.label.ko, source: emojiData }],
        },
        pluginId: "*",
      },
      "*",
    );
  };

  return { insertEmoji };
}
