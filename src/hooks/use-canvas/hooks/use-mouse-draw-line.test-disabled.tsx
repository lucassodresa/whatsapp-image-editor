import "@testing-library/jest-dom";
import { useMouseDrawLine } from ".";
import { renderHook } from "@testing-library/react";
import React, { RefObject } from "react";

global.console.error = jest.fn();

let eventListeners: {
  [key: string]: EventListenerOrEventListenerObject;
};

const mockAddEventListenerImplementation = (
  type: string,
  listener: EventListener
) => {
  eventListeners[type] = listener;
};

const mockRemoveEventListenerImplementation = (type: string) => {
  delete eventListeners[type];
};

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
    const mockCanvasRefWithInvalidGetContext = jest.mocked({
      current: {},
    });

    renderHook(() =>
      useMouseDrawLine({
        canvasRef:
          mockCanvasRefWithInvalidGetContext as unknown as RefObject<HTMLCanvasElement>,
      })
    );

    expect(global.console.error).toHaveBeenCalledWith(
      "Canvas context does not exists"
    );
  });

  it("should set the last offset when mousedown", () => {
    const mockValidCanvasRef = jest.mocked({
      current: {
        getContext: jest.fn(() => ({})),
        addEventListener: jest
          .fn()
          .mockImplementation(mockAddEventListenerImplementation),
        removeEventListener: jest
          .fn()
          .mockImplementation(mockRemoveEventListenerImplementation),
      },
    });

    const mockLastAxisCordinatesRef = { current: [] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef:
          mockValidCanvasRef as unknown as RefObject<HTMLCanvasElement>,
      })
    );

    const handleMouseDown = eventListeners["mousedown"] as EventListener;
    handleMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);

    expect(mockValidCanvasRef.current.addEventListener).toHaveBeenCalledWith(
      "mousedown",
      handleMouseDown
    );
    expect(mockLastAxisCordinatesRef.current).toEqual([10, 10]);

    unmount();

    expect(mockValidCanvasRef.current.removeEventListener).toHaveBeenCalledWith(
      "mousedown",
      handleMouseDown
    );
  });

  it("should reset last axis coordinates when mouseup", () => {
    const mockValidCanvasRef = jest.mocked({
      current: {
        getContext: jest.fn(() => ({})),
        addEventListener: jest
          .fn()
          .mockImplementation(mockAddEventListenerImplementation),
        removeEventListener: jest
          .fn()
          .mockImplementation(mockRemoveEventListenerImplementation),
      },
    });

    const mockLastAxisCordinatesRef = { current: [10, 10] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef:
          mockValidCanvasRef as unknown as RefObject<HTMLCanvasElement>,
      })
    );
    const handleMouseUp = eventListeners["mouseup"] as EventListener;
    handleMouseUp({ offsetX: 10, offsetY: 10 } as MouseEvent);

    expect(mockValidCanvasRef.current.addEventListener).toHaveBeenCalledWith(
      "mouseup",
      handleMouseUp
    );
    expect(mockLastAxisCordinatesRef.current.length).toBe(0);

    unmount();

    expect(mockValidCanvasRef.current.removeEventListener).toHaveBeenCalledWith(
      "mouseup",
      handleMouseUp
    );
  });

  it("should reset last axis coordinates when mouseout", () => {
    const mockValidCanvasRef = jest.mocked({
      current: {
        getContext: jest.fn(() => ({})),
        addEventListener: jest
          .fn()
          .mockImplementation(mockAddEventListenerImplementation),
        removeEventListener: jest
          .fn()
          .mockImplementation(mockRemoveEventListenerImplementation),
      },
    });

    const mockLastAxisCordinatesRef = { current: [10, 10] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef:
          mockValidCanvasRef as unknown as RefObject<HTMLCanvasElement>,
      })
    );
    const handleMouseout = eventListeners["mouseout"] as EventListener;
    handleMouseout({ offsetX: 10, offsetY: 10 } as MouseEvent);

    expect(mockValidCanvasRef.current.addEventListener).toHaveBeenCalledWith(
      "mouseout",
      handleMouseout
    );
    expect(mockLastAxisCordinatesRef.current.length).toBe(0);

    unmount();

    expect(mockValidCanvasRef.current.removeEventListener).toHaveBeenCalledWith(
      "mouseout",
      handleMouseout
    );
  });

  it("should not draw a line if mouse is not down when mouse move", () => {
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

    const mockValidCanvasRef = jest.mocked({
      current: {
        getContext: jest.fn().mockReturnValue(mockContext),
        addEventListener: jest
          .fn()
          .mockImplementation(mockAddEventListenerImplementation),
        removeEventListener: jest
          .fn()
          .mockImplementation(mockRemoveEventListenerImplementation),
      },
    });

    const mockLastAxisCordinatesRef = { current: [] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef:
          mockValidCanvasRef as unknown as RefObject<HTMLCanvasElement>,
      })
    );

    const handleMouseMove = eventListeners["mousemove"] as EventListener;
    handleMouseMove({ offsetX: 20, offsetY: 20 } as MouseEvent);

    expect(mockValidCanvasRef.current.addEventListener).toHaveBeenCalledWith(
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

    expect(mockValidCanvasRef.current.removeEventListener).toHaveBeenCalledWith(
      "mousemove",
      handleMouseMove
    );
  });

  it("should draw a line if mouse is down when mouse move", () => {
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

    const mockValidCanvasRef = jest.mocked({
      current: {
        width: 100,
        height: 100,
        offsetWidth: 50,
        offsetHeight: 50,
        getContext: jest.fn().mockReturnValue(mockContext),
        addEventListener: jest
          .fn()
          .mockImplementation(mockAddEventListenerImplementation),
        removeEventListener: jest
          .fn()
          .mockImplementation(mockRemoveEventListenerImplementation),
      },
    });

    const mockLastAxisCordinatesRef = { current: [] };
    jest.spyOn(React, "useRef").mockReturnValue(mockLastAxisCordinatesRef);

    const { unmount } = renderHook(() =>
      useMouseDrawLine({
        canvasRef:
          mockValidCanvasRef as unknown as RefObject<HTMLCanvasElement>,
      })
    );

    const handleMouseMove = eventListeners["mousemove"] as EventListener;
    const handleMouseDown = eventListeners["mousedown"] as EventListener;

    handleMouseDown({ offsetX: 10, offsetY: 10 } as MouseEvent);
    handleMouseMove({ offsetX: 11, offsetY: 11 } as MouseEvent);

    expect(mockValidCanvasRef.current.addEventListener).toHaveBeenCalledWith(
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

    expect(mockValidCanvasRef.current.removeEventListener).toHaveBeenCalledWith(
      "mousemove",
      handleMouseMove
    );
  });
});
