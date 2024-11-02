import { emojiQuery } from "@/api/emoji";
import { emojiMeta } from "@/emojis";
import { EmojiId } from "@/types";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { chunk } from "es-toolkit";
import { useEffect } from "react";

export function useQueryManager() {
  const queryClient = useQueryClient();

  // const data = useQueries({
  //   queries: emojiMeta.emojis.map(emoji => ({
  //     ...emojiQuery(emoji.id),
  //     enabled: false,
  //   })),
  // });

  useEffect(() => {
    const fetchBatch = ([emojiChunk, ...rest]: EmojiId[][]) => {
      Promise.all(
        emojiChunk.map(id => queryClient.prefetchQuery(emojiQuery(id))),
      ).then(() => {
        if (rest.length > 0) {
          fetchBatch(rest);
        }
      });
    };

    fetchBatch(
      chunk(
        emojiMeta.emojis.map(emoji => emoji.id),
        100,
      ),
    );
  }, []);
}
