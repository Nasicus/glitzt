import { FC } from "react";
import s from "./GithubFork.module.css";

export const GithubFork: FC = () => {
  return (
    <div className={s.host}>
      <span>
        <a href="https://github.com/Nasicus/glitzt">Fork me on GitHub</a>
      </span>
    </div>
  );
};
