import type { Localized } from "@/common/locale";
import type { EmojiId, TossEmoji, Group } from "@/types";

import { serializeSearchKeyword } from "@/utils/search";
import { mapValues } from "es-toolkit";

const toUnicode = (id: string) => {
  try {
    return id
      .split("_")
      .map(part => String.fromCodePoint(parseInt(part.substring(1), 16)))
      .join("");
  } catch {
    return id;
  }
};

export const customEmoji = ({
  id,
  label,
  extraTags,
  group = "custom",
}: {
  id: string;
  label: Localized<string>;
  extraTags: string[];
  group?: Group;
}): TossEmoji => ({
  id: id as EmojiId,
  label,
  searchMeta: [toUnicode(id), ...Object.values(label), ...extraTags].map(
    serializeSearchKeyword,
  ),
  group,
});

const skinToneMeta = [
  {
    id: "u1F3FB",
    label: { ko: "하얀 피부", en: "light skin tone" },
  },
  {
    id: "u1F3FC",
    label: { ko: "연한 갈색 피부", en: "medium-light skin tone" },
  },
  {
    id: "u1F3FD",
    label: { ko: "갈색 피부", en: "medium skin tone" },
  },
  {
    id: "u1F3FE",
    label: { ko: "진한 갈색 피부", en: "medium-dark skin tone" },
  },
  {
    id: "u1F3FF",
    label: { ko: "검은색 피부", en: "dark skin tone" },
  },
] as const;

export const appendCustomSkinTone = (emoji: TossEmoji) => {
  if (emoji.skins && emoji.skins.length > 0) return;

  emoji.skins = skinToneMeta.map(skinTone => ({
    id: [emoji.id, skinTone.id].join("_") as EmojiId,
    unicode: emoji.unicode, // TODO : Append skinTone
    label: mapValues(emoji.label, (value, locale) =>
      [value, skinTone.label[locale]].join(": "),
    ),
    group: emoji.group,
  }));
};
