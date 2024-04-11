import { RefObject, useCallback } from "react";
import { useMouseDrawLine } from "./hooks";
import { useAtomValue } from "jotai";
import { imageFileAtom } from "../../atoms";
export const VALID_IMAGE_TYPES = ["png", "jpeg", "webp"];
type ImageType = (typeof VALID_IMAGE_TYPES)[number];

export const useCanvas = ({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
}) => {
  useMouseDrawLine({ canvasRef });
  const imageFile = useAtomValue(imageFileAtom);

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
        `${imageFile?.name}.${imageType}` || `image.${imageType}`;
      anchorElement.click();
      anchorElement.remove();
    },
    [canvasRef, imageFile]
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

  return {
    generateDownloadCanvasByImageType,
    drawImage,
  };
};
