import * as React from "react";
import { formatNumber, isNumeric } from "../util";

export interface ICalculatorProps {
  stocks: number | string;
  stockChanged: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  price: number | undefined;
  cadRate: number | null;
}

export function Calculator({
  stocks,
  stockChanged,
  price,
  cadRate,
}: ICalculatorProps) {
  return (
    <div id="calculator">
      <h2>Can I retire?</h2>
      <div className="input-group">
        <label htmlFor="stocks">number of stocks:</label>
        <input
          id="stocks"
          type="number"
          value={stocks}
          onChange={stockChanged}
        ></input>
      </div>
      {price && cadRate && stocks && isNumeric(stocks as string) ? (
        <div>
          {formatNumber((stocks as number) * price)} CAD / €&nbsp;
          {formatNumber((stocks as number) * price * cadRate)}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
