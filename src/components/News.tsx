import * as React from "react";
import { NewsItem } from "../api";
import { formatDate } from "../util";

export interface INewsRateProps {
  news: NewsItem[];
}

export function NewsComponent({ news }: INewsRateProps) {
  return (
    <div id="news">
      <h2>latest news</h2>
      <ul className="news">
        {news.map((i) => (
          <li key={i.link!} className="news-item">
            <strong>[{formatDate(i.publishDate!)}] </strong>
            <a href={i.link!}>
             {i.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
