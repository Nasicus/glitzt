import { FC, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getServerBaseUrl } from "../urlUtils";
import { Separator } from "./Separator";

const fallbackImageId = "litz1.gif";

export const Litzer: FC<{
  name?: string;
  prefix?: string;
  imageId?: string;
}> = ({ name = "🤦", imageId: imageIdToDisplay, prefix: originalPrefix }) => {
  const litzMessage = useMemo(getMessage, [name, originalPrefix]);
  const [nextImageId, setNextImageId] = useState(imageIdToDisplay);
  const [getNextImage, setGetNextImage] = useState(!imageIdToDisplay);

  useEffect(() => {
    initializeImageId().then(null);
  }, [getNextImage]);

  useLitzRedirector(name, originalPrefix, nextImageId);

  return (
    <Host>
      <h1>{litzMessage}</h1>
      <ImageWrapper>
        {imageIdToDisplay && <LitzImage
          src={`${getServerBaseUrl()}/assets/litzes/${imageIdToDisplay}`}
          onError={() => setNextImageId(nextImageId)}
        />}
      </ImageWrapper>
      <br />
      <LinkContainer>
        <button
          disabled={getNextImage}
          onClick={() => {
            setGetNextImage(true);
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
    if (!getNextImage) {
      return;
    }

    try {
      const nextImageId = await fetch(
        `${getServerBaseUrl()}/server/random-litz.php`
      ).then((r) => r.json());

      setGetNextImage(false);
      setNextImageId(nextImageId);
    } catch (err) {
      setGetNextImage(false);
      setNextImageId(fallbackImageId);
      console.error(`Failed to load image: ${JSON.stringify(err)}`);
    }
  }
};

function useLitzRedirector(name: string, originalPrefix?: string, imageId?: string, ) {
    const location = useLocation();
    const navigate = useNavigate();
    const litzUrl = getLitzPath();
  
    useEffect(() => {
      const currentPath = location.pathname
        .split("/")
        .map((part) => decodeURIComponent(part))
        .join("/");
  
      if (!imageId || currentPath === litzUrl) {
        return;
      }
  
      // navigate to permalink, if not there yet
      navigate(litzUrl);
    }, [imageId, location, navigate, litzUrl]);
    
    return null;

  function getLitzPath() {
    return originalPrefix
      ? `/${originalPrefix}/${name}/${imageId ||""}`
      : `/${name}/${imageId ||""}`;
  }
}

function startWithUpper(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const Host = styled.div`
  text-align: center;
`;

const ImageWrapper = styled.div`
  height: 310px;
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
