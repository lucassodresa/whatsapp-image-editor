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
      if (!VALID_IMAGE_TYPES.includes(imageType))
        throw new Error("Invalid image type");

      const url = canvasRef.current?.toDataURL(`image/${imageType}`);
      if (!url) throw new Error("Canvas is not available");

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
      if (!imageFile) throw new Error("Image file does not exists");

      const canvas = canvasRef?.current;
      if (!canvas) throw new Error("Canvas does not exists");

      const canvasContext = canvas?.getContext?.("2d");
      if (!canvasContext) throw new Error("Canvas context does not exists");

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;

        canvasContext.drawImage(image, 0, 0, image.width, image.height);
      };

      const fileReader = new FileReader();
      fileReader.readAsDataURL(imageFile);

      fileReader.onload = ({ target }) => {
        image.src = target?.result as string;
      };
    },
    [canvasRef]
  );

  const drawLineWithMouse = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener("mousedown", (event) => {
      isDrawing = true;
      [lastX, lastY] = [event.offsetX, event.offsetY];
    });

    canvas.addEventListener("mousemove", (event) => {
      if (!isDrawing) return;

      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "red";

      const moveToX = (lastX * canvas.width) / canvas.offsetWidth;
      const moveToY = (lastY * canvas.height) / canvas.offsetHeight;

      const lineToX = (event.offsetX * canvas.width) / canvas.offsetWidth;
      const lineToY = (event.offsetY * canvas.height) / canvas.offsetHeight;

      ctx.moveTo(moveToX, moveToY);

      ctx.lineTo(lineToX, lineToY);
      ctx.stroke();

      [lastX, lastY] = [event.offsetX, event.offsetY];
    });

    canvas.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    canvas.addEventListener("mouseout", () => {
      isDrawing = false;
    });
  };

  return {
    generateDownloadCanvasByImageType,
    drawImage,
    drawLineWithMouse,
  };
};
