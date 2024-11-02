import React, { CSSProperties, useMemo, useRef, useState } from "react";
import { logo } from "@/assets";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { tossEmojis } from "./emojis";
import { serializeSearchKeyword } from "./utils/search";
import { EmojiId, Group, TossEmoji } from "./types";
import { groupsMeta } from "./common/group";
import { flex } from "./styles/flex";
import { emojiQuery } from "./api/emoji";
import { SectionList, SectionListHandle } from "./components/SectionList";
import { Interpolation } from "@emotion/react";
import { useDebounce } from "./hooks/useDebounce";
import { GroupedEmojiList } from "./components/GroupedEmojiList";
import { FilteredEmojiList } from "./components/FilteredEmojiList";
import { EmojiButton } from "./components/EmojiIcon";
import { MotionConfig } from "framer-motion";

const SearchIcon = () => (
  <svg
    width={20}
    height={20}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g fill="none" stroke="var(--grey600)" stroke-miterlimit="10">
      <circle cx="10.389" cy="10.388" r="7.395" stroke-width="2.032" />
      <path
        d="m15.64 15.638 5.517 5.517"
        stroke-linecap="round"
        stroke-width="2.001"
      />
    </g>
  </svg>
);

function App() {
  const [search, setSearch] = useState("");

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingTop: 12,
      }}
    >
      <img src={logo} style={{ width: 108, marginInline: 16 }} />

      <div
        css={[
          flex({ direction: "x", align: "center" }),
          {
            backgroundColor: "var(--grey100)",
            borderRadius: 10,
            marginTop: 12,
            marginInline: 16,
            paddingLeft: 10,
          },
        ]}
      >
        <SearchIcon />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          ref={node => node?.focus()}
          css={{
            "flex": 1,
            "paddingBlock": 10,
            "paddingLeft": 6,
            "paddingRight": 16,
            "fontSize": 14,
            "color": "var(--grey800)",
            "::placeholder": {
              color: "var(--grey400)",
            },
            "caretColor": "var(--blue500)",
          }}
          placeholder="이모지를 검색하세요"
        />
      </div>

      <MotionConfig transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}>
        {search.length > 0 ? (
          <FilteredEmojiList search={search} />
        ) : (
          <GroupedEmojiList />
        )}
      </MotionConfig>
    </main>
  );
}

export default App;
