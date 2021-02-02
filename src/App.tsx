import React, { useEffect, useState } from "react";
import "./App.css";
import { useQuery, gql } from "@apollo/client";

interface ToiVars {
  symbol: string;
  locale: string;
}

interface ToiData {
  getQuoteBySymbol: {
    symbol: string;
    name: string;
    price: number;
    priceChange: number;
    percentChange: number;
  };
}

type Rate = { [key: string]: number };
interface ExchangeRates {
  rates: Rate;
  base: string;
  date: string;
}

const GET_TOI = gql`
  query getQuoteBySymbol($symbol: String, $locale: String) {
    getQuoteBySymbol(symbol: $symbol, locale: $locale) {
      symbol
      price
      priceChange
      percentChange
    }
  }
`;

function App() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [cadRate, setCadRate] = useState<number | null>(null);
  const { loading, data } = useQuery<ToiData, ToiVars>(GET_TOI, {
    variables: {
      symbol: "TOI",
      locale: "en",
    },
    pollInterval: 60000,
  });

  useEffect(() => {
    if (!loading && data?.getQuoteBySymbol) {
      document.title = `TOI | ${data?.getQuoteBySymbol.price} CAD`;
    }
  }, [data, loading]);

  useEffect(() => {
    async function fetchRates() {
      setRates(
        await (await fetch("https://api.exchangeratesapi.io/latest")).json()
      );
    }
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates?.rates["CAD"] != null) {
      setCadRate(1 / rates?.rates["CAD"]);
    }
  }, [rates]);
  return (
    <div className="App">
      {loading ? (
        <h1>TOI</h1>
      ) : (
        <section id="topistonk">
          <main>
            <h1>{data?.getQuoteBySymbol.symbol}</h1>
            <table>
              <thead>
                <tr>
                  <th>price</th>
                  <th>change</th>
                  <th>change %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data?.getQuoteBySymbol.price} CAD</td>
                  <td>{data?.getQuoteBySymbol.priceChange} CAD</td>
                  <td>{data?.getQuoteBySymbol.percentChange}%</td>
                </tr>
                <tr>
                  <td>
                    €
                    {(data?.getQuoteBySymbol.price! * (cadRate ?? NaN)).toFixed(
                      2
                    )}
                  </td>
                  <td>
                    €
                    {(
                      data?.getQuoteBySymbol.priceChange! * (cadRate ?? NaN)
                    ).toFixed(2)}
                  </td>
                  <td>{data?.getQuoteBySymbol.percentChange}%</td>
                </tr>
              </tbody>
            </table>
            {cadRate ? <span>1 CAD ~= €{cadRate!.toFixed(2)}</span> : <></>}
          </main>
        </section>
      )}
    </div>
  );
}

export default App;
