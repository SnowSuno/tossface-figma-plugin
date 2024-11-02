import { Interpolation, Theme } from "@emotion/react";
import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";

type Nullish = null | undefined;

export interface SectionListHandle<TKey extends string | number> {
  scrollToSection: (key: TKey) => void;
}

interface Props<
  TKey extends string | number,
  TSection extends { key: TKey },
  TItem,
> {
  sections: TSection[];
  items: Record<TKey, TItem[]>;
  renderSectionHeader: (section: TSection) => ReactNode;
  renderItem: (item: TItem) => ReactNode;
  onSectionChange?: (section: TSection) => void;
  style?: Interpolation<Theme>;
}

export const SectionList = React.memo(
  forwardRef(function SectionList<
    TKey extends string | number,
    TSection extends { key: TKey },
    TItem,
  >(
    {
      sections,
      items,
      renderSectionHeader,
      renderItem,
      style: css,
    }: Props<TKey, TSection, TItem>,
    ref: ForwardedRef<SectionListHandle<TKey>>,
  ) {
    const sectionRefs = useRef<Record<TKey, HTMLElement | Nullish>>(
      {} as Record<TKey, HTMLElement | Nullish>,
    );

    useImperativeHandle(ref, () => ({
      scrollToSection: (key: TKey) =>
        sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth" }),
    }));

    return (
      <div css={[{ flex: 1, overflow: "auto" }, css]}>
        {sections.map(section => (
          <section
            key={section.key}
            ref={node => {
              sectionRefs.current[section.key] = node;
            }}
          >
            {renderSectionHeader(section)}
            <div css={[{ display: "flex", flexWrap: "wrap" }]}>
              {items[section.key].map(renderItem)}
            </div>
          </section>
        ))}
      </div>
    );
  }),
);
