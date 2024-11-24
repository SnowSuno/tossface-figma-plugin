import ky from "ky";
import { EmojiId } from "@/types";
import { queryOptions } from "@tanstack/react-query";
import { createStackPool } from "@/utils/pool";
import { memoize } from "es-toolkit";
import { tossEmojis } from "@/emojis";
import { queryClient } from "@/query";

const fetchEmoji = memoize((emojiId: EmojiId) =>
  ky
    .get(
      `https://raw.githubusercontent.com/toss/tossface/main/dist/svg/${emojiId}.svg`,
      { headers: { Connection: "keep-alive" } },
    )
    .text(),
);

const apiPool = createStackPool({ concurrency: 200 });

export const emojiQuery = (emojiId: EmojiId) =>
  queryOptions({
    queryKey: ["emoji", emojiId],
    queryFn: () => apiPool.run(() => fetchEmoji(emojiId)),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
  });

// Schedule all tasks at low priorty
// tossEmojis.list.forEach(emoji =>
//   queryClient.prefetchQuery(emojiQuery(emoji.id)),
// );
