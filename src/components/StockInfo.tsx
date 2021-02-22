import * as React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines-typescript";
import { formatNumber } from "../util";

export interface IStockInfoProps {
  symbol: string;
  openPrice: number | undefined;
  volume: number | undefined;
  price: number | undefined;
  priceChange: number | undefined;
  percentChange: number | undefined;
  cadRate: number;
  sparkData: number[] | null;
  marketState: string | undefined;
}

export function StockInfo({
  symbol,
  openPrice,
  volume,
  price,
  priceChange,
  percentChange,
  cadRate,
  sparkData,
  marketState,
}: IStockInfoProps) {
  return price !== undefined &&
    priceChange !== undefined &&
    percentChange !== undefined &&
    cadRate !== undefined ? (
    <div id="stock">
      <div className="title-wrapper">
        <h1>{symbol}</h1>
      </div>
      <table id="data">
        <thead>
          <tr>
            <th>price</th>
            <th className="tooltip" data-text="absolute change since last close">
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
            <td>{formatNumber(price)} CAD</td>
            <td>{formatNumber(priceChange)} CAD</td>
            <td>{percentChange.toLocaleString()}%</td>
          </tr>
          <tr>
            <td>
              €&nbsp;
              {formatNumber(price * cadRate)}
            </td>
            <td>
              €&nbsp;
              {formatNumber(priceChange * cadRate)}
            </td>
            <td>{percentChange.toLocaleString()}%</td>
          </tr>
        </tbody>
      </table>
      {sparkData && sparkData.length > 0 ? (
        <figure id="spark">
          <Sparklines data={sparkData} margin={5}>
            <SparklinesLine
              color="var(--foreground)"
              style={{ fill: "none" }}
            />
          </Sparklines>
          <figcaption>
            {`price (last 24h) min: ${formatNumber(
              Math.min.apply(Math, sparkData)
            )} CAD max: ${formatNumber(Math.max.apply(Math, sparkData))} CAD`}
          </figcaption>
        </figure>
      ) : (
        <></>
      )}
      <div className="stock-details">
        <ul>
          <li>
            market: {marketState?.toLowerCase().replace("regular", "open")}
          </li>
          {openPrice && <li>open price: {formatNumber(openPrice)} CAD</li>}
          {volume && <li>volume: {formatNumber(volume, 0, 0)}</li>}
        </ul>
      </div>
    </div>
  ) : (
    <></>
  );
}
