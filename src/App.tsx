import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GithubFork } from "./components/GithubFork";
import { Litzer } from "./components/Litzer";
import { LitzerWrapper } from "./LitzerWrapper";

const App: FC = () => {
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

export default App;
