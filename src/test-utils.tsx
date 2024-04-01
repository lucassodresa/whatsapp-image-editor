import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import type { WritableAtom } from "jotai/vanilla";
type AnyWritableAtom = WritableAtom<unknown, never[], unknown>;
export type jotaiInitialValues = [AnyWritableAtom, never][];

const HydrateAtoms = ({
  jotaiInitialValues,
  children,
}: {
  children: ReactNode;
  jotaiInitialValues: jotaiInitialValues;
}) => {
  useHydrateAtoms(jotaiInitialValues);
  return children;
};

const TestProvider = ({
  jotaiInitialValues,
  children,
}: {
  children: ReactNode;
  jotaiInitialValues: jotaiInitialValues;
}) => (
  <JotaiProvider>
    <HydrateAtoms jotaiInitialValues={jotaiInitialValues}>
      {children}
    </HydrateAtoms>
  </JotaiProvider>
);

const customRender = (
  ui: ReactElement,
  options?: RenderOptions & { jotaiInitialValues: jotaiInitialValues }
) =>
  render(
    <TestProvider jotaiInitialValues={options?.jotaiInitialValues || []}>
      {ui}
    </TestProvider>,
    options
  );

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRender as render };
