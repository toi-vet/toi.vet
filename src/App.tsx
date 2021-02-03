import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import history from "history/browser";
import html2canvas from "html2canvas";
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
  const themes = useMemo(
    () => [
      { background: "yellow", foreground: "dark" },
      { background: "pink", foreground: "light" },
      { background: "blue", foreground: "light" },
    ],
    []
  );
  const urlParams = new URLSearchParams(window.location.search);
  const stonksParam = urlParams.get("stocks");
  const stonksNr = Number(stonksParam);
  const stonks = !isNaN(stonksNr) ? stonksNr : undefined;
  const themeParam = urlParams.get("theme");
  const themeNr = Number(themeParam);

  const theme = !isNaN(themeNr) && themeNr < themes.length ? themeNr : 0;

  const [currentTheme, setTheme] = useState<number>(theme);
  const [nextTheme, setNextTheme] = useState<number>(
    (theme + 1) % themes.length
  );
  const [nextThemeBackground, setNextThemeBackground] = useState<string>("");
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
    if (!loading && data?.getQuoteBySymbol && cadRate) {
      document.title = `TOI | ${data?.getQuoteBySymbol.price.toLocaleString()} CAD | € ${(
        data?.getQuoteBySymbol.price * cadRate
      ).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }
  }, [data, loading, cadRate]);

  useEffect(() => {
    async function fetchRates() {
      setRates(
        await (await fetch("https://api.exchangeratesapi.io/latest")).json()
      );
    }
    fetchRates();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--foreground",
      `var(--${themes[currentTheme].foreground})`
    );
    document.documentElement.style.setProperty(
      "--background",
      `var(--${themes[currentTheme].background})`
    );
    setNextTheme((currentTheme + 1) % themes.length);
  }, [currentTheme, themes, setNextTheme]);

  useEffect(() => {
    setNextThemeBackground(`var(--${themes[nextTheme].background})`);
  }, [nextTheme, setNextThemeBackground, themes]);

  useEffect(() => {
    if (rates?.rates["CAD"] != null) {
      setCadRate(1 / rates?.rates["CAD"]);
    }
  }, [rates]);

  function stockChanged(ev: React.ChangeEvent<HTMLInputElement>) {
    const amount = parseFloat(ev.target.value);
    if (!isNaN(amount)) {
      setStocks(parseFloat(ev.target.value));
      history.push({
        pathname: "/",
        search: `?stocks=${stocks}&theme=${theme}`,
      });
    } else {
      setStocks(undefined);
    }
  }

  function cycleTheme() {
    const themeNr = (currentTheme + 1) % themes.length;
    setTheme(themeNr);
    history.push({
      pathname: "/",
      search: `?stocks=${stocks}&theme=${themeNr}`,
    });
  }

  async function share() {
    const ele = document.getElementById("stock")!;
    const contrib = document.createElement("div");
    contrib.textContent = "https://toi.vet";
    contrib.setAttribute(
      "style",
      "width: 100%; text-align: center; font-weight: bold"
    );
    ele.appendChild(contrib);
    const canvas = await html2canvas(ele);
    contrib.remove();
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const now = new Date().toISOString();
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = `TOI-${now}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    });
  }

  return (
    <div className="App">
      {loading ? (
        <h1>TOI</h1>
      ) : (
        <section id="topistonk">
          <main>
            <button
              id="theme"
              onClick={cycleTheme}
              style={{
                background: nextThemeBackground,
              }}
            ></button>
            <button id="share" onClick={share}>
              share
            </button>
            <div id="stock">
              <div>
                <h1>{data?.getQuoteBySymbol.symbol}</h1>
              </div>
              <table id="data">
                <thead>
                  <tr>
                    <th>price</th>
                    <th
                      className="tooltip"
                      data-text="absolute change since last open"
                    >
                      change
                    </th>
                    <th
                      className="tooltip"
                      data-text="percentage change since last open"
                    >
                      change %
                    </th>
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
            </div>
            <div id="calculator">
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

            <div id="exchange">
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
