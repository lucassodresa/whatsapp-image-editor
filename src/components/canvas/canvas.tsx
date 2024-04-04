import { useAtomValue } from "jotai";
import { imageFileAtom } from "../../atoms";
import { ForwardedRef, forwardRef } from "react";
import clsx from "clsx";

export const Canvas = forwardRef((_, ref: ForwardedRef<HTMLCanvasElement>) => {
  const imageFile = useAtomValue(imageFileAtom);

  return (
    <canvas
      ref={ref}
      data-testid="canvas"
      className={clsx(
        !imageFile && "hidden",
        "max-w-full max-h-[calc(100vh-80px)] mx-auto border-2 rounded-md"
      )}
    ></canvas>
  );
});
