import { FC, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getServerBaseUrl } from "./urlUtils.ts";
import { Separator } from "./Separator.tsx";
import { useLitzRedirector } from "./useLitzRedirector.tsx";

const fallbackImageId = "litz1.gif";

function litzUrl(imageId: string) {
  return `${getServerBaseUrl()}/assets/litzes/${imageId}`;
}

export const Litzer: FC<{
  name?: string;
  prefix?: string;
  imageId?: string;
}> = ({ name = "🤦", imageId: imageIdToDisplay, prefix: originalPrefix }) => {
  const litzMessage = useMemo(() => getMessage(), [name, originalPrefix]);
  const [getNextImage, setGetNextImage] = useState(!imageIdToDisplay);
  // The currently *displayed* GIF URL. Swapping `<img src>` mid-animation
  // freezes the old GIF on whatever frame it was on (or appears to rewind it,
  // depending on the browser) until the new one is decoded. So we preload the
  // next GIF in memory and only flip the visible src once it's ready.
  const [displayedSrc, setDisplayedSrc] = useState<string | undefined>(
    imageIdToDisplay ? litzUrl(imageIdToDisplay) : undefined,
  );

  useEffect(() => {
    initializeImageId().then(null);
  }, [getNextImage]);

  const redirectToNextImage = useLitzRedirector(
    name,
    originalPrefix,
    imageIdToDisplay,
  );

  useEffect(() => {
    if (!imageIdToDisplay) return;
    const next = litzUrl(imageIdToDisplay);
    const preloader = new Image();
    let cancelled = false;
    preloader.onload = () => {
      if (!cancelled) setDisplayedSrc(next);
    };
    preloader.onerror = () => {
      if (!cancelled) redirectToNextImage(fallbackImageId);
    };
    preloader.src = next;
    return () => {
      cancelled = true;
    };
  }, [imageIdToDisplay]);

  return (
    <Host>
      <h1>{litzMessage}</h1>
      <ImageWrapper>
        {displayedSrc && <LitzImage src={displayedSrc} />}
      </ImageWrapper>
      <br />
      <LinkContainer>
        <StyledButton
          disabled={getNextImage}
          onClick={() => {
            setGetNextImage(true);
          }}
        >
          Es anders Bild
        </StyledButton>
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
        `${getServerBaseUrl()}/server/random-litz.php`,
      ).then((r) => r.json());

      setGetNextImage(false);
      redirectToNextImage(nextImageId);
    } catch (err) {
      setGetNextImage(false);
      redirectToNextImage(fallbackImageId);
      console.error(`Failed to load image: ${JSON.stringify(err)}`);
    }
  }
};

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

const StyledButton = styled.button`
  @media screen and (max-width: 700px) {
    width: 100%;
    height: 2.5rem;
    margin-bottom: 1rem;
  }
`;
