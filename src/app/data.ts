import type {
  CompileTimeFunctionArgs,
  CompileTimeFunctionResult,
} from "vite-plugin-compile-time";
import unicodeVersions from "emojibase-data/versions/unicode.json" with { type: "json" };

export default async (): Promise<CompileTimeFunctionResult> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const json = await res.json();
  console.log(unicodeVersions);
  return { data: { json, unicodeVersions } };
};

declare interface ImportMeta {
  compileTime: <T>(file: string) => T;
}
