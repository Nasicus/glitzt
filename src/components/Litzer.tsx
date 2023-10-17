import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Separator } from "./Separator";

const fallbackImageId = "litz1.gif";

function getPermalink(name: string, originalPrefix?: string, imageId = "") {
  return originalPrefix
    ? `/${originalPrefix}/${name}/${imageId}`
    : `/${name}/${imageId}`;
}

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

  // set the url to permanent url if it's not already there
  const location = useLocation();
  const navigate = useNavigate();
  const permalink = getPermalink(name, originalPrefix, imageId);
  useEffect(() => {
    const currentLink = location.pathname
      .split("/")
      .map((part) => decodeURIComponent(part))
      .join("/");

    if (!imageId || currentLink === permalink) {
      return;
    }

    // navigate to permalink, if not there yet
    navigate(permalink);
  }, [imageId, location, navigate, permalink]);

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
        <button
          onClick={() => {
            setImageId(undefined);
            initializeImageIdCallback();
          }}
        >
          Es anders Bild
        </button>
        <Separator />
        <Link to="/würg">Würg neui Litz Bilder ine</Link>
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
  object-fit: contain;
  max-width: 480px;
  max-height: 307.848px;
  width: 100%;
  height: auto;
`;

const LinkContainer = styled.div`
  font-size: 0.75rem;

  @media screen and (max-width: 700px) {
    margin-top: 10px;
    font-size: 1rem;
  }
`;
