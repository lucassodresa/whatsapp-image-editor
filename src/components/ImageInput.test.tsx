import { render } from "@testing-library/react";
import { ImageInput } from "./ImageInput";
import "@testing-library/jest-dom";

describe("ImageInput", () => {
  it("renders correctly an input tag that only accepts image file types", () => {
    const { queryByTestId } = render(<ImageInput />);

    const imageInput = queryByTestId("image-input");

    expect(imageInput).toBeInTheDocument();
    expect(imageInput?.tagName.toLowerCase()).toBe("input");
    expect(imageInput).toHaveAttribute("type", "file");
    expect(imageInput).toHaveAttribute("accept", "image/*");
  });

  it.todo("should load an image file");

  it.todo("should accept only image file type");
});
