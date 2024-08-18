import { isArray } from "es-toolkit/compat";
import type { LocalizedEmoji } from "./localize";
import { serializeSearchKeyword } from "@/utils/search";

const array = <T>(v: T | T[] | undefined = []) => (isArray(v) ? v : [v]);

export const generateSearchMeta = (emoji: LocalizedEmoji): string[] =>
  [
    emoji.unicode,
    ...Object.values(emoji.label),
    ...array(emoji.tags),
    ...array(emoji.shortcodes),
    ...array(emoji.emoticon),
    ...array(emoji.skins).map(skinEmoji => skinEmoji.unicode),
  ].map(serializeSearchKeyword);

export const withSearchMeta = (emoji: LocalizedEmoji) => ({
  ...emoji,
  searchMeta: generateSearchMeta(emoji),
});
