import { App } from "../src/app.ts";

const app = new App({port: 8080});
const users = new Set<string>();

app.listen("GET", "/", () => new Response("Hello world"));

app.listen("GET", "/key/:val", (_req, params) => {
    const res = new Response(JSON.stringify({ key: params["val"] }));
    res.headers.set("Content-Type", "application/json");
    return res;
});

app.listen("POST", "/users", async (req, _params) => {
    const payload = await req.text();
    let content

    if (payload && payload.length !== 0) {
        try {
            content = JSON.parse(payload);
        }
        catch {
            const res = new Response(JSON.stringify({ error: "Invalid body" }), { status: 400 });
            res.headers.set("Content-Type", "application/json");
            return res;
        }
    }
    else {
        const res = new Response(JSON.stringify({ error: "Invalid body" }), { status: 400 });
        res.headers.set("Content-Type", "application/json");
        return res;
    }

    if (content.id) {
        if (users.has(content.id)) {
            const res = new Response(JSON.stringify({ error: "You're already added to users list." }), { status: 400 });
            res.headers.set("Content-Type", "application/json");
            return res;
        }
        else {
            users.add(content.id);

            const res = new Response(JSON.stringify({ data: "Success." }), { status: 200 });
            res.headers.set("Content-Type", "application/json");
            return res;
        }
    }
    else {
        const res = new Response(JSON.stringify({ error: "Invalid body" }), { status: 400 });
        res.headers.set("Content-Type", "application/json");
        return res;
    }
});

app.listen("GET", "/users/:id", (_req, params) => {
    if (users.has(params["id"])) {
        const res = new Response(JSON.stringify({ data: "There is such user." }));
        res.headers.set("Content-Type", "application/json");
        return res;
    }
    else {
        const res = new Response(JSON.stringify({ key: "Unknown user." }));
        res.headers.set("Content-Type", "application/json");
        return res;
    }
});