import fs from "node:fs";
import { promisify } from "node:util";
import path from "node:path";

import unicodeVersions from "emojibase-data/versions/unicode.json" with { type: "json" };

import emojiDataKo from "emojibase-data/ko/compact.json" with { type: "json" };
import emojiDataEn from "emojibase-data/en/compact.json" with { type: "json" };

import { mergeEmojis } from "./localize";
import { withSearchMeta } from "./search";

const SUPPORTED_EMOJI_VERSION = 14;

const readDirAsync = promisify(fs.readdir);
const emojiDataUniversal = mergeEmojis({
  ko: emojiDataKo,
  en: emojiDataEn,
}).map(withSearchMeta);

const toFileName = (hexcode: string) =>
  hexcode
    .split("-")
    .filter(unicode => unicode !== "FE0F")
    .map(unicode => `u${unicode}`)
    .join("_");

export async function getEmojiMeta() {
  console.log(emojiDataUniversal[200]);
  // console.log(mergedData[90]);

  const emojiFileNames = await readDirAsync(
    path.resolve(__dirname, "../../../../tossface/dist/svg"),
  );

  const supportedEmojis = Object.entries(unicodeVersions)
    .filter(([version]) => Number(version) <= SUPPORTED_EMOJI_VERSION)
    .flatMap(([_, emojis]) => emojis);

  const supportedSet = new Set(supportedEmojis);

  const allEmojis = emojiDataKo
    // .filter(emoji => supportedSet.has(emoji.hexcode))
    .flatMap(emoji => [
      emoji.hexcode,
      ...(emoji.skins?.map(emoji => emoji.hexcode) ?? []),
    ]);

  const fileSet = new Set(
    emojiFileNames.map(fileName => fileName.replace(".svg", "")),
  );

  const emojis = allEmojis.map(toFileName);

  const unsupported: string[] = [];

  emojis.forEach(emoji => {
    if (!fileSet.has(emoji)) {
      unsupported.push(emoji);
      return;
    }
    fileSet.delete(emoji);
  });

  console.log(JSON.stringify(emojiDataUniversal).length);

  // console.log(unsupported.length);
  // console.log(emojiDataKo.find(emoji => emoji.hexcode === "26F7"));
  // console.log(emojiDataKo.find(emoji => emoji.skins !== undefined));
  // console.log(fileSet);

  return { supportedEmojis, fileEmojis: [...fileSet], emojiDataUniversal };
}

export type EmojiMeta = Awaited<ReturnType<typeof getEmojiMeta>>;
