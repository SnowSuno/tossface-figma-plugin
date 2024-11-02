import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Svg } from "./Svg";
import { emojiQuery } from "@/api/emoji";
import { EmojiId, TossEmoji } from "@/types";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { css, Interpolation, Theme } from "@emotion/react";

import { flex, size } from "@/styles";
import { noop, throttle } from "es-toolkit";
import { AnimatePresence, motion } from "framer-motion";
import { useInsertEmoji } from "@/hooks/useInsertEmoji";
import useClickOutside from "@/hooks/useClickOutside";

interface Props {
  emojiId: EmojiId;
  size?: number;
}

export const EmojiIcon = React.memo(
  ({ emojiId, size: sizeValue, ...props }: Props) => {
    const { data } = useQuery(emojiQuery(emojiId));

    return (
      <div css={sizeValue && size(sizeValue)} {...props}>
        {data && <Svg data={data} />}
      </div>
    );
  },
);

interface EmojiButtonProps {
  lane: number;
  top: number;
  emoji: TossEmoji;
  onInsert?: (emoji: TossEmoji) => void;
}

export const EMOJI_SIZE = 44;
const LANES = 8;

export const dismissPopup = throttle(
  () => dispatchEvent(new CustomEvent("dismissPopup")),
  1000,
);

export const EmojiButton = React.memo(
  ({ lane, top, emoji, onInsert = noop }: EmojiButtonProps) => {
    const { insertEmoji } = useInsertEmoji();
    const [popupOpen, setPopupOpen] = useState(false);

    const childNumber = (emoji.skins?.length ?? 0) + 1;

    const x = lane * EMOJI_SIZE;

    const start = Math.min(lane + childNumber, LANES) - childNumber;

    const queryClient = useQueryClient();

    useEffect(() => {
      emoji.skins?.forEach(emoji =>
        queryClient.prefetchQuery(emojiQuery(emoji.id)),
      );
    }, [emoji.skins]);

    useEffect(() => {
      const closePopup = () => setPopupOpen(false);

      addEventListener("dismissPopup", closePopup);
      return () => addEventListener("dismissPopup", closePopup);
    });

    const popupRef = useRef(null);
    useClickOutside(popupRef, () => setPopupOpen(false));

    return (
      <motion.div
        ref={popupRef}
        key={emoji.id}
        initial={false}
        layout
        animate={{
          top: popupOpen ? top - 4 : top,
          left: popupOpen ? EMOJI_SIZE * start - 4 : x,
          width: popupOpen ? EMOJI_SIZE * childNumber + 8 : EMOJI_SIZE,
          padding: popupOpen ? 4 : 0,
          boxShadow: popupOpen ? "0 0 30px var(--grey400)" : undefined,
          ...(popupOpen ? { zIndex: 10 } : { transitionEnd: { zIndex: 0 } }),
        }}
        css={[
          flex({ direction: "x" }),
          {
            backgroundColor: "var(--white)",
            position: "absolute",
            borderRadius: 12,
            overflow: "hidden",
          },
        ]}
      >
        <AnimatePresence>
          <motion.button
            key={emoji.id}
            css={[
              pressable,
              size(EMOJI_SIZE),
              { padding: 4, borderRadius: 8, zIndex: 10, flexShrink: 0 },
            ]}
            onClick={() => {
              if (emoji.skins != null && !popupOpen) return setPopupOpen(true);

              insertEmoji(emoji);
              setPopupOpen(false);
            }}
          >
            <EmojiIcon emojiId={emoji.id} />
          </motion.button>
          {popupOpen &&
            emoji.skins?.map(skinEmoji => (
              <motion.button
                key={skinEmoji.id}
                initial={{ opacity: 0.7, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.7, scale: 0.3 }}
                css={[
                  pressable,
                  size(EMOJI_SIZE),
                  { padding: 4, borderRadius: 8, flexShrink: 0 },
                ]}
                onClick={() => {
                  insertEmoji(skinEmoji);
                  setPopupOpen(false);
                }}
              >
                <EmojiIcon emojiId={skinEmoji.id} />
              </motion.button>
            ))}
        </AnimatePresence>
      </motion.div>
    );
  },
);

const pressable = css({
  ":hover": {
    backgroundColor: "var(--grey100)",
  },
  ":active": {
    scale: 0.9,
    backgroundColor: "var(--grey200)",
  },
  "transition": "scale .1s ease, background .2s ease",
});
