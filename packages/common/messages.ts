export interface Emoji {
  name: string;
  source: string;
}

export type Message =
  | { type: "ready" }
  | { type: "create"; emojis: Emoji[] }
  | { type: "exit" };
