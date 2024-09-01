import { merge } from "./utils";
import { transformEmojis } from "./transform";

import emojiDataKo from "emojibase-data/ko/data.json" with { type: "json" };
import emojiDataEn from "emojibase-data/en/data.json" with { type: "json" };
import { appendCustomSkinTone, customEmoji } from "./custom";

const baseEmojis = merge(
  transformEmojis("ko", emojiDataKo),
  transformEmojis("en", emojiDataEn),
);

appendCustomSkinTone(baseEmojis.find(emoji => emoji.id === "u26F7")!);

const customEmojis = [
  customEmoji({
    id: "one",
    label: { ko: "숫자 1", en: "number 1" },
    extraTags: ["일", "하나"],
    group: "symbol",
  }),
  customEmoji({
    id: "two",
    label: { ko: "숫자 2", en: "number 2" },
    extraTags: ["이", "둘"],
    group: "symbol",
  }),
  customEmoji({
    id: "three",
    label: { ko: "숫자 3", en: "number 3" },
    extraTags: ["삼", "셋"],
    group: "symbol",
  }),
  customEmoji({
    id: "four",
    label: { ko: "숫자 4", en: "number 4" },
    extraTags: ["사", "넷"],
    group: "symbol",
  }),
  customEmoji({
    id: "five",
    label: { ko: "숫자 5", en: "number 5" },
    extraTags: ["오", "다섯"],
    group: "symbol",
  }),
  customEmoji({
    id: "six",
    label: { ko: "숫자 6", en: "number 6" },
    extraTags: ["육", "여섯"],
    group: "symbol",
  }),
  customEmoji({
    id: "seven",
    label: { ko: "숫자 7", en: "number 7" },
    extraTags: ["칠", "일곱"],
    group: "symbol",
  }),
  customEmoji({
    id: "eight",
    label: { ko: "숫자 8", en: "number 8" },
    extraTags: ["팔", "여덟"],
    group: "symbol",
  }),
  customEmoji({
    id: "nine",
    label: { ko: "숫자 9", en: "number 9" },
    extraTags: ["구", "아홉", "비둘기"],
    group: "symbol",
  }),
  customEmoji({
    id: "zero",
    label: { ko: "숫자 0", en: "number 0" },
    extraTags: ["영", "공", "제로"],
    group: "symbol",
  }),
  customEmoji({
    id: "asterisk",
    label: { ko: "별표", en: "asterisk" },
    extraTags: ["*", "star", "times", "곱하기"],
    group: "symbol",
  }),
  customEmoji({
    id: "numbersign",
    label: { ko: "숫자 기호", en: "number sign" },
    extraTags: [
      "#",
      "sharp",
      "hashtag",
      "pound",
      "octothrope",
      "샵",
      "우물정",
      "해시태그",
    ],
    group: "symbol",
  }),
  customEmoji({
    id: "u20E3",
    label: { ko: "", en: "combining enclosing keycap" },
    extraTags: ["키캡"],
    group: "symbol",
  }),
  customEmoji({
    id: "uE100",
    label: { ko: "소주", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE101",
    label: { ko: "막걸리", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE102",
    label: { ko: "비빔밥", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE103",
    label: { ko: "김밥", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE104",
    label: { ko: "떡꼬치", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE105",
    label: { ko: "윳", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE106",
    label: { ko: "붕어빵", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE107",
    label: { ko: "하회탈", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE108",
    label: { ko: "도깨비", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE109",
    label: { ko: "숭례문", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE10A",
    label: { ko: "한복", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE10B",
    label: { ko: "복주머니", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE10C",
    label: { ko: "방패연", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE10D",
    label: { ko: "세배", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE10E",
    label: { ko: "포스기", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE10F",
    label: { ko: "화상 회의", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE110",
    label: { ko: "계산기", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE111",
    label: { ko: "동영상", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE112",
    label: { ko: "드론", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE113",
    label: { ko: "클라우드 백업", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE114",
    label: { ko: "음악 재생", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE115",
    label: { ko: "앱 알림", en: "app notification" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE116",
    label: { ko: "푸른 마커가 표시된 지도", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE117",
    label: { ko: "통장", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE118",
    label: { ko: "우체국", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE119",
    label: { ko: "경복궁", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE11A",
    label: { ko: "푸른색 방패", en: "blue shield" },
    extraTags: [
      "shield",
      "protect",
      "prvent",
      "security",
      "safe",
      "방패",
      "보호",
      "방어",
      "보안",
      "안전",
      "지키다",
      "보험",
    ],
  }),
  customEmoji({
    id: "uE11B",
    label: { ko: "교차한 흰 깃발", en: "crossed white flags" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE11C",
    label: { ko: "붉은 마커가 표시된 지도", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE11D",
    label: { ko: "마스크를 쓴 옆얼굴", en: "" },
    extraTags: [],
  }),
  customEmoji({
    id: "uE11E",
    label: { ko: "토스 아이콘", en: "" },
    extraTags: [],
  }),

  // customEmoji({
  //   id: "uE10B",
  //   label: { ko: "", en: "" },
  //   extraTags: [],
  // }),
];

export const emojiSource = [...baseEmojis, ...customEmojis];
