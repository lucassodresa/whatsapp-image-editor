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
      const validFile = new File(["some-image-content"], "image.png", {
        type: "image/png",
      });

      const { router } = renderWithRouter({
        routerOptions: DEFAULT_ROUTER_OPTIONS,
        jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
      });

      expect(router.state.location.pathname).toBe(PAGES.HOME.path);
    });
  });

  describe("Canvas", () => {
    it("should be a <canvas> tag", () => {
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
  });
});
