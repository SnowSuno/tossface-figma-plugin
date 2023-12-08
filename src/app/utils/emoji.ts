import type { Emoji } from "@/typings/emoji";

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

export const getEmojis = (string: string): string[] =>
  [...new Intl.Segmenter().segment(string)].map(({ segment }) => segment);

export const parseEmojiCode = (emoji: string) => {
  if (emoji in numberCharacters) return numberCharacters[emoji];

  const unicode = [...emoji]
    .map(char => "u" + char.codePointAt(0)?.toString(16).toUpperCase() ?? "")
    .join("_");

  return /(\w|_)*/.test(unicode) ? unicode : null;
};

export const getSvgFromEmoji = (emoji: string): Emoji | null => {
  const code = parseEmojiCode(emoji);

  if (!code) return null;

  try {
    return {
      name: emoji,
      source: require(`@tossface/${code}.svg`),
    };
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Cannot find module"))
      return null;
    throw e;
  }
};
