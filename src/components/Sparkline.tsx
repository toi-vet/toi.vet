import * as React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines-typescript";
import { IntradayDataPoint } from "../api";

export interface ISparklineProps {
  data: Array<IntradayDataPoint>;
}

export function SparklineComponent({ data }: ISparklineProps) {
  let lastDataPoint: number | undefined = undefined;
  let processedData: Array<number> = [];
  for (let point of data) {
    if (!point.ohlv) {
      if (lastDataPoint) {
        processedData.push(lastDataPoint);
      } else {
        continue;
      }
    } else {
      lastDataPoint = point.ohlv.open!;
      processedData.push(point.ohlv.open!);
    }
  }

  return processedData.length > 0 ?
    <div id="spark">
      <Sparklines data={processedData} margin={5}>
        <SparklinesLine color="var(--foreground)" style={{ fill: "none" }} />
      </Sparklines>
    </div>
   : <></>;
}
