import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Svg } from "./Svg";
import { emojiQuery } from "@/api/emoji";
import { EmojiId, TossEmoji } from "@/types";
import React, { useEffect, useRef, useState } from "react";

import { bg, flex, padding, pressable, round, spacing, wh } from "@/styles";
import { throttle } from "es-toolkit";
import { AnimatePresence, motion } from "framer-motion";
import { useInsertEmoji } from "@/hooks/useInsertEmoji";
import useClickOutside from "@/hooks/useClickOutside";
import clsx from "clsx";
import { fade } from "@/styles/test.css";

interface Props {
  className?: string;
  emojiId: EmojiId;
  size?: number;
}

export const EmojiIcon = React.memo(
  ({ emojiId, size: sizeValue, ...props }: Props) => {
    const { data } = useQuery(emojiQuery(emojiId));

    return (
      <div
        // css={sizeValue && { width: sizeValue, height: sizeValue }}
        {...props}
      >
        {data && <Svg data={data} className={fade} />}
      </div>
    );
  },
);

interface EmojiButtonProps {
  lane: number;
  top: number;
  emoji: TossEmoji;
}

export const EMOJI_SIZE = spacing.icon;
const LANES = 8;
const POPUP_PADDING = 6;

export const dismissPopup = throttle(
  () => dispatchEvent(new CustomEvent("dismissPopup")),
  500,
);

export const EmojiButton = React.memo(
  ({ lane, top, emoji }: EmojiButtonProps) => {
    const { insertEmoji } = useInsertEmoji();
    const [popupOpen, setPopupOpen] = useState(false);

    const childNumber = Math.min((emoji.skins?.length ?? 0) + 1, LANES);

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
          top: popupOpen ? top - POPUP_PADDING : top,
          left: popupOpen ? EMOJI_SIZE * start - POPUP_PADDING : x,
          width: popupOpen
            ? EMOJI_SIZE * childNumber + POPUP_PADDING * 2
            : EMOJI_SIZE,
          padding: popupOpen ? POPUP_PADDING : 0,
          boxShadow: popupOpen ? "0 0 36px var(--grey400)" : undefined,
          ...(popupOpen
            ? { zIndex: 10 }
            : { zIndex: 5, transitionEnd: { zIndex: 0 } }),
        }}
        className={clsx(flex.x, bg.white, round[12])}
        style={{
          position: "absolute",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <AnimatePresence>
          <motion.button
            key={emoji.id}
            className={clsx(wh.icon, padding[4], round[8], pressable)}
            style={{ zIndex: 10, flexShrink: 0 }}
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
                className={clsx(wh.icon, padding[4], round[8], pressable)}
                style={{ flexShrink: 0 }}
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
