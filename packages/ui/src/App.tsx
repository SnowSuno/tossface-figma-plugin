import React, { useState } from "react";
import { useEmojiInput, useToast } from "@/hooks";
import { logo } from "@/assets";
import unicodeVersions from "emojibase-data/versions/unicode.json";
import groups from "emojibase-data/meta/groups.json";
import data from "emojibase-data/ko/compact.json";
import { groupBy } from "es-toolkit";
import { getSvgFromEmoji, getSvgFromHexcode } from "./utils/emoji";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { postMessage } from "./messages";
import { emojiMeta } from "./emojis";

// declare global {
//   interface PluginWindow extends Window {
//     postMessage(arg: { pluginMessage: string }): void;
//   }
// }
//
const supportedEmojis = new Set(emojiMeta.supportedEmojis);

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

  const grouped = Object.entries(
    groupBy(
      data
        .filter(emoji => supportedEmojis.has(emoji.hexcode))
        .filter(emoji =>
          [emoji.label, ...(emoji.tags ?? [])].some(tag =>
            tag.includes(search),
          ),
        ),
      emoji => emoji.group ?? "undefined",
    ),
  );

  return (
    <main>
      <img src={logo} style={{ width: 108 }} />
      {/* <textarea */}
      {/*   placeholder="😍😎🥲😤👻" */}
      {/*   style={{ fontFamily: "Tossface" }} */}
      {/*   {...input} */}
      {/* /> */}
      {/* <p> */}
      {/*   <span>Control(⌃)+Command(⌘)+Space bar</span>를 눌러 이모지를 */}
      {/*   입력해보세요 */}
      {/* </p> */}
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <div
        style={{
          overflow: "scroll",
          height: 250,
        }}
      >
        {grouped.map(([group, emojis]) => (
          <div key={group}>
            <div>{groups.groups[group]}</div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {emojis.map(emoji => {
                const svg = getSvgFromHexcode(emoji.hexcode);

                // if (!svg) {
                //   console.error(emoji);
                //   return (
                //     <span style={{ backgroundColor: "red" }}>
                //       {emoji.unicode}
                //     </span>
                //   );
                // }
                //
                return (
                  <EmojiIcon key={emoji.hexcode} hexcode={emoji.hexcode} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* <button id="create" onClick={createEmojis} disabled={!emojis.length}> */}
      {/*   삽입하기 */}
      {/* </button> */}
      <button
        id="create"
        onClick={() => {
          fetch(
            "https://raw.githubusercontent.com/toss/tossface/main/dist/svg/asterisk.svg",
          )
            .then(data => data.text())
            .then(emoji => {
              console.log({ data });
              postMessage({
                type: "create",
                emojis: [{ name: "test", source: emoji }],
              });
            });
        }}
      >
        테스트
      </button>
    </main>
  );
}

async function fetchEmoji(hexcode: string) {
  const svgName = hexcode
    .split("-")
    .filter(code => code !== "FE0F")
    .map(code => `u${code}`)
    .join("_");

  const data = await fetch(
    `https://raw.githubusercontent.com/toss/tossface/main/dist/svg/${svgName}.svg`,
  );

  return await data.text();
}

const size = 36;

const EmojiIcon: React.FC<{ hexcode: string }> = ({ hexcode }) => {
  const { ref, inView } = useInView();

  const { data } = useQuery({
    queryKey: ["emoji", hexcode],
    queryFn: () => fetchEmoji(hexcode),
    enabled: inView,
  });

  const onInsert = () =>
    parent.postMessage(
      {
        pluginMessage: {
          type: "create",
          emojis: [{ name: hexcode, source: data }],
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
      onClick={onInsert}
    >
      {data && (
        <span className="fade-in" dangerouslySetInnerHTML={{ __html: data }} />
      )}
    </span>
  );
};

export default App;
