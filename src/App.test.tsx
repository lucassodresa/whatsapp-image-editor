import { render, fireEvent, renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { useAtom } from "jotai";
import { imageFileAtom } from "./atoms";

describe("ImageInput", () => {
  it("renders correctly an input tag that only accepts image file types", () => {
    const { queryByTestId } = render(<App />);

    const imageInput = queryByTestId("image-input");

    expect(imageInput).toBeInTheDocument();
    expect(imageInput?.tagName.toLowerCase()).toBe("input");
    expect(imageInput).toHaveAttribute("type", "file");
    expect(imageInput).toHaveAttribute("accept", "image/*");
  });

  it("should not load a file different of image type", () => {
    const file = new File(["some-file-data"], "test.txt", {
      type: "text/plain",
    });
    const { queryByTestId } = render(<App />);

    const imageInput = queryByTestId("image-input") as HTMLInputElement;
    fireEvent.change(imageInput, { target: { files: [file] } });

    const { result } = renderHook(() => useAtom(imageFileAtom));
    const [imageFile] = result.current;

    expect(imageFile).toEqual(null);
  });

  it("should load an image file", () => {
    const file = new File(["some-file-data"], "test.png", {
      type: "image/png",
    });
    const { queryByTestId } = render(<App />);

    const imageInput = queryByTestId("image-input") as HTMLInputElement;
    fireEvent.change(imageInput, { target: { files: [file] } });

    const { result } = renderHook(() => useAtom(imageFileAtom));
    const [imageFile] = result.current;

    expect(imageFile).toEqual(file);
  });
});
