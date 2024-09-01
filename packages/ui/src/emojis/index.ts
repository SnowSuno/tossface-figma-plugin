import { Hexcode } from "emojibase";
import type { EmojiMeta } from "./getEmojiMeta";

/**
 * Emoji metadata precompiled at build time
 */
export const emojiMeta = import.meta.compileTime<EmojiMeta>("./compileTime.ts");

export const getEmoji = (hexcode: Hexcode) => emojiMeta.emojiTable[hexcode];
