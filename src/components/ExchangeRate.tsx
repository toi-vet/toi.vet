import * as React from "react";
import { formatPrice } from "../util";

export interface IExchangeRateProps {
  cadRate: number | null;
}

export function ExchangeRate({ cadRate }: IExchangeRateProps) {
  return (
    <div id="exchange">
      {cadRate ? <span>1 CAD ~= €{formatPrice(cadRate)}</span> : <></>}
    </div>
  );
}
