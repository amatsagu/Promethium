import { parse, Pattern } from "./parser.ts";
import { listenAndServe } from "./listener.ts";

export type RouteResponse = Response | void | Promise<Response | void>;
export type Handler = (request: Request, params: Record<string, string>) => RouteResponse;
export type AppOptions = Deno.ListenOptions | Deno.ListenTlsOptions;

export class App {
    constructor(options: AppOptions) {
        for (const method of App.methods) {
            this.#routes[method] = [];
        }
    }

    static readonly methods = ["GET", "PUT", "POST", "HEAD", "PATCH", "TRACE", "DELETE", "OPTIONS", "CONNECT"] as const;

    readonly #routes: Record<string, (Handler | string[] | RegExp)[]> = {};

    /**
     * Adds handler for specific pathname.
     * @param method The [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).
     * @param route The url patchname. It can be a static/dynamic string or your own regex.
     * @param handler Callback function. It has to return [Deno.Response](https://doc.deno.land/builtin/stable#Response)
     *
     * @example
     * ```ts
     * import { App } from "./mod.ts";
     *
     * const app = new App({ port: 8080 });
     *
     * // Static route
     * app.listen("GET", "/api", (req, _params) => new Response(`Hello from ${req.url}`));
     *
     * // Dynamic route (guildid is always defined & memberid is optional)
     * app.listen("POST", "/api/:guildid/:memberid?", (_req, params) => new Response(`Received: ${JSON.parse(params)}`));
     *
     * // Dynamic image hosting (return only .png files)
     * app.listen("GET", "/cdn/image.png", async (_req, params) => {
     *  const img = await fetchImageSomehow(params["image"]);
     *  const res = new Response(img);
     *  res.headers.set("Content-Typ", "image/png");
     *  return res;
     * });
     * ```
     */
    listen(method: typeof App.methods[number], route: Pattern, handler: Handler) {
        if (typeof route === "string") {
            if (route.charAt(0) !== "/") route = "/" + route;
            if (route.endsWith("/")) route.substring(0, route.length - 2);
            if (route.replace(/(?<=({.*))\s*:\s*(?=(.*}))/, "").match(/\s/)) throw new TypeError("Route path cannot include white spaces. If you need them - encode path.");
        }

        const { keys, pattern } = parse(route);
        this.#routes[method].push(handler, keys, pattern);
    }
}
