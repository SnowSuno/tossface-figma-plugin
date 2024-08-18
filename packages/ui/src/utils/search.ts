import { disassemble } from "es-hangul";

export const serializeSearchKeyword = (keyword: string) =>
  disassemble(keyword).replaceAll(" ", "");
