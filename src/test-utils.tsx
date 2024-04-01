import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import type { WritableAtom } from "jotai/vanilla";
type AnyWritableAtom = WritableAtom<unknown, never[], unknown>;
type InitialValues = [AnyWritableAtom, never][];

const TestProvider = ({
  initialValues,
  children,
}: {
  children: ReactNode;
  initialValues: InitialValues;
}) => {
  useHydrateAtoms(initialValues);

  return <JotaiProvider>{children}</JotaiProvider>;
};

const GetAllTheProviders =
  (initialValues: InitialValues) =>
  ({ children }: { children: ReactNode }) =>
    <TestProvider initialValues={initialValues}>{children}</TestProvider>;

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    initialValues: InitialValues;
  }
) =>
  render(ui, {
    wrapper: GetAllTheProviders(options?.initialValues || []),
    ...options,
  });

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRender as render };
