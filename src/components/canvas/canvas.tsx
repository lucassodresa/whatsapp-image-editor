import { ForwardedRef, forwardRef } from "react";
import clsx from "clsx";

export const Canvas = forwardRef((_, ref: ForwardedRef<HTMLCanvasElement>) => {
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
