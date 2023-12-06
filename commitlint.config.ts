import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["gitmoji"],
  rules: {
    "type-empty": [2, "always"],
    "scope-empty": [2, "always"],
    "subject-case": [2, "always", "sentence-case"],

    // Temp fix for empty body issue
    // https://github.com/conventional-changelog/commitlint/issues/3036
    "subject-empty": [2, "always"],
  },
};

module.exports = Configuration;
