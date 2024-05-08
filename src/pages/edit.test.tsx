import { imageFileSourceAtom } from "@/atoms";
import { PAGES } from "@/routes";
import { drawImage } from "@/utils/canvas";
import { renderWithRouter, screen } from "@/utils/test";
import { act } from "react-dom/test-utils";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/utils/canvas", () => ({ drawImage: vi.fn() }));

const DEFAULT_ROUTER_OPTIONS = {
  initialEntries: [PAGES.EDIT.path],
};

const validFile = new File(["some-image-content"], "image.png", {
  type: "image/png",
});

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
      describe("Clear image button", () => {
        it("should have the correct aria text", () => {
          renderWithRouter({
            routerOptions: DEFAULT_ROUTER_OPTIONS,
            jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
          });

          const goBackButton = screen.getByLabelText("Clear image uploaded");
          expect(goBackButton).toBeInTheDocument();
        });

        it("should be a <button> tag", () => {
          renderWithRouter({
            routerOptions: DEFAULT_ROUTER_OPTIONS,
            jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
          });

          const goBackButton = screen.getByLabelText("Clear image uploaded");
          expect(goBackButton?.tagName.toLowerCase()).toBe("button");
        });

        describe("when clicked", () => {
          it("should redirect to home page", () => {
            const { router } = renderWithRouter({
              routerOptions: DEFAULT_ROUTER_OPTIONS,
              jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
            });

            const goBackButton = screen.getByLabelText("Clear image uploaded");
            act(() => {
              goBackButton.click();
            });

            expect(router.state.location.pathname).toBe(PAGES.HOME.path);
          });

          it("should clear the image file", () => {
            renderWithRouter({
              routerOptions: DEFAULT_ROUTER_OPTIONS,
              jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
            });

            const goBackButton = screen.getByLabelText("Clear image uploaded");
            act(() => {
              goBackButton.click();
            });

            const imageInput = screen.getByRole("button") as HTMLInputElement;
            expect(imageInput.files).toHaveLength(0);
          });
        });
      });
    });

    describe("Canvas", () => {
      it("should be a <canvas> tag", () => {
        renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
          jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
        });

        const canvas = screen.getByTestId("canvas");
        expect(canvas?.tagName.toLowerCase()).toBe("canvas");
      });

      it("should draw the image on the canvas", () => {
        renderWithRouter({
          routerOptions: DEFAULT_ROUTER_OPTIONS,
          jotaiInitialValues: [[imageFileSourceAtom, validFile as never]],
        });

        expect(drawImage).toHaveBeenCalled();
      });
    });
  });
});
