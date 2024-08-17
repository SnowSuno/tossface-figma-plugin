import unicodeVersions from "emojibase-data/versions/unicode.json" with { type: "json" };

import emojiDataKo from "emojibase-data/ko/compact.json" with { type: "json" };
import emojiDataEn from "emojibase-data/en/compact.json" with { type: "json" };

const SUPPORTED_EMOJI_VERSION = 14;

export async function getEmojiMeta() {
  const supportedEmojis = Object.entries(unicodeVersions)
    .filter(([version]) => Number(version) <= SUPPORTED_EMOJI_VERSION)
    .flatMap(([_, emojis]) => emojis);

  emojiDataKo.map(emoji => {
    emoji.emoticon;
  });

  return { supportedEmojis };
}

export type EmojiMeta = Awaited<ReturnType<typeof getEmojiMeta>>;
