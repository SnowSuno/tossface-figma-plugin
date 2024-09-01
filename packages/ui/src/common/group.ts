import { Group } from "@/types";
import { Hexcode } from "emojibase";
import { Localized } from "./locale";

interface GroupMeta {
  key: Group;
  emoji: Hexcode;
  name: Localized<string>;
}

export const groupsMeta: GroupMeta[] = [
  {
    key: "people",
    emoji: "",
    name: { ko: "얼굴 및 사람", en: "Smileys & People" },
  },
  {
    key: "animals",
    emoji: "",
    name: { ko: "동물 및 자연", en: "Animals & Nature" },
  },
  {
    key: "food",
    emoji: "",
    name: { ko: "음식", en: "Food" },
  },
  {
    key: "activity",
    emoji: "",
    name: { ko: "활동", en: "Activities" },
  },
  {
    key: "travel",
    emoji: "",
    name: { ko: "여행", en: "Travel" },
  },
  {
    key: "objects",
    emoji: "",
    name: { ko: "물건", en: "Objects" },
  },
  {
    key: "symbol",
    emoji: "",
    name: { ko: "기호", en: "Symbols" },
  },
  {
    key: "flags",
    emoji: "",
    name: { ko: "깃발", en: "Flags" },
  },
  {
    key: "custom",
    emoji: "",
    name: { ko: "기타", en: "" },
  },
];
