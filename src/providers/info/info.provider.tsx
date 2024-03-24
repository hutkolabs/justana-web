import { FC, PropsWithChildren, useCallback, useState } from "react";
import { InfoContext } from "./info.context";
import { useCircle } from "..";
import { Advise } from "./info.type";

const url = 'https://api.justana.today/advise'

export const InfoProvider: FC<PropsWithChildren> = ({ children }) => {
  const { circle } = useCircle();
  const [advise, setAdvise] = useState<Advise | null>(null);

  const submitSelectedTokens = useCallback(async (tokens: Array<string>) => {
    const balances = await circle.getBalances();
    const backendBalances = balances.map((balance) => {

      return {
        asset: balance.token.symbol,
        balance: balance.amount,
      }
    })
    const _tokens = tokens.filter((token) => {
      return !balances.find((balance) => balance.token.symbol === token)
    })
    const finalBalances = [...backendBalances, ..._tokens.map((token) => {
      return {
        asset: token,
        balance: 0,
      }
    })]

    const body = {
      balances: finalBalances,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Error submitting tokens')
    }

    const data = await response.json();
    console.log(data);
    setAdvise(data);

    return data;
  }, [circle]);

  return <InfoContext.Provider value={{ advise, submitSelectedTokens }}>{children}</InfoContext.Provider>;
}