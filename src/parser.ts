import { Pattern, ParseResult } from "./types.d.ts";

export function parse(route: Pattern, loose?: boolean): ParseResult {
    if (route instanceof RegExp) return { keys: [], pattern: route };

    const parts = route.split("/");
    const keys: string[] = [];
    let pattern = "";
    let char: string;
    let idx: number;
    let temp: string;
    let ext: number;

    parts[0] || parts.shift();

    while (parts.length !== 0) {
        temp = parts.shift()!;
        char = temp[0];

        if (char === "*") {
            keys.push("wild");
            pattern += "*";
        } else if (char === ":") {
            idx = temp.indexOf("?", 1);
            ext = temp.indexOf(".", 1);
            // deno-lint-ignore no-extra-boolean-cast
            keys.push(temp.substring(1, !!~idx ? idx : !!~ext ? ext : temp.length));
            pattern += !!~idx && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
            // deno-lint-ignore no-extra-boolean-cast
            if (!!~ext) pattern += (!~idx ? "" : "?") + "\\" + temp.substring(ext);
        } else {
            pattern += "/" + temp;
        }
    }

    return {
        keys: keys,
        pattern: new RegExp("^" + pattern + (loose ? "(?=$|/)" : "/?$"), "i")
    };
}
