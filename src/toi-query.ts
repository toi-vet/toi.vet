import { gql } from "@apollo/client";

export const TOI_QUERY = gql`
  query getQuoteBySymbol($symbol: String, $locale: String) {
    getQuoteBySymbol(symbol: $symbol, locale: $locale) {
      symbol
      openPrice
      volume
      price
      priceChange
      percentChange
    }
  }
`;

export interface ToiVars {
  symbol: string;
  locale: string;
}

export interface ToiData {
  getQuoteBySymbol: {
    symbol: string;
    name: string;
    openPrice: number;
    volume: number;
    price: number;
    priceChange: number;
    percentChange: number;
  };
}
