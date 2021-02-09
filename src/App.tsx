import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import history from "history/browser";
import html2canvas from "html2canvas";
import { Sparklines, SparklinesLine } from "react-sparklines-typescript";
interface ToiVars {
  symbol: string;
  locale: string;
}

interface ToiData {
  getQuoteBySymbol: {
    symbol: string;
    name: string;
    openPrice: number;
    price: number;
    priceChange: number;
    percentChange: number;
  };
}

interface GraphData {
  getTimeSeriesData: [
    {
      dateTime: string;
      open: number;
    }
  ];
}
interface GraphVars {
  symbol: string;
  freq?: string;
  interval?: number;
  start?: string;
  end?: string;
  startDateTime?: number | null;
  endDateTime?: number | null;
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
      openPrice
      price
      priceChange
      percentChange
    }
  }
`;

const GET_TIMESERIES = gql`
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
  const stonks = !isNaN(stonksNr) ? stonksNr : "";
  const themeParam = urlParams.get("theme");
  const themeNr = Number(themeParam);
  const theme = !isNaN(themeNr) && themeNr < themes.length ? themeNr : 0;

  const [currentTheme, setTheme] = useState<number>(theme);
  const [nextTheme, setNextTheme] = useState<number>(
    (theme + 1) % themes.length
  );

  const [nextThemeBackground, setNextThemeBackground] = useState<string>("");
  const [stocks, setStocks] = useState<number | string>(stonks);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [cadRate, setCadRate] = useState<number | null>(null);
  const [sparkData, setSparkData] = useState<number[] | null>(null);
  const [discoMode, setDiscoMode] = useState<boolean>(false);

  const date = new Date().getDate();
  const startDate = useMemo(() => {
    const today = new Date();
    today.setDate(date - 5);
    return Math.floor(today.getTime() / 1000);
  }, [date]);

  function getSearch(stocks: number | string, theme: number) {
    if (typeof stocks == "number") {
      return `?stocks=${stocks}&theme=${theme}`;
    } else {
      return `?theme=${theme}`;
    }
  }

  function cycleTheme() {
    const themeNr = (currentTheme + 1) % themes.length;
    setTheme(themeNr);
    history.push({
      pathname: "/",
      search: getSearch(stocks, themeNr),
    });
  }

  function formatPrice(value?: number): string {
    if (!value) return "";
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const { data: graphData } = useQuery<GraphData, GraphVars>(GET_TIMESERIES, {
    variables: {
      symbol: "TOI",
      interval: 5,
      startDateTime: startDate,
      endDateTime: null,
    },
    pollInterval: 300000,
  });

  const { loading, data } = useQuery<ToiData, ToiVars>(GET_TOI, {
    variables: {
      symbol: "TOI",
      locale: "en",
    },
    pollInterval: 60000,
  });

  useEffect(() => {
    if (graphData) {
      const min = new Date();
      min.setDate(min.getDate() - 1);
      let data = graphData.getTimeSeriesData
        .filter((d) => new Date(d.dateTime) >= min)
        .filter((d) => new Date(d.dateTime) >= min)
        .reverse()
        .map((d) => d.open);
      setSparkData(data);
    }
  }, [graphData]);

  useEffect(() => {
    if (!loading && data?.getQuoteBySymbol && cadRate) {
      document.title = `TOI | ${formatPrice(
        data?.getQuoteBySymbol.price
      )} CAD | € ${formatPrice(data?.getQuoteBySymbol.price * cadRate)}`;
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
  }, [currentTheme, themes]);

  useEffect(() => {
    setNextThemeBackground(`var(--${themes[nextTheme].background})`);
  }, [nextTheme, setNextThemeBackground, themes]);

  useEffect(() => {
    if (rates?.rates["CAD"] != null) {
      setCadRate(1 / rates?.rates["CAD"]);
    }
  }, [rates]);

  useEffect(() => {
    let intervalId: number;
    if (discoMode) {
      intervalId = window.setInterval(() => {
        setTheme((currentTheme + 1) % themes.length);
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [discoMode, currentTheme, themes.length]);

  function stockChanged(ev: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(ev.target.value);
    setStocks(!isNaN(amount) ? amount : "");
    history.push({
      pathname: "/",
      search: getSearch(amount, themeNr),
    });
  }

  function secretHandler(event: React.MouseEvent) {
    if (event.button === 1) {
      setDiscoMode(!discoMode);
    }
  }

  function isNumeric(str: string): boolean {
    return !isNaN(Number(str));
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
    ele.setAttribute("style", "transition: none;");
    const canvas = await html2canvas(ele);
    ele.removeAttribute("style");
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
                    <td>{formatPrice(data?.getQuoteBySymbol.price)} CAD</td>
                    <td>
                      {formatPrice(data?.getQuoteBySymbol.priceChange)} CAD
                    </td>
                    <td>
                      {data?.getQuoteBySymbol.percentChange.toLocaleString()}%
                    </td>
                  </tr>
                  <tr>
                    <td>
                      €&nbsp;
                      {formatPrice(
                        data?.getQuoteBySymbol.price! * (cadRate ?? NaN)
                      )}
                    </td>
                    <td>
                      €&nbsp;
                      {formatPrice(
                        data?.getQuoteBySymbol.priceChange! * (cadRate ?? NaN)
                      )}
                    </td>
                    <td>
                      {data?.getQuoteBySymbol.percentChange.toLocaleString()}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {sparkData && data && sparkData.length > 0 ? (
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
                  )} CAD max: ${formatPrice(
                    Math.max.apply(Math, sparkData)
                  )} CAD`}
                </figcaption>
              </figure>
            ) : (
              <></>
            )}
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
              {data?.getQuoteBySymbol.price &&
              stocks &&
              isNumeric(stocks as string) ? (
                <div>
                  {formatPrice(
                    (stocks as number) * data?.getQuoteBySymbol.price
                  )}{" "}
                  CAD / €&nbsp;
                  {formatPrice(
                    (stocks as number) * data?.getQuoteBySymbol.price * cadRate!
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>

            <div id="exchange">
              {cadRate ? <span>1 CAD ~= €{formatPrice(cadRate)}</span> : <></>}
            </div>
          </main>
          <footer>
            <button id="share" onClick={share}>
              share
            </button>
            <button
              id="theme"
              onMouseUp={secretHandler}
              onClick={cycleTheme}
              style={{
                background: nextThemeBackground,
              }}
            ></button>
          </footer>
        </section>
      )}
    </div>
  );
}

export default App;
