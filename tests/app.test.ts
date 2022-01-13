import { assertEquals } from "https://deno.land/std@0.115.1/testing/asserts.ts";

Deno.test("Serving app to the outside world\n", async () => {
    const server = new Worker(new URL("./example_server.ts", import.meta.url).href, {
        type: "module",
        // @ts-ignore Invalid @types for Worker.
        deno: {
            namespace: true,
        }
    });

    const a = await (await fetch("http://localhost:8080/")).text();
    assertEquals("Hello world", a);

    const b = await (await fetch("http://localhost:8080/key/secret")).json();
    assertEquals({ key: "secret" }, b);

    server.terminate();
});