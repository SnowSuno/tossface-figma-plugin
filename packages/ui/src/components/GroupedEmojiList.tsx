import { tossEmojis } from "@/emojis";
import { GroupMeta, groupsMeta } from "@/common/group";
import { dismissPopup, EMOJI_SIZE, EmojiButton, EmojiIcon } from "./EmojiIcon";
import { flex } from "@/styles/flex";
import React, { useRef } from "react";
import {
  elementScroll,
  useVirtualizer,
  VirtualizerOptions,
} from "@tanstack/react-virtual";
import { chunk, memoize, throttle } from "es-toolkit";
import { Group, TossEmoji } from "@/types";

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

const getCurrentGroup = memoize((rowIndex: number) => {
  const row = rows[rowIndex + 1];

  if (row.type === "header") return row.data.key;
  return getCurrentGroup(rowIndex - 1);
});

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t : 1 + 16 * --t * t * t * t;
}

export const GroupedEmojiList = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToFn: VirtualizerOptions<any, any>["scrollToFn"] =
    React.useCallback((offset, canSmooth, instance) => {
      containerRef.current?.scrollTo({ top: offset, behavior: "smooth" });
    }, []);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: i => (rows[i].type === "header" ? 20 : EMOJI_SIZE),
    overscan: 10,
    scrollToFn,
    isScrollingResetDelay: 50,
  });

  // const currentGroup = getCurrentGroup(virtualizer.range?.startIndex ?? 0);

  return (
    <>
      <div css={[flex({ direction: "x", gap: 4 }), { paddingInline: 16 }]}>
        {groupsMeta.map(group => (
          <button
            key={group.key}
            // onClick={() =>
            //   virtualizer.scrollToIndex(groupIndex[group.key], {
            //     align: "start",
            //   })
            // }
            css={{}}
          >
            {group.name["ko"]}
          </button>
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
            marginBottom: 40,
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
                  paddingTop: 4,
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
