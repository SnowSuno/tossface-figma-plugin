import { ReactNode, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { chunk } from "es-toolkit";

interface Props<TSection, TItem> {
  cols: number;
  sections: {
    header: TSection;
    items: TItem[];
  }[];
  headerSize: number;
  renderSectionHeader: (header: TSection) => ReactNode;
  itemSize: number;
  renderItem: (item: TItem) => ReactNode;
}

export function SectionGrid<TSection, TItem>({
  cols,
  sections,
  headerSize,
  itemSize,
  renderSectionHeader,
  renderItem,
}: Props<TSection, TItem>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = sections.flatMap(section => [
    { type: "header" as const, value: section.header },
    ...chunk(section.items, cols).map(row => ({
      type: "row" as const,
      value: row,
    })),
  ]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: index =>
      rows[index].type === "header" ? headerSize : itemSize,
    overscan: 10,
  });

  return (
    <div ref={containerRef} css={{ height: 360, overflow: "auto" }}>
      <div css={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map(item => {
          const row = rows[item.index];

          return (
            <div
              css={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                // height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
                display: "flex",
                flexDirection: "row",
              }}
            >
              {row.type === "header"
                ? renderSectionHeader(row.value)
                : row.value.map(renderItem)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
