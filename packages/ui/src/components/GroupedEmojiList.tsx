import { tossEmojis } from "@/emojis";
import { GroupMeta, groupsMeta } from "@/common/group";
import { dismissPopup, EMOJI_SIZE, EmojiButton, EmojiIcon } from "./EmojiIcon";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import {
  useVirtualizer,
  VirtualItem,
  VirtualizerOptions,
} from "@tanstack/react-virtual";
import { chunk, memoize } from "es-toolkit";
import { EmojiId, Group, TossEmoji } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { align, flex, pressable, w, wh } from "@/styles";

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
    React.useCallback(offset => {
      containerRef.current?.scrollTo({ top: offset });
    }, []);

  const [currentGroup, setCurrentGroup] = useState(groupsMeta[0].key);

  const groupButtonRefs = useRef<Partial<Record<Group, HTMLDivElement | null>>>(
    {},
  );

  const focusGroup = (group: Group) => {
    setCurrentGroup(group);
    const padding = 24;

    const currentNode = groupButtonRefs.current[group];
    const container = currentNode?.parentElement;
    if (!currentNode || !container) return;

    const nodeLeft = currentNode.offsetLeft - padding;
    const nodeRight =
      currentNode.offsetLeft + currentNode.offsetWidth + padding;
    const containerLeft = container.scrollLeft;
    const containerRight = containerLeft + container.clientWidth;

    if (nodeLeft < containerLeft) {
      container.scrollTo({ left: nodeLeft, behavior: "smooth" });
    } else if (nodeRight > containerRight) {
      container.scrollTo({
        left: nodeRight - container.clientWidth,
        behavior: "smooth",
      });
    }
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

  return (
    <>
      <div
        // ref={groupScrollerRef}
        className={clsx(flex.x)}
        style={{
          flexShrink: 0,
          paddingTop: 6,
          paddingInline: 12,
          overflowX: "scroll",
          scrollbarWidth: "none",
          scrollBehavior: "smooth",
          scrollPaddingInline: 36,
        }}
      >
        {groupsMeta.map(group => (
          <GroupButton
            ref={element => {
              groupButtonRefs.current[group.key] = element;
            }}
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
        style={{ overflowY: "scroll", paddingInline: 16, zIndex: 10 }}
        onScroll={dismissPopup}
      >
        <div
          className={clsx(w.full)}
          style={{
            height: virtualizer.getTotalSize(),
            position: "relative",
            marginBottom: 154,
          }}
        >
          {virtualizer.getVirtualItems().map(({ key, ...props }) => (
            <Row key={key} {...props} />
          ))}
        </div>
      </div>
    </>
  );
});

const Row = React.memo(({ index, size, start }: Omit<VirtualItem, "key">) =>
  rows[index].type === "header" ? (
    <p
      style={{
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
      <EmojiButton key={emoji.id} top={start} lane={lane} emoji={emoji} />
    ))
  ),
);

interface GroupButtonProps {
  icon: EmojiId;
  children: string;
  focused: boolean;
  onClick?: () => void;
}

const GroupButton = React.memo(
  forwardRef<HTMLDivElement, GroupButtonProps>(
    ({ icon, children, focused, onClick }, ref) => (
      <div ref={ref} style={{ position: "relative" }}>
        <button
          className={clsx(flex.x, align.center, pressable)}
          style={{
            gap: 2,
            paddingBlock: 8,
            paddingInline: 10,
            position: "relative",
            zIndex: 10,
            borderRadius: 10,
          }}
          onClick={onClick}
        >
          <EmojiIcon emojiId={icon} className={wh[16]} />
          <span style={{ whiteSpace: "nowrap" }}>{children}</span>
        </button>
        <AnimatePresence initial={false}>
          {focused && (
            <motion.div
              layoutId="groupBtnBackground"
              style={{
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
    ),
  ),
);

// export const pressable = css({
//   ":hover": {
//     // opacity: 0.5,
//     backgroundColor: "var(--greyOpacity50)",
//   },
//   ":active": {
//     scale: 0.9,
//     // backgroundColor: "var(--grey300)",
//   },
//   "transition": "scale .1s ease, background .2s ease, opacity .2s ease",
// });
