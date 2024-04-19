import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import type { WritableAtom } from "jotai/vanilla";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

type AnyWritableAtom = WritableAtom<unknown, never[], unknown>;
export type jotaiInitialValues = [AnyWritableAtom, never][];

export const HydrateAtoms = ({
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
  router,
}: {
  children?: ReactNode;
  jotaiInitialValues: jotaiInitialValues;
  router: ReturnType<typeof createMemoryRouter>;
}) => {
  return (
    <JotaiProvider>
      <HydrateAtoms jotaiInitialValues={jotaiInitialValues}>
        <RouterProvider router={router} />
        {children}
      </HydrateAtoms>
    </JotaiProvider>
  );
};

const customRenderRoute = (options: {
  jotaiInitialValues?: jotaiInitialValues;
  router: ReturnType<typeof createMemoryRouter>;
}) =>
  render(
    <TestProvider
      jotaiInitialValues={options?.jotaiInitialValues || []}
      router={options.router}
    />
  );

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRenderRoute as renderWithRouter };
