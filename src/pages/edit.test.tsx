import { imageFileSourceAtom } from "@/atoms";
import { PAGES } from "@/routes";
import { renderWithRouter } from "@/utils/test";
import { describe, it, expect } from "vitest";

const DEFAULT_ROUTER_OPTIONS = {
  initialEntries: [PAGES.EDIT.path],
};

describe("Edit page", () => {
  describe("Canvas", () => {
    it("should be a <canvas> tag", () => {
      const validFile = new File(["some-image-content"], "image.txt", {
        type: "plain/text",
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
