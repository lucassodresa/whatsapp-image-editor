import { useAtomValue } from "jotai";
import { imageFileSourceAtom } from "../../atoms";
import { ForwardedRef, forwardRef } from "react";
import clsx from "clsx";

export const Canvas = forwardRef((_, ref: ForwardedRef<HTMLCanvasElement>) => {
  const imageFileSource = useAtomValue(imageFileSourceAtom);

  if (!imageFileSource) return null;

  return (
    <canvas
      ref={ref}
      data-testid="canvas"
      className={clsx(
        "max-w-full max-h-[calc(100vh-160px)] mx-auto border-2 rounded-md"
      )}
    ></canvas>
  );
});
