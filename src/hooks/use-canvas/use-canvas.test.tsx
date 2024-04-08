import "@testing-library/jest-dom";
import { VALID_IMAGE_TYPES, useCanvas } from ".";
import { renderHook } from "@testing-library/react";
import { RefObject } from "react";
import { useMouseDrawLine } from "./hooks";

useMouseDrawLine as jest.Mock;

jest.mock("./hooks", () => ({
  ...jest.requireActual("./hooks"),
  useMouseDrawLine: jest.fn(),
}));

describe("useCanvas", () => {
  describe("generateDownloadCanvasByImageType", () => {
    it("shoud throw an error if the image type is invalid", () => {
      const mockToDataURL = jest.fn(() => "some-url");
      const mockCanvasRef = {
        current: { toDataURL: mockToDataURL } as unknown,
      } as RefObject<HTMLCanvasElement>;

      const { result } = renderHook(() =>
        useCanvas({ canvasRef: mockCanvasRef })
      );
      expect(useMouseDrawLine).toHaveBeenCalledWith({
        canvasRef: mockCanvasRef,
      });

      global.console.error = jest.fn();
      const { generateDownloadCanvasByImageType } = result.current;

      const invalidImageType = "invalid-type";
      const downloadCanvas =
        generateDownloadCanvasByImageType(invalidImageType);
      downloadCanvas();

      expect(global.console.error).toHaveBeenCalledWith("Invalid image type");
    });

    it("shoud throw an error if canvas is not available", () => {
      const mockCanvasRef = {
        current: undefined as unknown,
      } as RefObject<HTMLCanvasElement>;

      const { result } = renderHook(() =>
        useCanvas({ canvasRef: mockCanvasRef })
      );
      expect(useMouseDrawLine).toHaveBeenCalledWith({
        canvasRef: mockCanvasRef,
      });

      global.console.error = jest.fn();
      const { generateDownloadCanvasByImageType } = result.current;

      const validImageType = VALID_IMAGE_TYPES[0];
      const downloadCanvas = generateDownloadCanvasByImageType(validImageType);
      downloadCanvas();

      expect(global.console.error).toHaveBeenCalledWith(
        "Canvas is not available"
      );
    });

    it("should generate a function that when execute download an image by type", () => {
      const mockToDataURL = jest.fn(() => "some-url");
      const mockCanvasRef = {
        current: { toDataURL: mockToDataURL } as unknown,
      } as RefObject<HTMLCanvasElement>;

      const { result } = renderHook(() =>
        useCanvas({ canvasRef: mockCanvasRef })
      );

      expect(useMouseDrawLine).toHaveBeenCalledWith({
        canvasRef: mockCanvasRef,
      });

      const { generateDownloadCanvasByImageType } = result.current;

      const mockAnchorElement = {
        download: "",
        href: "",
        click: jest.fn(),
        remove: jest.fn(),
      } as unknown as HTMLAnchorElement;
      const mockCreateElement = jest
        .spyOn(document, "createElement")
        .mockReturnValue(mockAnchorElement);

      VALID_IMAGE_TYPES.forEach((imageType) => {
        const downloadCanvas = generateDownloadCanvasByImageType(imageType);
        downloadCanvas();

        expect(mockToDataURL).toHaveBeenCalledWith(`image/${imageType}`);
        expect(mockCreateElement).toHaveBeenCalledWith("a");
        expect(mockAnchorElement.click).toHaveBeenCalled();
        expect(mockAnchorElement.remove).toHaveBeenCalled();
        expect(mockAnchorElement.href).toBe("some-url");
        expect(mockAnchorElement.download).toBe("download-this-canvas");
      });
    });
  });

  describe("drawImage", () => {
    it("should throw an error if image file does not exists", () => {
      const invalidCanvasRef =
        undefined as unknown as RefObject<HTMLCanvasElement>;
      const invalidImageFile = undefined as unknown as File;

      const { result } = renderHook(() =>
        useCanvas({ canvasRef: invalidCanvasRef })
      );
      expect(useMouseDrawLine).toHaveBeenCalledWith({
        canvasRef: invalidCanvasRef,
      });

      global.console.error = jest.fn();
      const { drawImage } = result.current;
      drawImage(invalidImageFile);

      expect(global.console.error).toHaveBeenCalledWith(
        "Image file does not exists"
      );
    });

    it("should throw an error if canvas does not exists", () => {
      const invalidCanvasRef =
        undefined as unknown as RefObject<HTMLCanvasElement>;
      const validImageFile = new File([""], "image.png");

      const { result } = renderHook(() =>
        useCanvas({ canvasRef: invalidCanvasRef })
      );
      expect(useMouseDrawLine).toHaveBeenCalledWith({
        canvasRef: invalidCanvasRef,
      });

      global.console.error = jest.fn();
      const { drawImage } = result.current;
      drawImage(validImageFile);

      expect(global.console.error).toHaveBeenCalledWith(
        "Canvas does not exists"
      );
    });

    it("should throw an error if canvas context does not exists", () => {
      const mockCanvasRefWithInvalidGetContext = {
        current: {} as unknown,
      } as RefObject<HTMLCanvasElement>;
      const validImageFile = new File([""], "image.png");

      const { result } = renderHook(() =>
        useCanvas({ canvasRef: mockCanvasRefWithInvalidGetContext })
      );

      expect(useMouseDrawLine).toHaveBeenCalledWith({
        canvasRef: mockCanvasRefWithInvalidGetContext,
      });

      global.console.error = jest.fn();
      const { drawImage } = result.current;
      drawImage(validImageFile);

      expect(global.console.error).toHaveBeenCalledWith(
        "Canvas context does not exists"
      );
    });

    it("should draw the image on canvas", () => {
      const mockDrawImage = jest.fn();
      const mockGetContext = jest.fn(() => ({ drawImage: mockDrawImage }));
      const mockCanvasRef = {
        current: { getContext: mockGetContext } as unknown,
      } as RefObject<HTMLCanvasElement>;
      const validImageFile = new File([""], "image.png");

      const { result } = renderHook(() =>
        useCanvas({ canvasRef: mockCanvasRef })
      );
      expect(useMouseDrawLine).toHaveBeenCalledWith({
        canvasRef: mockCanvasRef,
      });

      const { drawImage } = result.current;

      const mockImageInstance = {
        width: 100,
        height: 100,
      } as unknown as HTMLImageElement & { onload: () => void };

      global.Image = function () {
        return mockImageInstance;
      } as unknown as typeof Image;

      const mockFileReaderInstance = {
        readAsDataURL: jest.fn(),
      } as unknown as FileReader & {
        onload: (event: ProgressEvent<FileReader>) => void;
      };

      global.FileReader = function () {
        return mockFileReaderInstance;
      } as unknown as typeof FileReader;

      drawImage(validImageFile);
      expect(mockGetContext).toHaveBeenCalledWith("2d");
      expect(mockFileReaderInstance.readAsDataURL).toHaveBeenCalledWith(
        validImageFile
      );

      mockImageInstance.onload();

      expect(mockCanvasRef.current?.width).toBe(mockImageInstance.width);
      expect(mockCanvasRef.current?.height).toBe(mockImageInstance.height);
      expect(mockDrawImage).toHaveBeenCalledWith(
        mockImageInstance,
        0,
        0,
        mockImageInstance.width,
        mockImageInstance.height
      );

      mockFileReaderInstance.onload({
        target: { result: "some-url" },
      } as ProgressEvent<FileReader>);

      expect(mockImageInstance.src).toBe("some-url");
    });
  });
});
