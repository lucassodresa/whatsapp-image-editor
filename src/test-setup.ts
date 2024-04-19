import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";
import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from "util";
import { fetch, Request, Response, Headers } from "@remix-run/web-fetch";
import { AbortController as NodeAbortController } from "abort-controller";

// @ts-expect-error  globalThis.IS_REACT_ACT_ENVIRONMENT is not available in the global scope
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

if (!globalThis.fetch) {
  // @ts-expect-error  lib.dom.d.ts doesn't allow a URL to the fetch function
  globalThis.fetch = fetch;
  // @ts-expect-error lib.dom.d.ts doesn't allow a URL to the Request constructor
  globalThis.Request = Request;
  //
  // @ts-expect-error web-std/fetch Response does not currently implement Response.error()
  globalThis.Response = Response;
  // @ts-expect-error lib.dom.d.ts doesn't allow a HeadersInit to the Headers constructor
  globalThis.Headers = Headers;
}

if (!globalThis.AbortController) {
  // @ts-expect-error lib.dom.d.ts doesn't allow a signal to the AbortController constructor
  globalThis.AbortController = NodeAbortController;
}

if (!globalThis.TextEncoder || !globalThis.TextDecoder) {
  globalThis.TextEncoder = NodeTextEncoder;
  // @ts-expect-error  TextDecoder is not available in the global scope
  globalThis.TextDecoder = NodeTextDecoder;
}
