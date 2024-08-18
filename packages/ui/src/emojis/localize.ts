import type { CompactEmoji } from "emojibase";

import { isString, mergeWith } from "es-toolkit";
import { isArray } from "es-toolkit/compat";

export type Locale = "ko" | "en";

export interface LocalizedEmoji extends Omit<CompactEmoji, "label" | "skins"> {
  label: Record<Locale, string>;
  skins?: LocalizedEmoji[];
}

function localizeEmoji(locale: Locale, emoji: CompactEmoji): LocalizedEmoji {
  return {
    ...emoji,
    label: { [locale]: emoji.label },
    skins: emoji.skins?.map(skinEmoji => localizeEmoji(locale, skinEmoji)),
  } as LocalizedEmoji;
}
const localizeEmojis = (locale: Locale, emojis: CompactEmoji[]) =>
  emojis.map(emoji => localizeEmoji(locale, emoji));

const isArrayOfStrings = (v: unknown) => isArray(v) && v.every(isString);

export function mergeEmojis(emojiMap: Record<Locale, CompactEmoji[]>) {
  const mergedEmojis: LocalizedEmoji[] = [];

  Object.entries(emojiMap)
    .map(([locale, emojis]) => localizeEmojis(locale as Locale, emojis))
    .forEach(localizedEmoji => {
      mergeWith(mergedEmojis, localizedEmoji, (a, b) => {
        if (isArrayOfStrings(a) && isArrayOfStrings(b)) return [...a, ...b];
      });
    });

  return mergedEmojis;
}
