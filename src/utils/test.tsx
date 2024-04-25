import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import type { WritableAtom } from "jotai/vanilla";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "@/routes";

type AnyWritableAtom = WritableAtom<unknown, never[], unknown>;
export type jotaiInitialValues = [AnyWritableAtom, never][];

export type InitialEntry = string | Partial<Location>;

type RouterOptions = {
  basename?: string;
  initialEntries?: InitialEntry[];
  initialIndex?: number;
};

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

const customRenderRoute = ({
  routerOptions,
  jotaiInitialValues,
}: {
  jotaiInitialValues?: jotaiInitialValues;
  routerOptions: RouterOptions;
}) => {
  const router = createMemoryRouter(routes, { ...routerOptions });
  render(
    <TestProvider
      jotaiInitialValues={jotaiInitialValues ?? []}
      router={router}
    />
  );

  return {
    router,
  };
};

export * from "@testing-library/react";
export { customRenderRoute as renderWithRouter };
