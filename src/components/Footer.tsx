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
        href="https://github.com/rikharink/toi.vet"
        aria-label="GitHub repository rikharink/toi.vet"
      >
        <img src={themes[currentTheme].github} alt=""></img>
      </a>
      <button
        id="theme"
        onMouseUp={secretHandler}
        onClick={cycleTheme}
        style={{
          background: nextThemeBackground,
        }}
      ></button>
    </footer>
  );
}
