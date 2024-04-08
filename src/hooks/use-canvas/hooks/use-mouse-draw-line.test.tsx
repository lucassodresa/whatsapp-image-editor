import "@testing-library/jest-dom";
import { useMouseDrawLine } from ".";
import { renderHook } from "@testing-library/react";
import { RefObject } from "react";

global.console.error = jest.fn();

describe("useMouseDrawLine", () => {
  it("should throw an error if canvas does not exists", () => {
    const invalidCanvasRef =
      undefined as unknown as RefObject<HTMLCanvasElement>;

    renderHook(() => useMouseDrawLine({ canvasRef: invalidCanvasRef }));

    expect(global.console.error).toHaveBeenCalledWith("Canvas does not exists");
  });

  it("should throw an error if canvas context does not exists", () => {
    const mockCanvasRefWithInvalidGetContext = {
      current: {} as unknown,
    } as RefObject<HTMLCanvasElement>;

    renderHook(() =>
      useMouseDrawLine({ canvasRef: mockCanvasRefWithInvalidGetContext })
    );

    expect(global.console.error).toHaveBeenCalledWith(
      "Canvas context does not exists"
    );
  });
});
