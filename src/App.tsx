import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GithubFork } from "./components/GithubFork";
import { Litzer } from "./components/Litzer";
import { Uplitzer } from "./components/Uplitzer";
import { LitzerWrapper } from "./LitzerWrapper";

export const App: FC = () => {
  const router = createBrowserRouter([
    {
      path: ":name",
      element: <LitzerWrapper />,
    },
    {
      path: ":nameOrPrefix/:nameOrImageId",
      element: <LitzerWrapper />,
    },
    {
      path: ":prefix/:name/:imageId",
      element: <LitzerWrapper />,
    },
    {
      path: "würg",
      element: <Uplitzer />,
    },
    {
      path: "*",
      element: <Litzer />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <GithubFork />
    </>
  );
};
