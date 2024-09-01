import fs from "node:fs";
import { promisify } from "node:util";

import { cloneDeep, isString, mergeWith, uniq } from "es-toolkit";
import { isArray } from "es-toolkit/compat";

export const isStringArray = (v: unknown) => isArray(v) && v.every(isString);

export function merge<T>(...objects: T[]) {
  const [base, ...rest] = cloneDeep(objects);

  rest.forEach(object => {
    mergeWith(base, object, (a, b) =>
      isStringArray(a) && isStringArray(b) ? uniq([...a, ...b]) : undefined,
    );
  });

  return base;
}

export const readDirAsync = promisify(fs.readdir);
