import { Brand } from "ts-brand";
import { Localized } from "@/common/locale";

/**
 *
 */
export type EmojiId = Brand<string, "emojiId">;

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
  unicode?: string; // TODO : Require after supporting custom unicodes
  label: Localized<string>;
  group: Group;
}

export interface TossEmoji extends BaseTossEmoji {
  skins?: BaseTossEmoji[];
  searchMeta: string[];
}
