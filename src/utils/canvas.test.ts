import { vi } from "vitest";
import { drawImage, toBase64 } from "./canvas";

describe("canvas", () => {
  describe("drawImage", () => {
    it("should log an error if image does not exists", async () => {
      const imageFile = null as never as File;

      const canvas = document.createElement("canvas");

      await drawImage({ imageFile, canvas });

      expect(console.error).toHaveBeenCalledWith("Image file does not exists");
    });

    it("should log an error if canvas does not exists", async () => {
      const imageFile = new File([], "image.jpg");
      const canvas = null as never as HTMLCanvasElement;

      await drawImage({ imageFile, canvas });

      expect(console.error).toHaveBeenCalledWith("Canvas does not exists");
    });

    it("should log an error if canvas context does not exists", () => {
      const imageFile = new File([], "image.jpg");
      const canvas = document.createElement("canvas");
      vi.spyOn(canvas, "getContext").mockReturnValue(null);

      drawImage({ imageFile, canvas });

      expect(console.error).toHaveBeenCalledWith(
        "Canvas context does not exists"
      );
    });

    describe("when canvas exists", () => {
      it("should set the image src with file base64 string", async () => {
        const imageFile = new File(["some-content"], "image.jpg");
        const expectedImageSrc = await toBase64(imageFile);
        const canvas = document.createElement("canvas");
        const image = new Image();

        await drawImage({ imageFile, canvas });

        expect(image.src).toBe(expectedImageSrc);
      });

      it("should set the canvas dimensions with image width and height", async () => {
        const imageFile = new File(["some-content"], "image.jpg");
        const canvas = document.createElement("canvas");
        const image = new Image();

        await drawImage({ imageFile, canvas });

        expect(canvas.width).toBe(image.width);
        expect(canvas.height).toBe(image.height);
      });

      it("should draw an image", async () => {
        const imageFile = new File([], "image.jpg");
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const image = new Image();

        await drawImage({ imageFile, canvas });

        expect(context?.drawImage).toHaveBeenCalledWith(
          image,
          0,
          0,
          image.width,
          image.height
        );
      });
    });
  });
});
