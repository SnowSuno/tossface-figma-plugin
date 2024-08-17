import { CompileTimeFunctionResult } from "vite-plugin-compile-time";
import { getEmojiMeta } from "./getEmojiMeta";

export default async (): Promise<CompileTimeFunctionResult> => ({
  data: await getEmojiMeta(),
});
