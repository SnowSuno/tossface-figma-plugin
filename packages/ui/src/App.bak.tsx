import React, {
  CSSProperties,
  ElementRef,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEmojiInput, useToast } from "@/hooks";
import { logo } from "@/assets";

import { groupBy } from "es-toolkit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { postMessage } from "./messages";
import { tossEmojis } from "./emojis";
import { serializeSearchKeyword } from "./utils/search";
import { EmojiId, Group, TossEmoji } from "./types";
import { GroupMeta, groupsMeta } from "./common/group";
import { flex } from "./styles/flex";
import { emojiQuery } from "./api/emoji";
import { SectionGrid } from "./components/SectionGrid";
import { SectionList, SectionListHandle } from "./components/SectionList";
import { Interpolation } from "@emotion/react";
import { useQueryManager } from "./hooks/useQueryManager";
import { useDebounce } from "./hooks/useDebounce";

const groups = groupsMeta.map(meta => ({
  ...meta,
  emojis: tossEmojis.grouped[meta.key] ?? [],
}));

function App() {
  const { openToast } = useToast();
  const { input, emojis } = useEmojiInput(message =>
    openToast("warning", message),
  );

  const [search, setSearch] = useState("");

  const createEmojis = () => {
    postMessage({ type: "create", emojis });
    openToast("success", "이모지를 삽입했어요.");
  };

  const [deferrerdSearch] = useDebounce(search, {
    timeout: 300,
    resetOn: value => value.length === 0,
  });

  const sectionListRef = useRef<SectionListHandle<Group>>(null);
  const [focusedSection, setFocusedSection] = useState<Group>(
    groupsMeta[0].key,
  );

  const renderSectionHeader = useCallback(
    (section: GroupMeta) => <p>{section.name.ko}</p>,
    [],
  );

  const renderItem = useCallback(
    (item: TossEmoji) => <EmojiIcon key={item.id} emoji={item} />,
    [],
  );
  const sectionList = useMemo(
    () => (
      <SectionList
        ref={sectionListRef}
        sections={groupsMeta}
        items={tossEmojis.grouped}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
      />
    ),
    [sectionListRef, renderSectionHeader, renderItem],
  );

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <img src={logo} style={{ width: 108 }} />
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        ref={node => node?.focus()}
      />

      {search.length === 0 && (
        <div
          css={[
            { height: 32 },
            flex({ direction: "x", align: "stretch" }),
            { overflowY: "scroll", scrollbarWidth: "none" },
          ]}
        >
          {groupsMeta.map(group => (
            <button
              key={group.key}
              style={{
                paddingInline: 8,
                // paddingBlock: 6,
                display: "flex",
                gap: 4,
                flexDirection: "row",
                alignItems: "center",
                whiteSpace: "nowrap",
                fontSize: 13,
                borderRadius: 10,
                color: "var(--grey600)",
                backgroundColor:
                  group.key === focusedSection ? "var(--grey200)" : "white",
              }}
              onClick={() => {
                sectionListRef.current?.scrollToSection(group.key);
                setFocusedSection(group.key);
              }}
            >
              <Emoji id={group.emoji} size={18} />
              <span style={{ fontWeight: 500 }}>{group.name.ko}</span>
            </button>
          ))}
        </div>
      )}
      {/* <SectionGrid */}
      {/*   cols={8} */}
      {/*   sections={groups.map(group => ({ */}
      {/*     header: group.name, */}
      {/*     items: group.emojis, */}
      {/*   }))} */}
      {/*   headerSize={24} */}
      {/*   renderSectionHeader={name => <p css={{ height: 24 }}>{name.ko}</p>} */}
      {/*   itemSize={40} */}
      {/*   renderItem={emoji => <Emoji id={emoji.id} size={40} />} */}
      {/* /> */}
      {/* <EmojiList */}
      {/*   search={deferrerdSearch} */}
      {/*   outdated={search !== deferrerdSearch} */}
      {/* /> */}
      <List search={deferrerdSearch} />
    </main>
  );
}

const List = React.memo(({ search }: { search: string }) => {
  const emojis = useMemo(
    () =>
      search.length > 0
        ? tossEmojis.list.filter(emoji =>
            emoji.searchMeta.some(keyword =>
              keyword.includes(serializeSearchKeyword(search)),
            ),
          )
        : [],
    [search],
  );

  return (
    <>
      {search.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {emojis.map(item => (
            <EmojiIcon key={item.id} emoji={item} />
          ))}
        </div>
      )}
      <SectionList
        // ref={sectionListRef}
        sections={groupsMeta}
        items={tossEmojis.grouped}
        renderSectionHeader={section => <p>{section.name.ko}</p>}
        renderItem={item => <EmojiIcon key={item.id} emoji={item} />}
        style={search.length > 0 ? { display: "none" } : undefined}
      />
    </>
  );
});

async function fetchEmoji(id: EmojiId) {
  const data = await fetch(
    `https://raw.githubusercontent.com/toss/tossface/main/dist/svg/${id}.svg`,
  );

  return await data.text();
}

const size = 40;

const EmojiIcon: React.FC<{ emoji: TossEmoji }> = React.memo(({ emoji }) => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView({ triggerOnce: true });

  const { data } = useQuery({
    ...emojiQuery(emoji.id),
    // enabled: inView,
  });

  // useEffect(() => {
  //   inView && queryClient.fetchQuery(emojiQuery(emoji.id));
  // }, [inView, queryClient]);

  const insert = () =>
    parent.postMessage(
      {
        pluginMessage: {
          type: "create",
          emojis: [{ name: emoji.label.ko, source: data }],
        },
        pluginId: "*",
      },
      "*",
    );

  return (
    <span
      className="pressable"
      ref={ref}
      style={{
        width: size,
        height: size,
        padding: 4,
        borderRadius: 6,
      }}
      onClick={() => {
        if (emoji.skins) {
          alert("skin");
          return;
        }
        insert();
      }}
      title={emoji.id}
    >
      {data && <EmojiRenderer data={data} />}
    </span>
  );
});

const Emoji = React.memo(({ id, size }: { id: EmojiId; size: number }) => {
  const { data } = useQuery(emojiQuery(id));

  return (
    <EmojiRenderer style={{ width: size, height: size }} data={data ?? ""} />
  );
});

interface Props {
  data: string;
  style?: CSSProperties;
}
const EmojiRenderer = React.memo(({ style, data }: Props) => (
  <img
    style={style}
    src={`data:image/svg+xml;utf8,${encodeURIComponent(data)}`}
  />
  // <div css={css} dangerouslySetInnerHTML={{ __html: data }} />
));

export default App;
