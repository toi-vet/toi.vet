import * as React from "react";
import { StockPrice } from "../api";
import { formatNumber } from "../util";

export interface IStockDetailsProps {
  stockPrice?: StockPrice;
}

export function StockDetailsComponent({ stockPrice }: IStockDetailsProps) {
  return stockPrice ? (
    <div id="stock-details">
      {stockPrice.dayLow && stockPrice.dayHigh && stockPrice.volume ? (
        <ul>
          <li>low: {formatNumber(stockPrice.dayLow)} CAD</li>
          <li>high: {formatNumber(stockPrice.dayHigh)} CAD</li>
          <li>volume: {stockPrice.volume}</li>
        </ul>
      ) : (
        <></>
      )}
      <ul>
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
