import { isArray } from "es-toolkit/compat";
import { serializeSearchKeyword } from "@/utils/search";
import { Emoji } from "emojibase";

const array = <T>(v: T | T[] | undefined = []) => (isArray(v) ? v : [v]);

export const generateSearchMeta = (emoji: Emoji): string[] =>
  [
    emoji.emoji,
    emoji.label,
    ...array(emoji.tags),
    ...array(emoji.shortcodes),
    ...array(emoji.emoticon),
    ...array(emoji.skins).map(skinEmoji => skinEmoji.emoji),
  ].map(serializeSearchKeyword);
