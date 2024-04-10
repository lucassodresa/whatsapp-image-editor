import "@testing-library/jest-dom";
import { useMouseDrawLine } from ".";
import { renderHook } from "@testing-library/react";
import React, { RefObject } from "react";

global.console.error = jest.fn();

let eventListeners: {
  [key: string]: EventListenerOrEventListenerObject;
};

const getMockAddEventListener = (canvas: HTMLCanvasElement) =>
  jest
    .spyOn(canvas, "addEventListener")
    .mockImplementation((type, listener) => {
      eventListeners[type] = listener;
    });

const getMockRemoveEventListener = (canvas: HTMLCanvasElement) =>
  jest
    .spyOn(canvas, "removeEventListener")
    .mockImplementation((type, listener) => {
      eventListeners[type] = listener;
    });

describe("useMouseDrawLine", () => {
  beforeEach(() => {
    eventListeners = {};
  });

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

  it("should set the last offset when mousedown", () => {
    const canvas = document.createElement("canvas");
    canvas.getContext = jest.fn().mockReturnValue({});

    const validCanvasRef = { current: canvas };

    const mockAddEventListener = getMockAddEventListener(canvas);
    const mockRemoveEventListener = getMockRemoveEventListener(canvas);

    const mockLastAxisCordinatesRef = { current: [] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef: validCanvasRef,
      })
    );

    const handleMouseDown = eventListeners["mousedown"] as EventListener;
    handleMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "mousedown",
      handleMouseDown
    );
    expect(mockLastAxisCordinatesRef.current).toEqual([10, 10]);

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "mousedown",
      handleMouseDown
    );
  });

  it("should reset last axis coordinates when mouseup", () => {
    const canvas = document.createElement("canvas");
    canvas.getContext = jest.fn().mockReturnValue({});

    const validCanvasRef = { current: canvas };

    const mockAddEventListener = getMockAddEventListener(canvas);
    const mockRemoveEventListener = getMockRemoveEventListener(canvas);

    const mockLastAxisCordinatesRef = { current: [10, 10] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef: validCanvasRef,
      })
    );
    const handleMouseUp = eventListeners["mouseup"] as EventListener;
    handleMouseUp({ offsetX: 10, offsetY: 10 } as MouseEvent);

    expect(mockAddEventListener).toHaveBeenCalledWith("mouseup", handleMouseUp);
    expect(mockLastAxisCordinatesRef.current.length).toBe(0);

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "mouseup",
      handleMouseUp
    );
  });

  it("should reset last axis coordinates when mouseout", () => {
    const canvas = document.createElement("canvas");
    canvas.getContext = jest.fn().mockReturnValue({});

    const validCanvasRef = { current: canvas };

    const mockAddEventListener = getMockAddEventListener(canvas);
    const mockRemoveEventListener = getMockRemoveEventListener(canvas);

    const mockLastAxisCordinatesRef = { current: [10, 10] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef: validCanvasRef,
      })
    );
    const handleMouseout = eventListeners["mouseout"] as EventListener;
    handleMouseout({ offsetX: 10, offsetY: 10 } as MouseEvent);

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "mouseout",
      handleMouseout
    );
    expect(mockLastAxisCordinatesRef.current.length).toBe(0);

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "mouseout",
      handleMouseout
    );
  });

  it("should not draw a line if mouse is not down", () => {
    const canvas = document.createElement("canvas");
    const mockContext = jest.mocked({
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      lineWidth: undefined,
      lineJoin: undefined,
      lineCap: undefined,
      strokeStyle: undefined,
    });
    canvas.getContext = jest.fn().mockReturnValue(mockContext);

    const validCanvasRef = { current: canvas };

    const mockAddEventListener = getMockAddEventListener(canvas);
    const mockRemoveEventListener = getMockRemoveEventListener(canvas);

    const mockLastAxisCordinatesRef = { current: [] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef: validCanvasRef,
      })
    );

    const handleMouseMove = eventListeners["mousemove"] as EventListener;
    handleMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "mousemove",
      handleMouseMove
    );

    expect(mockContext.beginPath).not.toHaveBeenCalled();
    expect(mockContext.moveTo).not.toHaveBeenCalled();
    expect(mockContext.lineTo).not.toHaveBeenCalled();
    expect(mockContext.stroke).not.toHaveBeenCalled();
    expect(mockContext.lineWidth).toBeUndefined();
    expect(mockContext.lineJoin).toBeUndefined();
    expect(mockContext.lineCap).toBeUndefined();
    expect(mockContext.strokeStyle).toBeUndefined();

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "mousemove",
      handleMouseMove
    );
  });

  it("should draw a line if when move if mouse is down", () => {
    const mockContext = jest.mocked({
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      lineWidth: undefined,
      lineJoin: undefined,
      lineCap: undefined,
      strokeStyle: undefined,
    });
    const mockCanvas = jest.mocked({
      width: 100,
      height: 100,
      offsetWidth: 50,
      offsetHeight: 50,
      getContext: jest.fn().mockReturnValue(mockContext),
      addEventListener: jest.fn().mockImplementation((type, listener) => {
        eventListeners[type] = listener;
      }),
      removeEventListener: jest.fn().mockImplementation((type, listener) => {
        eventListeners[type] = listener;
      }),
    });

    const validCanvasRef = { current: mockCanvas };

    const mockLastAxisCordinatesRef = { current: [] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef: validCanvasRef as unknown as RefObject<HTMLCanvasElement>,
      })
    );

    const handleMouseMove = eventListeners["mousemove"] as EventListener;
    const handleMouseDown = eventListeners["mousedown"] as EventListener;

    handleMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);
    handleMouseMove({ offsetX: 11, offsetY: 11 } as MouseEvent);

    expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
      "mousemove",
      handleMouseMove
    );

    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalledWith(20, 20);
    expect(mockContext.lineTo).toHaveBeenCalledWith(22, 22);
    expect(mockContext.stroke).toHaveBeenCalled();

    expect(mockContext.lineWidth).toBe(10);
    expect(mockContext.lineJoin).toBe("round");
    expect(mockContext.lineCap).toBe("round");
    expect(mockContext.strokeStyle).toBe("red");

    expect(mockLastAxisCordinatesRef.current).toEqual([11, 11]);

    unmount();

    expect(mockCanvas.removeEventListener).toHaveBeenCalledWith(
      "mousemove",
      handleMouseMove
    );
  });
});
