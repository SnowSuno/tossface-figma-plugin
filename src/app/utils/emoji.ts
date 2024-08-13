import type { Emoji } from "@/typings/emoji";
import emojiRegex from "emoji-regex";

const numberCharacters = {
  "0": "zero",
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
  "*": "asterisk",
  "#": "numbersign",
} as const;

export const containsNonEmoji = (string: string) =>
  string.replaceAll(emojiRegex(), "").replaceAll(/\d|\*|#/g, "").length > 0;

export const getEmojis = (string: string): string[] =>
  [...new Intl.Segmenter().segment(string)].map(({ segment }) => segment);

export const parseEmojiCode = (emoji: string) => {
  if (emoji in numberCharacters) return numberCharacters[emoji];

  const unicode = [...emoji]
    .map(char => "u" + char.codePointAt(0)?.toString(16).toUpperCase() ?? "")
    .filter(code => code !== "uFE0F")
    .join("_");

  return /(\w|_)*/.test(unicode) ? unicode : null;
};

export const getSvgFromEmoji = (emoji: string): Emoji | null => {
  const code = parseEmojiCode(emoji);

  if (!code) return null;

  try {
    return {
      name: emoji,
      source: "", // TODO : 다음 업데이트에서 fetch로 변경될 예정
    };
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Cannot find module"))
      return null;
    throw e;
  }
};
