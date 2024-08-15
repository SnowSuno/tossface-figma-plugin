import type { ChangeEvent } from "react";
import type { Emoji } from "@/typings/emoji";

import { useState } from "react";
import { containsNonEmoji, getEmojis, getSvgFromEmoji } from "@/utils/emoji";

export const useEmojiInput = (error?: (message: string) => void) => {
  const [value, setValue] = useState("");
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const validateAndSetValue = (value: string) => {
    const emojis = getEmojis(value).map(getSvgFromEmoji);
    const validEmojis = emojis.filter(svg => !!svg) as Emoji[];

    if (emojis.length !== validEmojis.length)
      error?.(
        containsNonEmoji(value)
          ? "이모지만 입력할 수 있어요."
          : "지원되지 않는 이모지에요.",
      );

    setValue(validEmojis.map(({ name }) => name).join(""));
    setEmojis(validEmojis);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    validateAndSetValue(e.target.value);
  };

  return { input: { value, onChange }, emojis };
};
