import "./App.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import history from "history/browser";
import { useInterval } from "./UseIntervalHook";
import { Footer } from "./components/Footer";
import {
  Configuration,
  ConfigurationParameters,
  StockInfoApi,
  StockInfoGetRequest,
  StockInfo,
} from "./api/";
import { CalculatorComponent } from "./components/Calculator";
import { ExchangeRateComponent } from "./components/ExchangeRate";
import { StockPriceComponent } from "./components/StockPrice";
import { SparklineComponent } from "./components/Sparkline";
import { StockDetailsComponent } from "./components/StockDetails";

import { formatNumber } from "./util";

function App() {
  const themes = useMemo(
    () => [
      { background: "yellow", foreground: "dark", github: "/github.png" },
      { background: "pink", foreground: "light", github: "/github-light.png" },
      { background: "blue", foreground: "light", github: "/github-light.png" },
    ],
    []
  );

  const api_parameters: ConfigurationParameters = {
    basePath: process.env.REACT_APP_BACKEND_URL,
  };

  const api = new StockInfoApi(new Configuration(api_parameters));

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
  const [discoMode, setDiscoMode] = useState<boolean>(false);

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
      search: getSearch(stocks, currentTheme),
    });
  }, [stocks, currentTheme]);

  const [stockInfo, setStockInfo] = useState<StockInfo>();
  useInterval(async () => {
    const parameters: StockInfoGetRequest = {
      symbol: "TOI.V",
      toCurrency: "EUR",
    };
    const info = await api.stockInfoGet(parameters);
    setStockInfo(info);
  }, 60000);

  useEffect(() => {
    if (!stockInfo?.stockPrice) return;
    document.title = `TOI | ${formatNumber(
      stockInfo.stockPrice.price
    )} CAD | € ${formatNumber(
      stockInfo.stockPrice.priceConverted
    )} | ${formatNumber(stockInfo.stockPrice.percentageChange)}%`;
  }, [stockInfo]);

  const stockChanged = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const amount = Number(ev.target.value);
      setStocks(ev.target.value !== "" && !isNaN(amount) ? amount : "");
    },
    []
  );

  return (
    <div className="App">
      <section id="topistonk">
        <main>
          {stockInfo ? (
            <>
              <StockPriceComponent
                symbol="TOI"
                stockPrice={stockInfo.stockPrice}
              />
              <SparklineComponent data={stockInfo.intradayData ?? []} />
              <StockDetailsComponent stockPrice={stockInfo.stockPrice} />
              <CalculatorComponent
                stocks={stocks}
                stockChanged={stockChanged}
                stockPrice={stockInfo.stockPrice}
              />
              <ExchangeRateComponent exchangeRate={stockInfo.exchangeRate} />
            </>
          ) : (
            <h1>TOI</h1>
          )}
        </main>
        <Footer
          themes={themes}
          currentTheme={currentTheme}
          nextThemeBackground={nextThemeBackground}
          secretHandler={secretHandler}
          cycleTheme={cycleTheme}
        />
      </section>
    </div>
  );
}

export default App;
