import { EmojiId, Group } from "@/types";
import { Localized } from "./locale";

export interface GroupMeta {
  key: Group;
  emoji: EmojiId;
  name: Localized<string>;
}

export const groupsMeta: GroupMeta[] = [
  {
    key: "custom",
    emoji: "uE11E" as EmojiId,
    name: { ko: "토스", en: "" },
  },
  {
    key: "people",
    emoji: "u1F600" as EmojiId,
    name: { ko: "얼굴 및 사람", en: "Smileys & People" },
  },
  {
    key: "animals",
    emoji: "u1F436" as EmojiId,
    name: { ko: "동물 및 자연", en: "Animals & Nature" },
  },
  {
    key: "food",
    emoji: "u1F34F" as EmojiId,
    name: { ko: "음식", en: "Food" },
  },
  {
    key: "activity",
    emoji: "u26BD" as EmojiId,
    name: { ko: "활동", en: "Activities" },
  },
  {
    key: "travel",
    emoji: "u1F697" as EmojiId,
    name: { ko: "여행", en: "Travel" },
  },
  {
    key: "objects",
    emoji: "u231A" as EmojiId,
    name: { ko: "물건", en: "Objects" },
  },
  {
    key: "symbol",
    emoji: "u2764" as EmojiId,
    name: { ko: "기호", en: "Symbols" },
  },
  {
    key: "flags",
    emoji: "u1F3F3" as EmojiId,
    name: { ko: "깃발", en: "Flags" },
  },
];

const orderMap = Object.fromEntries(
  groupsMeta.map((group, index) => [group.key, index]),
) as Record<Group, number>;

export const byGroup = (emoji: { group: Group }) => orderMap[emoji.group];
