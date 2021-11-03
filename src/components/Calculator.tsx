import * as React from "react";
import { StockPrice } from "../api";
import { formatNumber, isNumeric } from "../util";

export interface ICalculatorProps {
  stocks: number | string;
  stockPrice?: StockPrice
  stockChanged: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CalculatorComponent({
  stocks,
  stockChanged,
 stockPrice,
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
      {stockPrice?.price && stockPrice?.priceConverted && stocks && isNumeric(stocks as string) ? (
        <div>
          {formatNumber((stocks as number) * stockPrice.price)} CAD / €&nbsp;
          {formatNumber((stocks as number) * stockPrice.priceConverted)}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
