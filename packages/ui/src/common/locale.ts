import type { CompactEmoji } from "emojibase";

export type Locale = "ko" | "en";
export type Localized<T> = Record<Locale, T>;

type FlattenedEmoji = Omit<CompactEmoji, "skins">;

export const localize = <T>(locale: Locale, value: T) =>
  ({ [locale]: value }) as Localized<T>;

export interface LocalizedEmoji extends Omit<FlattenedEmoji, "label"> {
  label: Localized<string>;
}

export const localizeEmoji = (locale: Locale, emoji: FlattenedEmoji) => ({
  ...emoji,
  label: localize(locale, emoji.label),
});
