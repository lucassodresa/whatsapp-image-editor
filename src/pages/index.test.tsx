import { fireEvent, renderWithRouter } from "@/utils/test";
import { PAGES } from "@/routes";
import { describe, it, expect } from "vitest";

const DEFAULT_ROUTER_OPTIONS = {
  initialEntries: [PAGES.HOME.path],
};

describe("Home page", () => {
  describe("Title", () => {
    it("should be a <h1> tag", () => {
      const { getByRole } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
      });

      const heading = getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have a correct text", () => {
      const { getByRole } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
      });

      const heading = getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Image Editor");
    });
  });

  describe("Hero Image", () => {
    it("should be an <image> tag", () => {
      const { getByRole } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
      });

      const image = getByRole("img");
      expect(image).toBeInTheDocument();
    });

    it("should have a correct alt text", () => {
      const { getByRole } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
      });

      const image = getByRole("img");
      expect(image).toHaveAttribute(
        "alt",
        "An person playing with color palette"
      );
    });

    it("should have a correct source", () => {
      const { getByRole } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
      });

      const image = getByRole("img");
      expect(image).toHaveAttribute("src", "color-palette.svg");
    });
  });

  describe("Image input", () => {
    it("should be an <input> tag", () => {
      const { getByRole } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
      });

      const imageInput = getByRole("button");

      expect(imageInput).toBeInTheDocument();
      expect(imageInput).toBeInstanceOf(HTMLInputElement);
    });

    it("should be a file input", () => {
      const { getByRole } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
      });

      const imageInput = getByRole("button");
      expect(imageInput).toHaveAttribute("type", "file");
    });

    it("should accept only image files", () => {
      const { getByRole } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
      });

      const imageInput = getByRole("button");
      expect(imageInput).toHaveAttribute("accept", "image/*");
    });

    describe("when upload an invalid image", () => {
      it("should not redirect to /edit page", () => {
        const validFile = new File(["some-image-content"], "text.txt", {
          type: "text/plain",
        });

        const { getByRole, router } = renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
        });

        const imageInput = getByRole("button");
        fireEvent.change(imageInput, { target: { files: [validFile] } });

        expect(router.state.location.pathname).not.toBe("/edit");
      });

      it("should clear the file input files if is not a file", () => {
        const invalidFile = null;

        const { getByRole } = renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
        });

        const imageInput = getByRole("button") as HTMLInputElement;
        fireEvent.change(imageInput, { target: { files: [invalidFile] } });

        expect(imageInput.files).toBeNull();
      });

      it("should clear the file input files if it is not an image file", () => {
        const validFile = new File(["some-image-content"], "text.txt", {
          type: "text/plain",
        });

        const { getByRole } = renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
        });

        const imageInput = getByRole("button") as HTMLInputElement;
        fireEvent.change(imageInput, { target: { files: [validFile] } });

        expect(imageInput.files).toBeNull();
      });
    });

    describe("when upload a valid image", () => {
      it("should redirect to /edit page", () => {
        const validFile = new File(["some-image-content"], "image.png", {
          type: "image/png",
        });

        const { getByRole, router } = renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
        });

        const imageInput = getByRole("button");
        fireEvent.change(imageInput, { target: { files: [validFile] } });

        expect(router.state.location.pathname).toBe("/edit");
      });

      describe("when redirect to /edit page", () => {
        it("should have the <canvas> tag", () => {
          const validFile = new File(["some-image-content"], "image.png", {
            type: "image/png",
          });

          const { getByRole, getByTestId } = renderWithRouter({
            routerOptions: DEFAULT_ROUTER_OPTIONS,
          });

          const imageInput = getByRole("button");
          fireEvent.change(imageInput, { target: { files: [validFile] } });

          expect(getByTestId("canvas")).toBeInTheDocument();
        });

        it("should show the image filename without extension", () => {
          const validFile = new File(["some-image-content"], "image.png", {
            type: "image/png",
          });

          const { getByRole, getByPlaceholderText } = renderWithRouter({
            routerOptions: DEFAULT_ROUTER_OPTIONS,
          });

          const imageInput = getByRole("button");
          fireEvent.change(imageInput, { target: { files: [validFile] } });

          const filename = getByPlaceholderText("Filename");
          expect(filename).toHaveValue("image");
        });
      });
    });
  });
});
