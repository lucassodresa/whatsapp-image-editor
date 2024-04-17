import { Home } from ".";
import { render } from "../test-utils";

describe("Home page", () => {
  describe("Title", () => {
    it("should be a heading level 1", () => {
      const { getByRole } = render(<Home />);
      const heading = getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have the text 'Image Editor'", () => {
      const { getByRole } = render(<Home />);
      const heading = getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Image Editor");
    });
  });
});
