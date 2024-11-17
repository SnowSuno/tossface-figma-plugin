import { Brand } from "ts-brand";
import { Localized } from "@/common/locale";

/**
 *
 */
export type EmojiId = Brand<string, "emojiId">;

/**
 *
 */
export type Unicode = Brand<string, "unicode">;

export type Group =
  | "people"
  | "animals"
  | "food"
  | "activity"
  | "travel"
  | "objects"
  | "symbol"
  | "flags"
  | "custom";

export interface BaseTossEmoji {
  id: EmojiId;
  label: Localized<string>;
  group: Group;
}

export interface TossEmoji extends BaseTossEmoji {
  skins?: BaseTossEmoji[];
  searchMeta: string[];
}
