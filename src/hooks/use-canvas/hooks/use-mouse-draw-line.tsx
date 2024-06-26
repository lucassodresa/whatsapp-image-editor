import { useAtomValue } from "jotai";
import { RefObject, useEffect, useRef } from "react";
import { isDrawingAtom, lineColorAtom, lineSizeAtom } from "../../../atoms";
export const VALID_IMAGE_TYPES = ["png", "jpeg", "jpg", "webp"];

export const useMouseDrawLine = ({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
}) => {
  const lastAxisCordinatesRef = useRef<number[]>([]);
  const isDrawing = useAtomValue(isDrawingAtom);
  const lineColor = useAtomValue(lineColorAtom);
  const lineSize = useAtomValue(lineSizeAtom);

  const resetLastAxisCordinates = () => (lastAxisCordinatesRef.current = []);

  useEffect(() => {
    if (!isDrawing) return;

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
      context.lineWidth = lineSize;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.strokeStyle = lineColor;

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

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", resetLastAxisCordinates);
    canvas.addEventListener("mouseout", resetLastAxisCordinates);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", resetLastAxisCordinates);
      canvas.removeEventListener("mouseout", resetLastAxisCordinates);
    };
  }, [canvasRef, isDrawing, lineColor, lineSize]);
};
