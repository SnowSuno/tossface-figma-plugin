import type { ChangeEvent } from "react";
import type { Emoji } from "@/typings/emoji";

import { useState } from "react";
import { getEmojis, getSvgFromEmoji } from "@/app/utils/emoji";

export const useEmojiInput = (error?: () => void) => {
  const [value, setValue] = useState("");
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const validateAndSetValue = (value: string) => {
    const emojis = getEmojis(value).map(getSvgFromEmoji);
    const validEmojis = emojis.filter(svg => !!svg) as Emoji[];

    if (emojis.length !== validEmojis.length) error?.();

    setValue(validEmojis.map(({ name }) => name).join(""));
    setEmojis(validEmojis);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    validateAndSetValue(e.target.value);
  };

  return { input: { value, onChange }, emojis };
};
