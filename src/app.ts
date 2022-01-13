export type RouteResponse = Response | void | Promise<Response | void>;
export type Handler = (request: Request, params: Record<string, string>) => RouteResponse;
export type AppOptions = Deno.ListenOptions | Deno.ListenTlsOptions;

