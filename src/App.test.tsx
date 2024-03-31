import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { Provider as JotaiProvider } from "jotai";

describe("ImageInput", () => {
  it("renders correctly an input tag that only accepts image file types", () => {
    const { queryByTestId } = render(
      <JotaiProvider>
        <App />
      </JotaiProvider>
    );

    const imageInput = queryByTestId("image-input");

    expect(imageInput).toBeInTheDocument();
    expect(imageInput?.tagName.toLowerCase()).toBe("input");
    expect(imageInput).toHaveAttribute("type", "file");
    expect(imageInput).toHaveAttribute("accept", "image/*");
  });

  it("should load an image file", () => {
    const file = new File(["some-file-data"], "test.png", {
      type: "image/png",
    });
    const { queryByTestId } = render(
      <JotaiProvider>
        <App />
      </JotaiProvider>
    );

    const imageInput = queryByTestId("image-input") as HTMLInputElement;
    fireEvent.change(imageInput, { target: { files: [file] } });

    expect(imageInput.files).toEqual([file]);
  });

  it("should not load a file different of image type", () => {
    const file = new File(["some-file-data"], "test.txt", {
      type: "text/plain",
    });
    const { queryByTestId } = render(
      <JotaiProvider>
        <App />
      </JotaiProvider>
    );

    const imageInput = queryByTestId("image-input") as HTMLInputElement;
    fireEvent.change(imageInput, { target: { files: [file] } });

    expect(imageInput.files).toEqual(null);
  });
});
