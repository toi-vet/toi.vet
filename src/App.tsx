import React, { useEffect, useState } from "react";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import history from 'history/browser';

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
  const urlParams = new URLSearchParams(window.location.search).get("stocks");
  const stonksNr = Number(urlParams);
  const stonks = !isNaN(stonksNr) ? stonksNr : undefined;

  const [stocks, setStocks] = useState<number | undefined>(stonks);
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

  function stockChanged(ev: React.ChangeEvent<HTMLInputElement>) {
    const amount = parseFloat(ev.target.value);
    if (!isNaN(amount)) {
      history.push({
        pathname: "/",
        search: `?stocks=${amount}`,
      });
      setStocks(parseFloat(ev.target.value));
    } else {
      setStocks(undefined);
    }
  }

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
                  <td>{data?.getQuoteBySymbol.price.toLocaleString()} CAD</td>
                  <td>
                    {data?.getQuoteBySymbol.priceChange.toLocaleString()} CAD
                  </td>
                  <td>
                    {data?.getQuoteBySymbol.percentChange.toLocaleString()}%
                  </td>
                </tr>
                <tr>
                  <td>
                    €&nbsp;
                    {(
                      data?.getQuoteBySymbol.price! * (cadRate ?? NaN)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    €&nbsp;
                    {(
                      data?.getQuoteBySymbol.priceChange! * (cadRate ?? NaN)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    {data?.getQuoteBySymbol.percentChange.toLocaleString()}%
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
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
              {data?.getQuoteBySymbol.price && stocks ? (
                <div>
                  {(stocks * data?.getQuoteBySymbol.price).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}{" "}
                  CAD / €&nbsp;
                  {(
                    stocks *
                    data?.getQuoteBySymbol.price *
                    cadRate!
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="exchange">
              {cadRate ? (
                <span>
                  1 CAD ~= €
                  {cadRate!.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              ) : (
                <></>
              )}
            </div>
          </main>
        </section>
      )}
    </div>
  );
}

export default App;
