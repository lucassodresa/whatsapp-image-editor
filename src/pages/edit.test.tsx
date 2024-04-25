import { imageFileSourceAtom } from "@/atoms";
import { PAGES } from "@/routes";
import { renderWithRouter } from "@/utils/test";
import { describe, it, expect } from "vitest";

const DEFAULT_ROUTER_OPTIONS = {
  initialEntries: [PAGES.EDIT.path],
};

describe("Edit page", () => {
  describe("when no image file is provided", () => {
    it("should redirect to home page", () => {
      const notSetFile = null;

      const { router } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
        jotaiInitialValues: [[imageFileSourceAtom, notSetFile as never]],
      });

      expect(router.state.location.pathname).toBe(PAGES.HOME.path);
    });
  });
  describe("when an image file is provided", () => {
    describe("Header", () => {
      it("should render go back button", () => {
        const validFile = new File(["some-image-content"], "image.png", {
          type: "image/png",
        });

        const { getByLabelText } = renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
          jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
        });

        const goBackButton = getByLabelText("Go back to previous page");
        expect(goBackButton).toBeInTheDocument();
      });
    });

    describe("Canvas", () => {
      it("should render", () => {
        const validFile = new File(["some-image-content"], "image.png", {
          type: "image/png",
        });

        const { getByTestId } = renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
          jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
        });

        const canvas = getByTestId("canvas");
        expect(canvas).toBeInTheDocument();
      });
      it("should be a <canvas> tag", () => {
        const validFile = new File(["some-image-content"], "image.png", {
          type: "image/png",
        });

        const { getByTestId } = renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
          jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
        });

        const canvas = getByTestId("canvas");
        expect(canvas?.tagName.toLowerCase()).toBe("canvas");
      });

      it.todo("should render the image");
      it.todo("should allow drawing on the canvas");
      it.todo("should allow clearing the canvas");
      it.todo('should allow downloading the image as "png", "jpeg", or "webp"');
      it.todo('should clear the image when clicking on "Clear" button');
      it.todo("should render the image with the correct dimensions");
      it.todo("should render the image with the correct aspect ratio");
    });
  });
});
