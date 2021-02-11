import * as React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines-typescript";
import { formatPrice } from "../util";

export interface IStockInfoProps {
  symbol: string;
  price: number | undefined;
  priceChange: number | undefined;
  percentChange: number | undefined;
  cadRate: number;
  sparkData: number[] | null;
  marketState: string | undefined;
}

export function StockInfo({
  symbol,
  price,
  priceChange,
  percentChange,
  cadRate,
  sparkData,
  marketState,
}: IStockInfoProps) {
  return price && priceChange && percentChange && cadRate ? (
    <div id="stock">
      <div className="title-wrapper">
        <h1>{symbol}</h1>
      </div>
      <table id="data">
        <thead>
          <tr>
            <th>price</th>
            <th className="tooltip" data-text="absolute change since last open">
              change
            </th>
            <th
              className="tooltip"
              data-text="percentage change since last open"
            >
              %
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatPrice(price)} CAD</td>
            <td>{formatPrice(priceChange)} CAD</td>
            <td>{percentChange.toLocaleString()}%</td>
          </tr>
          <tr>
            <td>
              €&nbsp;
              {formatPrice(price * cadRate)}
            </td>
            <td>
              €&nbsp;
              {formatPrice(priceChange * cadRate)}
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
            {`price (last 24h) min: ${formatPrice(
              Math.min.apply(Math, sparkData)
            )} CAD max: ${formatPrice(Math.max.apply(Math, sparkData))} CAD`}
            {marketState && (
              <>
                <br />
                market: {marketState?.toLowerCase().replace("regular", "open")}
              </>
            )}
          </figcaption>
        </figure>
      ) : marketState ? (
        <div>
          market: {marketState?.toLowerCase().replace("regular", "open")}
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
}
