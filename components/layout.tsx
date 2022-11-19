import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import { GithubFork } from "./githubFork";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Wer häts glitzt?</title>
      </Head>
      {children}
      <GithubFork />
    </>
  );
};

export default Layout;
