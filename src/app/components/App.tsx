import React from "react";
import { useEmojiInput, useToast } from "@/app/hooks";
import { logo } from "@/app/assets";

function App() {
  const { openToast } = useToast();
  const { input, emojis } = useEmojiInput(message =>
    openToast("warning", message),
  );

  const createEmojis = () => {
    parent.postMessage({ pluginMessage: { type: "create", emojis } }, "*");
    openToast("success", "이모지를 삽입했어요.");
  };

  return (
    <main>
      <img src={logo} style={{ width: 108 }} />
      <textarea
        placeholder="😍😎🥲😤👻"
        style={{ fontFamily: "Tossface" }}
        {...input}
      />
      <p>
        <span>Control(⌃)+Command(⌘)+Space bar</span>를 눌러 이모지를
        입력해보세요
      </p>
      <button id="create" onClick={createEmojis} disabled={!emojis.length}>
        삽입하기
      </button>
    </main>
  );
}

export default App;
