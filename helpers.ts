import { ResponseHelperOptions, JSONLike } from "./src/types.d.ts";

export function $json(data: JSONLike, options?: ResponseHelperOptions) {
    return new Response(
        JSON.stringify(data, (_, value) => (typeof value === "bigint" ? value.toString() : value)),
        {
            headers: (options?.headers !== undefined ? Object.assign(options!.headers, { "Content-Type": "application/json; charset=utf-8" }) : { "Content-Type": "application/json; charset=utf-8" }) as HeadersInit,
            status: options?.statusCode ?? 200
        }
    );
}

export function $text(data: any, options?: ResponseHelperOptions) {
    return new Response(String(data), {
        headers: (options?.headers !== undefined ? Object.assign(options!.headers, { "Content-Type": "text/plain; charset=utf-8" }) : { "Content-Type": "text/plain; charset=utf-8" }) as HeadersInit,
        status: options?.statusCode ?? 200
    });
}

export function $html(filePath: string, options?: ResponseHelperOptions) {
    if (filePath.endsWith(".html") === false) throw new Error("Invalid file type!");

    return new Response(Deno.readTextFileSync(filePath), {
        headers: (options?.headers !== undefined ? Object.assign(options!.headers, { "Content-Type": "text/html; charset=utf-8" }) : { "Content-Type": "text/html; charset=utf-8" }) as HeadersInit,
        status: options?.statusCode ?? 200
    });
}

export function $file(filePath: string) {
    try {
        return new Response(Deno.readFileSync(filePath));
    } catch {
        return new Response("404 Not Found", { status: 404 });
    }
}
