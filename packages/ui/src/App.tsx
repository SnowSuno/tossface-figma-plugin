import React, { useState } from "react";
import { logo } from "@/assets";

import { GroupedEmojiList } from "./components/GroupedEmojiList";
import { FilteredEmojiList } from "./components/FilteredEmojiList";
import { MotionConfig } from "framer-motion";
import clsx from "clsx";

import { align, bg, flex, h, margin, padding, round } from "@/styles";

const SearchIcon = () => (
  <svg
    width={20}
    height={20}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g fill="none" stroke="var(--grey600)" strokeMiterlimit="10">
      <circle cx="10.389" cy="10.388" r="7.395" strokeWidth="2.032" />
      <path
        d="m15.64 15.638 5.517 5.517"
        strokeLinecap="round"
        strokeWidth="2.001"
      />
    </g>
  </svg>
);

function App() {
  const [search, setSearch] = useState("");

  return (
    <main className={clsx(flex.y, h.full, padding.top[12])}>
      <img src={logo} style={{ width: 108, marginInline: 16 }} />

      <div
        className={clsx(
          flex.x,
          align.center,
          bg.grey100,
          round[12],
          margin.top[12],
          margin.x[12],
          padding.left[8],
        )}
      >
        <SearchIcon />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          ref={node => node?.focus()}
          style={{
            flex: 1,
            paddingBlock: 10,
            paddingLeft: 6,
            paddingRight: 16,
            fontSize: 14,
            color: "var(--grey800)",
            // "::placeholder": {
            //   color: "var(--grey400)",
            // },
            caretColor: "var(--blue500)",
          }}
          placeholder="원하는 이모지를 찾아보세요"
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
