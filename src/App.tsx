import "./App.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import history from "history/browser";
import { useQuery } from "@apollo/client";
import { useInterval } from "./UseIntervalHook";
import { formatPrice } from "./util";
import { Calculator } from "./components/Calculator";
import { StockInfo } from "./components/StockInfo";
import { ExchangeRate } from "./components/ExchangeRate";
import { Footer } from "./components/Footer";
import { SparkData, SparkVars, SPARK_QUERY } from "./spark-query";
import { ToiData, ToiVars, TOI_QUERY } from "./toi-query";

function App() {
  const themes = useMemo(
    () => [
      { background: "yellow", foreground: "dark", github: "/github.png" },
      { background: "pink", foreground: "light", github: "/github-light.png" },
      { background: "blue", foreground: "light", github: "/github-light.png" },
    ],
    []
  );

  const urlParams = new URLSearchParams(window.location.search);
  const stonksParam = urlParams.get("stocks");
  const stonksNr = Number(stonksParam);
  const stonks =
    stonksParam != null && !isNaN(stonksNr) && stonksNr !== 0 ? stonksNr : "";
  const [stocks, setStocks] = useState<number | string>(stonks);
  const themeParam = urlParams.get("theme");
  const themeNr = Number(themeParam);
  const theme = !isNaN(themeNr) && themeNr < themes.length ? themeNr : 0;

  const [currentTheme, setTheme] = useState<number>(theme);
  const [nextTheme, setNextTheme] = useState<number>(
    (theme + 1) % themes.length
  );

  const [nextThemeBackground, setNextThemeBackground] = useState<string>("");
  const [cadRate, setCadRate] = useState<number | null>(null);
  const [sparkData, setSparkData] = useState<number[] | null>(null);
  const [discoMode, setDiscoMode] = useState<boolean>(false);

  const date = new Date().getDate();
  const startDate = useMemo(() => {
    const today = new Date();
    today.setDate(date - 1);
    return Math.floor(today.getTime() / 1000);
  }, [date]);

  const [marketState, setMarketState] = useState<string | undefined>();

  useInterval(
    async () =>
      setMarketState(
        (
          await (
            await fetch(
              "https://toi-cors.herokuapp.com/https://query2.finance.yahoo.com/v7/finance/quote?symbols=TOI.V"
            )
          ).json()
        )?.quoteResponse?.result[0]?.marketState
      ),
    60000
  );

  useInterval(() => {
    async function fetchRates() {
      setCadRate(
        (
          await (
            await fetch(
              "https://api.exchangeratesapi.io/latest?base=CAD&symbols=EUR"
            )
          ).json()
        ).rates["EUR"]
      );
    }
    fetchRates();
  }, 60000);

  function getSearch(stocks: number | string, theme: number) {
    if (typeof stocks == "number") {
      return `?stocks=${stocks}&theme=${theme}`;
    } else {
      return `?theme=${theme}`;
    }
  }

  function cycleTheme() {
    setTheme((currentTheme + 1) % themes.length);
  }

  function secretHandler(event: React.MouseEvent) {
    if (event.button === 1) {
      setDiscoMode(!discoMode);
    }
  }

  const { data: graphData } = useQuery<SparkData, SparkVars>(SPARK_QUERY, {
    variables: {
      symbol: "TOI",
      interval: 5,
      startDateTime: startDate,
      endDateTime: null,
    },
    pollInterval: 300000,
  });

  const { loading, data } = useQuery<ToiData, ToiVars>(TOI_QUERY, {
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
    let intervalId: number;
    if (discoMode) {
      intervalId = window.setInterval(() => {
        setTheme((currentTheme + 1) % themes.length);
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [discoMode, currentTheme, themes.length]);

  useEffect(() => {
    history.push({
      pathname: "/",
      search: getSearch(stocks, themeNr),
    });
  }, [stocks, themeNr]);

  const stockChanged = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const amount = Number(ev.target.value);
      setStocks(ev.target.value !== "" && !isNaN(amount) ? amount : "");
    },
    []
  );

  return (
    <div className="App">
      {loading ? (
        <h1>TOI</h1>
      ) : (
        <section id="topistonk">
          <main>
            <StockInfo
              symbol={data?.getQuoteBySymbol.symbol ?? "TOI"}
              price={data?.getQuoteBySymbol.price}
              priceChange={data?.getQuoteBySymbol.priceChange}
              percentChange={data?.getQuoteBySymbol.percentChange}
              cadRate={cadRate ?? NaN}
              sparkData={sparkData}
              marketState={marketState}
            />
            <Calculator
              stocks={stocks}
              stockChanged={stockChanged}
              price={data?.getQuoteBySymbol.price}
              cadRate={cadRate}
            />
            <ExchangeRate cadRate={cadRate} />
          </main>
          <Footer
            themes={themes}
            currentTheme={currentTheme}
            nextThemeBackground={nextThemeBackground}
            secretHandler={secretHandler}
            cycleTheme={cycleTheme}
          />
        </section>
      )}
    </div>
  );
}

export default App;
