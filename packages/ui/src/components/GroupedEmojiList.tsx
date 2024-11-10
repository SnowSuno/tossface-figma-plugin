import { tossEmojis } from "@/emojis";
import { GroupMeta, groupsMeta } from "@/common/group";
import { dismissPopup, EMOJI_SIZE, EmojiButton, EmojiIcon } from "./EmojiIcon";
import { flex } from "@/styles/flex";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useVirtualizer, VirtualizerOptions } from "@tanstack/react-virtual";
import { chunk, debounce, memoize, throttle } from "es-toolkit";
import { EmojiId, Group, TossEmoji } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import { usePreservedReference } from "@/hooks/usePreservedReference";
import { css } from "@emotion/react";

// const rows = groupsMeta.flatMap(group => [
//   { type: "header", data: group } as const,
//   ...chunk(tossEmojis.grouped[group.key], 8).map(
//     emojis =>
//       ({
//         type: "items",
//         data: emojis,
//       }) as const,
//   ),
// ]);

type Row =
  | { type: "header"; data: GroupMeta }
  | { type: "items"; data: TossEmoji[] };

const rows: Row[] = [];
const groupIndex = {} as Record<Group, number>;

groupsMeta.forEach(group => {
  groupIndex[group.key] = rows.length;
  rows.push({ type: "header", data: group });

  chunk(tossEmojis.grouped[group.key], 8).forEach(emojiRow => {
    rows.push({ type: "items", data: emojiRow });
  });
});

const findClosestHeaderRow = memoize((index: number) => {
  const row = rows[index];
  if (row.type === "header") return row.data.key;
  return findClosestHeaderRow(index - 1);
});

export const GroupedEmojiList = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToFn: VirtualizerOptions<any, any>["scrollToFn"] =
    React.useCallback((offset, canSmooth, instance) => {
      containerRef.current?.scrollTo({ top: offset });
    }, []);

  const [currentGroup, setCurrentGroup] = useState(groupsMeta[0].key);

  // const currentGroup = usePreservedReference(_currentGroup);
  const setCurrentGroupDebounced = useDebounce(setCurrentGroup, 500, {
    edges: ["leading", "trailing"],
  });

  const focusGroup = (group: Group) => {
    // groupScrollerRef.current?.scrollTo({
    //   left: 200,
    //   behavior: "smooth",
    // });
    setCurrentGroup(group);
  };

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: i => (rows[i].type === "header" ? 32 : EMOJI_SIZE),
    overscan: 10,
    scrollToFn,
    isScrollingResetDelay: 1,
    onChange: ({ range }) => {
      if (!range) return;
      const group = findClosestHeaderRow(
        Math.floor((range.startIndex + range.endIndex) / 2),
      );
      if (currentGroup === group) return;
      focusGroup(group);
    },
  });

  // const groupScrollerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        // ref={groupScrollerRef}
        css={[
          flex({ direction: "x" }),
          {
            flexShrink: 0,
            paddingTop: 6,
            paddingInline: 16,
            overflowX: "scroll",
          },
          { scrollbarWidth: "none", scrollBehavior: "smooth" },
        ]}
      >
        {groupsMeta.map(group => (
          <GroupButton
            key={group.key}
            icon={group.emoji}
            focused={currentGroup === group.key}
            onClick={useCallback(() => {
              focusGroup(group.key);

              virtualizer.scrollToIndex(groupIndex[group.key], {
                align: "start",
              });
            }, [])}
          >
            {group.name["ko"]}
          </GroupButton>
        ))}
      </div>
      <div
        ref={containerRef}
        css={{ overflowY: "scroll", paddingInline: 16, zIndex: 10 }}
        onScroll={dismissPopup}
      >
        <div
          css={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
            marginBottom: 154,
          }}
        >
          {virtualizer.getVirtualItems().map(({ index, key, size, start }) =>
            rows[index].type === "header" ? (
              <p
                key={key}
                css={{
                  position: "absolute",
                  top: start,
                  left: 0,
                  height: size,
                  fontSize: 12,
                  color: "var(--grey500)",
                  paddingTop: 14,
                  paddingInline: 2,
                }}
              >
                {rows[index].data.name["ko"]}
              </p>
            ) : (
              rows[index].data.map((emoji, lane) => (
                <EmojiButton
                  key={emoji.id}
                  top={start}
                  lane={lane}
                  emoji={emoji}
                />
              ))
            ),
          )}
        </div>
      </div>
    </>
  );
});

interface GroupButtonProps {
  icon: EmojiId;
  children: string;
  focused: boolean;
  onClick?: () => void;
}

const GroupButton = React.memo(function GroupButton({
  icon,
  children,
  focused,
  onClick,
}: GroupButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) {
      ref.current?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [focused]);

  return (
    <div ref={ref} css={{ position: "relative" }}>
      <button
        css={[
          pressable,
          flex({ direction: "x", align: "center", gap: 2 }),
          {
            paddingBlock: 8,
            paddingInline: 10,
            position: "relative",
            zIndex: 10,
            borderRadius: 10,
          },
        ]}
        onClick={onClick}
      >
        <EmojiIcon emojiId={icon} size={16} />
        <span css={{ whiteSpace: "nowrap" }}>{children}</span>
      </button>
      <AnimatePresence initial={false}>
        {focused && (
          <motion.div
            layoutId="groupBtnBackground"
            css={{
              position: "absolute",
              borderRadius: 10,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              background: "var(--grey100)",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

export const pressable = css({
  ":hover": {
    // opacity: 0.5,
    backgroundColor: "var(--greyOpacity50)",
  },
  ":active": {
    scale: 0.9,
    // backgroundColor: "var(--grey300)",
  },
  "transition": "scale .1s ease, background .2s ease, opacity .2s ease",
});
