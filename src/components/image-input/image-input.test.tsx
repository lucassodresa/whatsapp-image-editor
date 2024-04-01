import "@testing-library/jest-dom";
import { ImageInput } from ".";
import { fireEvent, render } from "../../test-utils";

describe("ImageInput", () => {
  it("should renders correctly an input tag that only accepts image file types", () => {
    const { queryByTestId } = render(<ImageInput />);

    const imageInput = queryByTestId("image-input");

    expect(imageInput).toBeInTheDocument();
    expect(imageInput?.tagName.toLowerCase()).toBe("input");
    expect(imageInput).toHaveAttribute("type", "file");
    expect(imageInput).toHaveAttribute("accept", "image/*");
  });

  it("should load an image file and remove input from screen", async () => {
    const file = new File(["some-file-data"], "test.png", {
      type: "image/png",
    });
    const { queryByTestId } = render(<ImageInput />);

    const imageInput = queryByTestId("image-input") as HTMLInputElement;
    fireEvent.change(imageInput, { target: { files: [file] } });

    expect(imageInput.files).toEqual([file]);
    expect(imageInput).not.toBeInTheDocument();
  });

  it("should not load a file different of image type", async () => {
    const file = new File(["some-file-data"], "test.txt", {
      type: "text/plain",
    });
    const { queryByTestId } = render(<ImageInput />);

    const imageInput = queryByTestId("image-input") as HTMLInputElement;
    fireEvent.change(imageInput, { target: { files: [file] } });

    expect(imageInput.files).toEqual(null);
    expect(imageInput).toBeInTheDocument();
  });
});
