import ky from "ky";
import { EmojiId } from "@/types";
import { queryOptions } from "@tanstack/react-query";

export const emojiQuery = (emojiId: EmojiId) =>
  queryOptions({
    queryKey: ["emoji", emojiId],
    queryFn: () =>
      ky
        .get(
          `https://raw.githubusercontent.com/toss/tossface/main/dist/svg/${emojiId}.svg`,
        )
        .text(),
  });
