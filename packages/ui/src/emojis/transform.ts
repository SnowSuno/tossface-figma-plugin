import { Locale, localize } from "@/common/locale";
import { generateSearchMeta } from "./search";
import type { Emoji, FlatEmoji } from "emojibase";
import type { BaseTossEmoji, EmojiId, Group, TossEmoji } from "@/types";

const toEmojiId = (hexcode: string) =>
  hexcode
    .split("-")
    .filter(unicode => unicode !== "FE0F")
    .map(unicode => `u${unicode}`)
    .join("_") as EmojiId;

const toTossGroup = (group: number | undefined = -1): Group => {
  const groupMap: Record<number, Group> = {
    0: "people",
    1: "people",
    2: "symbol",
    3: "animals",
    4: "food",
    5: "travel",
    6: "activity",
    7: "objects",
    8: "symbol",
    9: "flags",
    [-1]: "symbol",
  };

  return groupMap[group];
};

const toTossEmoji = (locale: Locale, emoji: FlatEmoji): BaseTossEmoji => ({
  id: toEmojiId(emoji.hexcode),
  label: localize(locale, emoji.label),
  group: toTossGroup(emoji.group),
});

export const transformEmojis = (locale: Locale, emojis: Emoji[]): TossEmoji[] =>
  emojis.map(({ skins, ...emoji }) => ({
    ...toTossEmoji(locale, emoji),
    searchMeta: generateSearchMeta(emoji),
    skins: skins?.map(skinEmoji => toTossEmoji(locale, skinEmoji)),
  }));
