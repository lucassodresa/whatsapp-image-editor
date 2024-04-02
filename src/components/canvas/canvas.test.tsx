import "@testing-library/jest-dom";
import { Canvas } from ".";
import { imageFileAtom } from "../../atoms";
import { render } from "../../test-utils";

describe("Canvas", () => {
  it("should renders if image file is loaded", () => {
    const file = new File(["some-file-data"], "test.png", {
      type: "image/png",
    });
    const { queryByTestId } = render(<Canvas ref={null} />, {
      jotaiInitialValues: [[imageFileAtom, file as never]],
    });

    const canvas = queryByTestId("canvas");

    expect(canvas).toBeInTheDocument();
    expect(canvas).not.toHaveClass("hidden");
    expect(canvas?.tagName.toLowerCase()).toBe("canvas");
  });

  it("should not renders if image file is not loaded", () => {
    const { queryByTestId } = render(<Canvas ref={null} />, {
      jotaiInitialValues: [[imageFileAtom, null as never]],
    });

    const canvas = queryByTestId("canvas");

    expect(canvas).toHaveClass("hidden");
  });
});
