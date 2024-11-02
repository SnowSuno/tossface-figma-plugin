import type { EmojiMeta } from "./emojis.compile";
import { groupBy } from "es-toolkit";

/**
 * Emoji metadata precompiled at build time
 */
const { emojis } = import.meta.compileTime<EmojiMeta>("./emojis.compile.ts");

const grouped = groupBy(emojis, emoji => emoji.group);

export const tossEmojis = { list: emojis, grouped };
