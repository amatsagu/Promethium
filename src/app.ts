import { parse } from "./parser.ts";
import { listenAndServe } from "./listener.ts";
import { AppOptions, Handler, Pattern } from "./types.d.ts";

export class App {
    constructor(options: AppOptions) {
        for (const method of App.methods) {
            this.#routes[method] = [];
        }

        listenAndServe(options, async (req) => {
            const params: Record<string, string> = {};
            const branch = this.#routes[req.method] ?? [];
            const url = req.url.substring(req.url.indexOf("/", 14));

            const len = branch.length;

            for (let o = 0; o < len; o += 3) {
                const handler = branch[o] as Handler;
                const keys = branch[o + 1] as string[];
                const pattern = branch[o + 2] as RegExp;

                if (keys.length === 0) {
                    const res = pattern.exec(url);
                    if (res === null) continue;

                    const groups = res.groups;
                    if (groups !== undefined) for (const key in groups) params[key] = groups[key];
                } else if (0 < keys.length) {
                    const res = pattern.exec(url);
                    if (res === null) continue;

                    const entries = keys.length;
                    for (let oo = 0; oo < entries; oo++) params[keys[oo]] = res[1 + oo];
                } else if (false === pattern.test(url)) continue;

                return await handler(req, params);
            }

            return new Response(undefined, { status: 404, statusText: "Not found" });
        });
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
