import { RefObject, useCallback, useEffect } from "react";
import { useMouseDrawLine } from "./hooks";
import { useAtomValue } from "jotai";
import { imageFileNameAtom, imageFileSourceAtom } from "../../atoms";
import { useNavigate } from "react-router-dom";
import { drawImage } from "@/utils/canvas";

export const VALID_IMAGE_TYPES = ["png", "jpeg", "webp"];
type ImageType = (typeof VALID_IMAGE_TYPES)[number];

export const useCanvas = ({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
}) => {
  const imageFileSource = useAtomValue(imageFileSourceAtom);
  const navigate = useNavigate();

  useMouseDrawLine({ canvasRef });
  const imageFileName = useAtomValue(imageFileNameAtom);

  const generateDownloadCanvasByImageType = useCallback(
    (imageType: ImageType) => () => {
      if (!VALID_IMAGE_TYPES.includes(imageType)) {
        console.error("Invalid image type");
        return;
      }

      const url = canvasRef.current?.toDataURL?.(`image/${imageType}`);
      if (!url) {
        console.error("Canvas is not available");
        return;
      }

      const anchorElement = document.createElement("a");
      anchorElement.href = url;
      anchorElement.download =
        `${imageFileName}.${imageType}` || `image.${imageType}`;
      anchorElement.click();
      anchorElement.remove();
    },
    [canvasRef, imageFileName]
  );

  useEffect(() => {
    if (!imageFileSource) return navigate("/");

    drawImage({
      imageFile: imageFileSource,
      canvas: canvasRef.current as HTMLCanvasElement,
    });
  }, [imageFileSource, navigate, canvasRef]);

  return {
    generateDownloadCanvasByImageType,
    drawImage,
  };
};
