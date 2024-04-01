import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider as JotaiProvider } from "jotai";
import { Canvas } from ".";
import { useHydrateAtoms } from "jotai/utils";
import { ReactNode } from "react";
import { PrimitiveAtom } from "jotai/vanilla";
import { imageFileAtom } from "../../atoms";

const HydrateAtoms = ({
  initialValues,
  children,
}: {
  // make the type more generic
  initialValues: [PrimitiveAtom<File | null>, File | null][];
  children: ReactNode;
}) => {
  useHydrateAtoms(initialValues);
  return children;
};

describe("Canvas", () => {
  it("should renders if image file is loaded", () => {
    const file = new File(["some-file-data"], "test.png", {
      type: "image/png",
    });
    const { queryByTestId } = render(
      <JotaiProvider>
        <HydrateAtoms initialValues={[[imageFileAtom, file]]}>
          <Canvas />
        </HydrateAtoms>
      </JotaiProvider>
    );

    const canvas = queryByTestId("canvas");

    expect(canvas).toBeInTheDocument();
    expect(canvas?.tagName.toLowerCase()).toBe("canvas");
  });

  it("should not renders if image file is not loaded", () => {
    const { queryByTestId } = render(
      <JotaiProvider>
        <HydrateAtoms initialValues={[[imageFileAtom, null]]}>
          <Canvas />
        </HydrateAtoms>
      </JotaiProvider>
    );

    const canvas = queryByTestId("canvas");

    expect(canvas).not.toBeInTheDocument();
  });
});
