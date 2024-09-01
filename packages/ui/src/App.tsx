import React, { useDeferredValue, useMemo, useState } from "react";
import { useEmojiInput, useToast } from "@/hooks";
import { logo } from "@/assets";

import { groupBy } from "es-toolkit";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { postMessage } from "./messages";
import { emojiMeta } from "./emojis";
import { serializeSearchKeyword } from "./utils/search";
import { EmojiId, Group, TossEmoji } from "./types";
import { groupsMeta } from "./common/group";
import { flex } from "./styles/flex";
import { emojiQuery } from "./api/emoji";

const groupedEmojis = groupBy(emojiMeta.emojis, emoji => emoji.group);

const groups = groupsMeta.map(meta => ({
  ...meta,
  emojis: groupedEmojis[meta.key] ?? [],
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

  const deferrerdSearch = useDeferredValue(search);

  const filteredEmojis = useMemo(
    () =>
      emojiMeta.emojis.filter(emoji =>
        emoji.searchMeta.some(keyword =>
          keyword.includes(serializeSearchKeyword(deferrerdSearch)),
        ),
      ),
    [deferrerdSearch],
  );

  return (
    <main>
      <img src={logo} style={{ width: 108 }} />
      <input value={search} onChange={e => setSearch(e.target.value)} />

      {search.length === 0 && (
        <div
          css={[
            flex({ direction: "x" }),
            { overflowY: "scroll", scrollbarWidth: "none" },
          ]}
        >
          {groupsMeta.map(group => (
            <button
              key={group.key}
              style={{
                paddingInline: 8,
                paddingBlock: 6,
                display: "flex",
                gap: 4,
                flexDirection: "row",
                alignItems: "center",
                whiteSpace: "nowrap",
                fontSize: 13,
                borderRadius: 10,
                color: "var(--grey600)",
              }}
            >
              <Emoji id={group.emoji} size={18} />
              <span style={{ fontWeight: 500 }}>{group.name.ko}</span>
            </button>
          ))}
        </div>
      )}
      <EmojiList
        search={deferrerdSearch}
        outdated={search !== deferrerdSearch}
      />
    </main>
  );
}

const EmojiList = React.memo(
  ({ search, outdated }: { search: string; outdated: boolean }) => {
    const filteredEmojis = emojiMeta.emojis.filter(emoji =>
      emoji.searchMeta.some(keyword =>
        keyword.includes(serializeSearchKeyword(search)),
      ),
    );

    return (
      <div
        style={{
          overflow: "scroll",
          height: 350,
        }}
      >
        {search.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              // opacity: outdated ? 0.4 : 1,
            }}
          >
            {filteredEmojis.map(emoji => (
              <EmojiIcon key={emoji.id} emoji={emoji} />
            ))}
          </div>
        ) : (
          groups.map(group => (
            <div key={group.key}>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  color: "var(--grey500)",
                  paddingTop: 10,
                  paddingBottom: 4,
                  paddingLeft: 4,
                }}
              >
                {group.name.ko}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {group.emojis.map(emoji => (
                  <EmojiIcon key={emoji.id} emoji={emoji} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  },
);

async function fetchEmoji(id: EmojiId) {
  const data = await fetch(
    `https://raw.githubusercontent.com/toss/tossface/main/dist/svg/${id}.svg`,
  );

  return await data.text();
}

const size = 40;

const EmojiIcon: React.FC<{ emoji: TossEmoji }> = React.memo(({ emoji }) => {
  const { ref, inView } = useInView();

  const { data } = useQuery({
    ...emojiQuery(emoji.id),
    enabled: inView,
  });

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
      {/* <img */}
      {/*   src={`https://raw.githubusercontent.com/toss/tossface/main/dist/svg/${emoji.id}.svg`} */}
      {/* /> */}
      {data && <span dangerouslySetInnerHTML={{ __html: data }} />}
    </span>
  );
});

function Emoji({ id, size }: { id: EmojiId; size: number }) {
  const { data } = useQuery(emojiQuery(id));

  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: data ?? "" }}
    />
  );
}

export default App;
