import * as React from "react";
import { Theme } from "../theme";

export interface IFooterProps {
  themes: Theme[];
  currentTheme: number;
  nextThemeBackground: string;
  secretHandler: (ev: React.MouseEvent) => void;
  cycleTheme: (ev: React.MouseEvent) => void;
}

export function Footer({
  themes,
  currentTheme,
  nextThemeBackground,
  secretHandler,
  cycleTheme,
}: IFooterProps) {
  return (
    <footer>
      <a
        href="https://github.com/toi-vet/"
        aria-label="GitHub repositories toi.vet"
      >
        <img src={themes[currentTheme].github} alt=""></img>
      </a>

      <a className="btn btn-link" href="/shop.html">
        merch
      </a>

      <button
        id="theme"
        className="btn"
        onMouseUp={secretHandler}
        onClick={cycleTheme}
        style={{
          background: nextThemeBackground,
        }}
      ></button>
    </footer>
  );
}
