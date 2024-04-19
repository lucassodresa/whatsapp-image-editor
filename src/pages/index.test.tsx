import { createMemoryRouter } from "react-router-dom";
import { fireEvent, renderWithRouter } from "../jest-utils";
import { PAGES, routes } from "../routes";

import { describe, it, expect } from "vitest";

describe("Home page", () => {
  describe("Title", () => {
    it("should be a <h1> tag", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [PAGES.HOME.path],
      });
      const { getByRole } = renderWithRouter({ router });

      const heading = getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have a correct text", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [PAGES.HOME.path],
      });
      const { getByRole } = renderWithRouter({ router });

      const heading = getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Image Editor");
    });
  });

  describe("Hero Image", () => {
    it("should be an <image> tag", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [PAGES.HOME.path],
      });
      const { getByRole } = renderWithRouter({ router });

      const image = getByRole("img");
      expect(image).toBeInTheDocument();
    });

    it("should have a correct alt text", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [PAGES.HOME.path],
      });
      const { getByRole } = renderWithRouter({ router });

      const image = getByRole("img");
      expect(image).toHaveAttribute(
        "alt",
        "An person playing with color palette"
      );
    });

    it("should have a correct source", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [PAGES.HOME.path],
      });
      const { getByRole } = renderWithRouter({ router });

      const image = getByRole("img");
      expect(image).toHaveAttribute("src", "color-palette.svg");
    });
  });

  describe("Image input", () => {
    it("should be an <input> tag", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [PAGES.HOME.path],
      });
      const { getByRole } = renderWithRouter({ router });

      const imageInput = getByRole("button");

      expect(imageInput).toBeInTheDocument();
      expect(imageInput).toBeInstanceOf(HTMLInputElement);
    });

    it("should be a file input", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [PAGES.HOME.path],
      });
      const { getByRole } = renderWithRouter({ router });

      const imageInput = getByRole("button");
      expect(imageInput).toHaveAttribute("type", "file");
    });

    it("should accept only image files", () => {
      const router = createMemoryRouter(routes, {
        initialEntries: [PAGES.HOME.path],
      });
      const { getByRole } = renderWithRouter({ router });

      const imageInput = getByRole("button");
      expect(imageInput).toHaveAttribute("accept", "image/*");
    });

    describe("when upload an invalid image", () => {
      it("should not redirect to /edit page", () => {
        const validFile = new File(["some-image-content"], "text.txt", {
          type: "text/plain",
        });

        const router = createMemoryRouter(routes, {
          initialEntries: [PAGES.HOME.path],
        });
        const { getByRole } = renderWithRouter({ router });

        const imageInput = getByRole("button");

        fireEvent.change(imageInput, { target: { files: [validFile] } });

        expect(router.state.location.pathname).not.toBe("/edit");
      });
    });

    describe("when upload a valid image", () => {
      it("should redirect to /edit page", () => {
        const validFile = new File(["some-image-content"], "image.png", {
          type: "image/png",
        });

        const router = createMemoryRouter(routes, {
          initialEntries: [PAGES.HOME.path],
        });
        const { getByRole } = renderWithRouter({ router });

        const imageInput = getByRole("button");

        fireEvent.change(imageInput, { target: { files: [validFile] } });

        expect(router.state.location.pathname).toBe("/edit");
      });

      describe("when redirect to /edit page", () => {
        it("should have the <canvas> tag", () => {
          const validFile = new File(["some-image-content"], "image.png", {
            type: "image/png",
          });

          const router = createMemoryRouter(routes, {
            initialEntries: [PAGES.HOME.path],
          });
          const { getByRole, getByTestId } = renderWithRouter({ router });

          const imageInput = getByRole("button");

          fireEvent.change(imageInput, { target: { files: [validFile] } });

          expect(getByTestId("canvas")).toBeInTheDocument();
        });

        it("should show the image filename without extension", () => {
          const validFile = new File(["some-image-content"], "image.png", {
            type: "image/png",
          });

          const router = createMemoryRouter(routes, {
            initialEntries: [PAGES.HOME.path],
          });
          const { getByRole, getByPlaceholderText } = renderWithRouter({
            router,
          });

          const imageInput = getByRole("button");

          fireEvent.change(imageInput, { target: { files: [validFile] } });

          const filename = getByPlaceholderText("Filename");
          expect(filename).toHaveAttribute("value", "image");
        });
      });
    });
  });
});
