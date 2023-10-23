import { useNavigate } from "react-router-dom";

export function useLitzRedirector(
  name: string,
  prefix?: string,
  currentImageId?: string,
) {
  const navigate = useNavigate();

  return (newImageId: string) => redirect(newImageId, currentImageId);

  function redirect(newImageId: string, oldImageId?: string) {
    if (newImageId === oldImageId) {
      return;
    }

    navigate(getLitzPath(newImageId), { replace: !oldImageId });
  }

  function getLitzPath(imageId: string) {
    return prefix
      ? `/${prefix}/${name}/${imageId}`
      : `/${name}/${imageId}`;
  }
}
