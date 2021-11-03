import * as React from "react";
import { ExchangeRate } from "../api";
import { formatNumber } from "../util";

export interface IExchangeRateProps {
  exchangeRate?: ExchangeRate;
}

export function ExchangeRateComponent({ exchangeRate }: IExchangeRateProps) {
  return (
    <div id="exchange">
      {exchangeRate?.value ? (
        <span>1 CAD ~= €{formatNumber(exchangeRate.value)}</span>
      ) : (
        <></>
      )}
    </div>
  );
}
