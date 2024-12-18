import { tossEmojis } from "@/emojis";
import { serializeSearchKeyword } from "@/utils/search";
import React, { useDeferredValue, useMemo, useRef } from "react";
import { dismissPopup, EMOJI_SIZE, EmojiButton } from "./EmojiIcon";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { align, flex, justify, margin, padding, w } from "@/styles";

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
      className={clsx(padding.x[16])}
      style={{
        zIndex: 10,
        overflowY: "scroll",
        overflowX: "visible",
        flex: 1,
      }}
      onScroll={dismissPopup}
    >
      <div
        className={clsx(w.full, margin.top[12], margin.bottom[24])}
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map(({ index, key, start, lane }) => {
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
      className={clsx(flex.y, align.center, justify.center)}
      style={{ gap: 8, flex: 1 }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.00003 5.00003L6.00003 34.332C6.00003 35.437 6.89503 36.332 8.00003 36.332H24.333L34.332 26.332L34.332 5.00003C34.332 3.89503 33.437 3.00003 32.332 3.00003H8.00003C6.89503 3.00003 6.00003 3.89503 6.00003 5.00003Z"
          fill="#E5E9EE"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.332 26.332H34.332L24.333 36.332V28.332C24.333 27.227 25.228 26.332 26.333 26.332H26.332Z"
          fill="#C0C7D1"
        />
      </svg>
      <p
        style={{
          fontWeight: 500,
          color: "var(--grey700)",
          fontSize: 16,
          paddingTop: 8,
        }}
      >
        이모지를 찾을 수 없어요
      </p>
      <p
        style={{
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
