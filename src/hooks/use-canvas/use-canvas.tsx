import { RefObject, useCallback, useEffect } from "react";
import { useMouseDrawLine } from "./hooks";
import { useAtomValue } from "jotai";
import { imageFileNameAtom, imageFileSourceAtom } from "../../atoms";
import { useNavigate } from "react-router-dom";
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

  const drawImage = useCallback(
    (imageFile: File) => {
      if (!imageFile) {
        console.error("Image file does not exists");
        return;
      }

      const canvas = canvasRef?.current;
      if (!canvas) {
        console.error("Canvas does not exists");
        return;
      }

      const context = canvas?.getContext?.("2d");
      if (!context) {
        console.error("Canvas context does not exists");
        return;
      }

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0, image.width, image.height);
      };

      const fileReader = new FileReader();
      fileReader.readAsDataURL(imageFile);

      fileReader.onload = ({ target }) => {
        image.src = target?.result as string;
      };
    },
    [canvasRef]
  );

  useEffect(() => {
    if (!imageFileSource) return navigate("/");

    drawImage(imageFileSource);
  }, [imageFileSource, navigate, drawImage]);

  return {
    generateDownloadCanvasByImageType,
    drawImage,
  };
};
