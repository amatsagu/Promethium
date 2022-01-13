import { AppOptions, RouteResponse } from "./types.d.ts";

// @ts-ignore Unstable :/
const interrupt = Deno.core.Interrupted;
// @ts-ignore Unstable :/
const badResource = Deno.core.BadResource;

export async function listenAndServe(options: AppOptions, callback: (request: Request) => RouteResponse) {
    const tcp = (options as Deno.ListenTlsOptions).keyFile ? Deno.listenTls(options as Deno.ListenTlsOptions) : Deno.listen(options);

    while (true) {
        try {
            tick(Deno.serveHttp(await tcp.accept()));
        } catch (err) {
            const type = err.constructor;
            if (type !== interrupt && type !== badResource) throw err;
        }
    }

    async function tick(http: Deno.HttpConn) {
        while (true) {
            try {
                const event = await http.nextRequest();
                if (event === null) break;

                const data = await callback(event.request);
                if (data !== undefined) {
                    data.headers.set("Server", "Promethium");
                    event.respondWith(data);
                }
            } catch {
                // Do nothing.
            }
        }
    }
}
