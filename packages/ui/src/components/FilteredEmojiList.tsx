import { tossEmojis } from "@/emojis";
import { serializeSearchKeyword } from "@/utils/search";
import React, { useDeferredValue, useMemo, useRef } from "react";
import { dismissPopup, EMOJI_SIZE, EmojiButton, EmojiIcon } from "./EmojiIcon";
import { flex } from "@/styles/flex";
import { useVirtualizer } from "@tanstack/react-virtual";
import { size } from "@/styles";

interface Props {
  search: string;
}

export const FilteredEmojiList = React.memo(({ search }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const deferredSearch = useDeferredValue(search);

  const filteredEmojis = useMemo(
    () =>
      deferredSearch.length > 0
        ? tossEmojis.list.filter(emoji =>
            emoji.searchMeta.some(keyword =>
              keyword.includes(serializeSearchKeyword(search)),
            ),
          )
        : [],
    [deferredSearch],
  );

  const virtualizer = useVirtualizer({
    count: filteredEmojis.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => EMOJI_SIZE,
    overscan: 20,
    lanes: 8,
  });

  return filteredEmojis.length > 0 ? (
    <div
      ref={containerRef}
      css={{
        zIndex: 10,
        overflowY: "scroll",
        overflowX: "visible",
        paddingInline: 16,
      }}
      onScroll={dismissPopup}
    >
      <div
        css={{
          height: virtualizer.getTotalSize(),
          position: "relative",
          width: "100%",
          marginTop: 12,
          marginBottom: 40,
        }}
      >
        {virtualizer
          .getVirtualItems()
          .map(({ index, key, size, start, lane }) => {
            return (
              <EmojiButton
                key={key}
                top={start}
                lane={lane}
                emoji={filteredEmojis[index]}
              />
            );
          })}
      </div>
    </div>
  ) : (
    <div
      css={[
        flex({ direction: "y", align: "center", justify: "center", gap: 8 }),
        { flex: 1 },
      ]}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.00003 5.00003L6.00003 34.332C6.00003 35.437 6.89503 36.332 8.00003 36.332H24.333L34.332 26.332L34.332 5.00003C34.332 3.89503 33.437 3.00003 32.332 3.00003H8.00003C6.89503 3.00003 6.00003 3.89503 6.00003 5.00003Z"
          fill="#E5E9EE"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M26.332 26.332H34.332L24.333 36.332V28.332C24.333 27.227 25.228 26.332 26.333 26.332H26.332Z"
          fill="#C0C7D1"
        />
      </svg>
      <p
        css={{
          fontWeight: 500,
          color: "var(--grey700)",
          fontSize: 16,
          paddingTop: 8,
        }}
      >
        이모지를 찾을 수 없어요
      </p>
      <p
        css={{
          fontWeight: 400,
          color: "var(--grey500)",
          fontSize: 13,
          paddingBottom: 20,
        }}
      >
        다른 검색어로 검색해보세요.
      </p>
    </div>
  );
});
