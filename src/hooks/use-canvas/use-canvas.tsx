import { RefObject } from "react";

export const useCanvas = ({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
}) => {
  const drawImage = (imageFile: File | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx || !imageFile) return;

    const image = new Image();
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);

    fileReader.onload = () => {
      image.onload = () => {
        const originalWidthToHeightRatio = image.width / image.height;

        const width = Math.floor(image.height * originalWidthToHeightRatio);
        const height = Math.floor(image.width / originalWidthToHeightRatio);

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);
      };
      image.src = fileReader.result as string;
    };
  };

  return { drawImage };
};
