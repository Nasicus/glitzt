import { FC } from "react";
import { useMatches } from "react-router-dom";
import { Litzer } from "./Litzer.tsx";

export const LitzerWrapper: FC = () => {
  const matches = useMatches();
  const routeParams = matches[0].params;

  return <Litzer {...getProps()} />;

  function getProps() {
    const { name, prefix, imageId, nameOrPrefix, nameOrImageId } = routeParams;

    if (nameOrPrefix && nameOrImageId) {
      if (nameOrImageId.includes(".")) {
        return { name: nameOrPrefix, imageId: nameOrImageId };
      }

      return { prefix: nameOrPrefix, name: nameOrImageId };
    }

    return {
      name,
      prefix,
      imageId,
    };
  }
};
