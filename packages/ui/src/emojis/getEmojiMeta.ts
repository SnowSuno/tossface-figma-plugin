import path from "node:path";

import { emojiSource } from "./source";
import { readDirAsync } from "./utils";
import { TossEmoji } from "@/types";
import { difference } from "es-toolkit";

export async function getEmojiMeta() {
  const tossfaceEmojis = new Set(
    (
      await readDirAsync(
        path.resolve(__dirname, "../../../../tossface/dist/svg"),
      )
    ).map(file => file.replace(/\.svg$/, "")),
  );

  const isSupported = (emoji: TossEmoji) => tossfaceEmojis.has(emoji.id);
  const emojis = emojiSource.filter(isSupported);

  // 모든 토스페이스 이모지가 포함되었는지 확인해요.
  const notHandledEmojis = difference(
    [...tossfaceEmojis],
    emojis.flatMap(emoji => [
      emoji.id,
      ...(emoji.skins ?? []).map(skinEmoji => skinEmoji.id),
    ]),
  );

  if (notHandledEmojis.length > 0) {
    console.warn(
      `[Warning] Some emojis are supported by tossface but not included in the build.\n`,
      notHandledEmojis,
    );
  }

  /* Build size */
  console.info(
    `Precompiled emoji meta size: ${JSON.stringify(emojis).length / 1000} kB`,
  );
  return { emojis: emojis };
}

export type EmojiMeta = Awaited<ReturnType<typeof getEmojiMeta>>;
