import { gql } from "@apollo/client";

export const SPARK_QUERY = gql`
  query getTimeSeriesData(
    $symbol: String!
    $freq: String
    $interval: Int
    $start: String
    $end: String
    $startDateTime: Int
    $endDateTime: Int
  ) {
    getTimeSeriesData(
      symbol: $symbol
      freq: $freq
      interval: $interval
      start: $start
      end: $end
      startDateTime: $startDateTime
      endDateTime: $endDateTime
    ) {
      dateTime
      open
    }
  }
`;

export interface SparkVars {
  symbol: string;
  freq?: string;
  interval?: number;
  start?: string;
  end?: string;
  startDateTime?: number | null;
  endDateTime?: number | null;
}

export interface SparkData {
  getTimeSeriesData: [
    {
      dateTime: string;
      open: number;
    }
  ];
}
