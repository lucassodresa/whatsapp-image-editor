import { RefObject, useCallback } from "react";
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

  const drawLineWithMouse = useCallback(() => {
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

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener("mousedown", (event) => {
      isDrawing = true;
      [lastX, lastY] = [event.offsetX, event.offsetY];
    });

    canvas.addEventListener("mousemove", (event) => {
      if (!isDrawing) return;

      context.beginPath();
      context.lineWidth = 10;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.strokeStyle = "red";

      const moveToX = (lastX * canvas.width) / canvas.offsetWidth;
      const moveToY = (lastY * canvas.height) / canvas.offsetHeight;
      const lineToX = (event.offsetX * canvas.width) / canvas.offsetWidth;
      const lineToY = (event.offsetY * canvas.height) / canvas.offsetHeight;

      context.moveTo(moveToX, moveToY);
      context.lineTo(lineToX, lineToY);
      context.stroke();

      [lastX, lastY] = [event.offsetX, event.offsetY];
    });

    canvas.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    canvas.addEventListener("mouseout", () => {
      isDrawing = false;
    });
  }, [canvasRef]);

  return {
    generateDownloadCanvasByImageType,
    drawImage,
    drawLineWithMouse,
  };
};
