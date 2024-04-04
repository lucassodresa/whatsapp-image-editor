import "@testing-library/jest-dom";
import { VALID_IMAGE_TYPES, useCanvas } from ".";
import { renderHook } from "@testing-library/react";
import { RefObject } from "react";

describe("useCanvas", () => {
  describe("generateDownloadCanvasByImageType", () => {
    it("should generate a function that when execute download an image by type", () => {
      const mockToDataURL = jest.fn(() => "some-url");
      const mockCanvasRef = {
        current: { toDataURL: mockToDataURL } as unknown,
      } as RefObject<HTMLCanvasElement>;

      const { result } = renderHook(() =>
        useCanvas({ canvasRef: mockCanvasRef })
      );
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
        expect(mockAnchorElement.href).toBe("some-url");
        expect(mockAnchorElement.download).toBe("download-this-canvas");
        expect(mockAnchorElement.click).toHaveBeenCalled();
        expect(mockAnchorElement.remove).toHaveBeenCalled();
      });
    });

    it.todo("shoud throw an error if the image type is invalid");
    it.todo("shoud throw an error if canvas is not available");
    it.todo(
      "shoud throw an error if something goes wrong while downloading image from canvas"
    );
  });
});
