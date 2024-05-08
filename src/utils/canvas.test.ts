import { vi } from "vitest";
import { drawImage } from "./canvas";

describe("canvas", () => {
  describe("drawImage", () => {
    it("should log an error if image does not exists", async () => {
      const imageFile = null as never as File;
      const canvas = document.createElement("canvas");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await drawImage({ imageFile, canvas });

      expect(consoleSpy).toHaveBeenCalledWith("Image file does not exists");
    });

    it("should log an error if canvas does not exists", async () => {
      const imageFile = new File([], "image.jpg");
      const canvas = null as never as HTMLCanvasElement;
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await drawImage({ imageFile, canvas });

      expect(consoleSpy).toHaveBeenCalledWith("Canvas does not exists");
    });

    it("should log an error if canvas context does not exists", () => {
      const imageFile = new File([], "image.jpg");
      const canvas = document.createElement("canvas");
      vi.spyOn(canvas, "getContext").mockReturnValue(null);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      drawImage({ imageFile, canvas });

      expect(consoleSpy).toHaveBeenCalledWith("Canvas context does not exists");
    });

    it("should draw an image on the canvas", async () => {
      const imageFile = new File([], "image.jpg");
      const canvas = {
        getContext: () => context,
      } as never as HTMLCanvasElement;

      const context = {
        drawImage: vi.fn(),
      } as never as CanvasRenderingContext2D;

      vi.spyOn(canvas, "getContext").mockReturnValue(context);

      await drawImage({ imageFile, canvas });

      expect(context.drawImage).toHaveBeenCalled();
    });
  });
});
