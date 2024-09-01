import React, { useDeferredValue, useState } from "react";
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

  return (
    <main>
      <img src={logo} style={{ width: 108 }} />
      <input value={search} onChange={e => setSearch(e.target.value)} />

      <EmojiList search={deferrerdSearch} />
    </main>
  );
}

const EmojiList = React.memo(({ search }: { search: string }) => {
  const filteredEmojis = emojiMeta.emojis.filter(emoji =>
    emoji.searchMeta.some(keyword =>
      keyword.includes(serializeSearchKeyword(search)),
    ),
  );

  return (
    <div
      style={{
        overflow: "scroll",
        height: "100%",
      }}
    >
      {search.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {filteredEmojis.map(emoji => (
            <EmojiIcon key={emoji.id} emoji={emoji} />
          ))}
        </div>
      ) : (
        groups.map(group => (
          <div key={group.key}>
            <div>{group.name.ko}</div>
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
});

async function fetchEmoji(id: EmojiId) {
  const data = await fetch(
    `https://raw.githubusercontent.com/toss/tossface/main/dist/svg/${id}.svg`,
  );

  return await data.text();
}

const size = 40;

const EmojiIcon: React.FC<{ emoji: TossEmoji }> = ({ emoji }) => {
  const { ref, inView } = useInView();

  const { data } = useQuery({
    queryKey: ["emoji", emoji.id],
    queryFn: () => fetchEmoji(emoji.id),
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
      title={emoji.label.ko}
    >
      {/* <img */}
      {/*   src={`https://raw.githubusercontent.com/toss/tossface/main/dist/svg/${emoji.id}.svg`} */}
      {/* /> */}
      {data && (
        <span className="fade-in" dangerouslySetInnerHTML={{ __html: data }} />
      )}
    </span>
  );
};

export default App;
