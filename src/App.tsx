import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GithubFork } from "./GithubFork.tsx";
import { Litzer } from "./Litzer.tsx";
import { Uplitzer } from "./Uplitzer.tsx";
import { LitzerWrapper } from "./LitzerWrapper";

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

export const App: FC = () => (
  <>
    <RouterProvider router={router} />
    <GithubFork />
  </>
);
