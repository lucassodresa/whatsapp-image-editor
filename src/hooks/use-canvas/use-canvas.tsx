import { RefObject, useCallback, useEffect, useRef } from "react";
export const VALID_IMAGE_TYPES = ["png", "jpeg", "jpg", "webp"];
type ImageType = (typeof VALID_IMAGE_TYPES)[number];

export const useCanvas = ({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
}) => {
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
      anchorElement.download = "download-this-canvas";
      anchorElement.click();
      anchorElement.remove();
    },
    [canvasRef]
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

  const lastAxisCordinatesRef = useRef<number[]>([]);

  useEffect(() => {
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

    const handleMouseDown = ({ offsetX, offsetY }: MouseEvent) => {
      lastAxisCordinatesRef.current = [offsetX, offsetY];
    };

    const handleMouseMove = ({ offsetX, offsetY }: MouseEvent) => {
      const lastAxisCordinates = lastAxisCordinatesRef.current;
      const isDrawing = lastAxisCordinates.length !== 0;

      if (!isDrawing) return;

      context.beginPath();
      context.lineWidth = 10;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.strokeStyle = "red";

      const [lastX, lastY] = lastAxisCordinates;

      const moveToX = (lastX * canvas.width) / canvas.offsetWidth;
      const moveToY = (lastY * canvas.height) / canvas.offsetHeight;
      const lineToX = (offsetX * canvas.width) / canvas.offsetWidth;
      const lineToY = (offsetY * canvas.height) / canvas.offsetHeight;

      context.moveTo(moveToX, moveToY);
      context.lineTo(lineToX, lineToY);
      context.stroke();

      lastAxisCordinatesRef.current = [offsetX, offsetY];
    };

    const handleMouseUp = () => {
      lastAxisCordinatesRef.current = [];
    };
    const handleMouseOut = () => {
      lastAxisCordinatesRef.current = [];
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseOut);

    () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseOut);
    };
  }, [canvasRef]);

  return {
    generateDownloadCanvasByImageType,
    drawImage,
  };
};
