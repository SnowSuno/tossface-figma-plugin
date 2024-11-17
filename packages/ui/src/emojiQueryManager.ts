import { emojiQuery } from "./api/emoji";
import { tossEmojis } from "./emojis";
import { queryClient } from "./query";
import { createStackPool } from "./utils/pool";

export function emojiQueryManager() {
  const apiPool = createStackPool({ concurrency: 100 });

  tossEmojis.list.forEach(emoji =>
    apiPool.run(() => queryClient.prefetchQuery(emojiQuery(emoji.id))),
  );
}
