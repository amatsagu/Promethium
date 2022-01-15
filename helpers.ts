import { ResponseHelperOptions } from "./src/types.d.ts";
import { parseBigInts } from "./src/parser.ts";

export function $json(data: Record<string, unknown>, options?: ResponseHelperOptions) {
    return new Response(JSON.stringify(data, parseBigInts), {
        headers: (options?.headers !== undefined ? Object.assign(options!.headers, { "Content-Type": "application/json; charset=utf-8" }) : { "Content-Type": "application/json; charset=utf-8" }) as HeadersInit,
        status: options?.statusCode ?? 200,
        statusText: options?.statusText ?? "OK"
    });
}

// import { render } from "https://x.lcas.dev/preact@10.5.12/ssr.js"; // JSX Support
// import type { VNode } from "https://x.lcas.dev/preact@10.5.12/mod.d.ts";

/** We're using **"PREACT"** *(https://preactjs.com/)* to render your jsx code as an alternative to much slower original. */
// export function $jsx(data: VNode, options?: ResponseHelperOptions) {
//     return new Response(render(data), {
//         headers: (options?.headers !== undefined ? Object.assign(options!.headers, { "Content-Type": "text/html; charset=utf-8" }) : { "Content-Type": "text/html; charset=utf-8" }) as HeadersInit,
//         status: options?.statusCode ?? 200,
//         statusText: options?.statusText ?? "OK"
//     });
// }

// DISABLED JSX SUPPORT FOR NOW CAUSE LATEST RELEASE OF DENO DOESN'T WANT TO WORK WITH IT!
