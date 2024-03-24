export type InfoContextType = {
  submitSelectedTokens: (tokens: string[]) => Promise<void>;
  advise: Advise | null;
}


export type Advise = {
  advise: string;
  tip: string;
  json: {
    actions: Array<{
      "action": "buy" | "sell",
      "amount": number,
      "currency": string,
      "target": string
    }>
  }
}
