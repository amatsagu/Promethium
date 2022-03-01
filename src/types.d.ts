export type RouteResponse = Response | void | Promise<Response | void>;
export type Handler = (request: Request, params: Record<string, string>) => RouteResponse;
export type AppOptions = Omit<Deno.ListenOptions | Deno.ListenTlsOptions, "transport">;
export type Pattern = RegExp | string;
export type JSONLike = Record<string, any> | Record<string, any>[] | any[] | null;

// Optional
export interface ResponseHelperOptions {
    statusCode?: number
    statusText?: string
    headers?: Record<string, unknown>
}

// Private
export interface ParseResult {
    keys: string[];
    pattern: RegExp;
}
