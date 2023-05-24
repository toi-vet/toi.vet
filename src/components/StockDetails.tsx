import * as React from "react";
import { StockPrice } from "../api";
import { formatNumber } from "../util";

export interface IStockDetailsProps {
  stockPrice?: StockPrice;
}

export function StockDetailsComponent({ stockPrice }: IStockDetailsProps) {
  return stockPrice ? (
    <div id="stock-details">
      {stockPrice.marketState !== "closed" ? (
        <ul>
          <li>low: {formatNumber(stockPrice.dayLow)} CAD</li>
          <li>high: {formatNumber(stockPrice.dayHigh)} CAD</li>
          <li>volume: {stockPrice.volume}</li>
        </ul>
      ) : (
        <></>
      )}
      <ul>
        <li>
          market:{" "}
          {stockPrice.marketState?.toLowerCase().replace("regular", "open")}
        </li>
        {stockPrice.openPrice ? (
          <li>open: {stockPrice.openPrice} CAD</li>
        ) : (
          <></>
        )}
        <li>previous close: {stockPrice.previousClosePrice} CAD</li>
      </ul>
    </div>
  ) : (
    <></>
  );
}
