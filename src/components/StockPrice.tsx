import * as React from "react";
import { StockPrice } from "../api";
import { formatNumber } from "../util";

export interface IStockPriceProps {
  symbol: string;
  stockPrice?: StockPrice;
}

export function StockPriceComponent({ symbol, stockPrice }: IStockPriceProps) {
  return stockPrice ? (
    <div id="stock">
      <div className="title-wrapper">
        <h1>{symbol}</h1>
      </div>
      <table id="data">
        <thead>
          <tr>
            <th>price</th>
            <th
              className="tooltip"
              data-text="absolute change since last close"
            >
              change
            </th>
            <th
              className="tooltip"
              data-text="percentage change since last close"
            >
              %
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatNumber(stockPrice.price)} CAD</td>
            <td>{formatNumber(stockPrice.priceChange)} CAD</td>
            <td>{stockPrice.percentageChange?.toLocaleString()}%</td>
          </tr>
          <tr>
            <td>
              €&nbsp;
              {formatNumber(stockPrice.priceConverted)}
            </td>
            <td>
              €&nbsp;
              {formatNumber(stockPrice.priceChangeConverted)}
            </td>
            <td>{stockPrice.percentageChange?.toLocaleString()}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <></>
  );
}
