import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const fallbackImageId = "litz1.gif";

export const Litzer: FC<{
  name?: string;
  prefix?: string;
  imageId?: string;
}> = ({ name = "🤦", imageId: initialImageId, prefix: originalPrefix }) => {
  const litzMessage = useMemo(getMessage, [name, originalPrefix]);
  const [imageId, setImageId] = useState(initialImageId);
  const initializeImageIdCallback = useCallback(initializeImageId, [
    initialImageId,
    setImageId,
  ]);

  useEffect(() => {
    initializeImageIdCallback().then(null);
  }, [initializeImageIdCallback]);

  if (!imageId) {
    return null;
  }

  return (
    <Host>
      <h1>{litzMessage}</h1>
      <LitzImage
        src={`/assets/litzes/${imageId}`}
        onError={() => setImageId(fallbackImageId)}
      />
      <br />
      <LinkContainer>
        <a href={getPermalink()}>Permalink</a>
      </LinkContainer>
    </Host>
  );

  function getMessage() {
    if (name === "🤦" || name === "👩") {
      return `S'hät wieder ${name === "👩" ? "eini" : "eine"} glitzt!`;
    }

    if (name === "mich") {
      return "Mich häts glitzt!";
    }

    const prefix = originalPrefix === "👩" ? "D'" : originalPrefix || "Dä ";
    return `${startWithUpper(prefix)}${startWithUpper(name)} häts glitzt!`;
  }

  function getPermalink() {
    return originalPrefix
      ? `/${originalPrefix}/${name}/${imageId}`
      : `/${name}/${imageId}`;
  }

  async function initializeImageId() {
    if (initialImageId) {
      return;
    }

    try {
      setImageId(await fetch("/server/random-litz.php").then((r) => r.json()));
    } catch (err) {
      console.error(`Failed to load image: ${JSON.stringify(err)}`);
      setImageId(fallbackImageId);
    }
  }
};

function startWithUpper(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const Host = styled.div`
  text-align: center;
`;

const LitzImage = styled.img`
  width: 480px;
  height: 307.848px;
  left: 0px;
  top: 0px;
`;

const LinkContainer = styled.span`
  font-size: 0.75rem;
`;
