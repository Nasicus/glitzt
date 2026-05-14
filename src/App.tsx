import { FC, lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GithubFork } from "./GithubFork.tsx";
import { Litzer } from "./Litzer.tsx";
import { LitzerWrapper } from "./LitzerWrapper";

// Uplitzer is only reached at /würg and pulls in react-drag-drop-files, so we
// keep it out of the main bundle.
const Uplitzer = lazy(() =>
  import("./Uplitzer.tsx").then((m) => ({ default: m.Uplitzer })),
);

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
    element: (
      <Suspense fallback={null}>
        <Uplitzer />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Litzer />,
  },
]);

export const App: FC = () => (
  <>
    <main>
      <RouterProvider router={router} />
    </main>
    <GithubFork />
  </>
);
