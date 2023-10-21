import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function useLitzRedirector(
  name: string,
  originalPrefix?: string,
  imageId?: string,
) {
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
      ? `/${originalPrefix}/${name}/${imageId || ""}`
      : `/${name}/${imageId || ""}`;
  }
}
