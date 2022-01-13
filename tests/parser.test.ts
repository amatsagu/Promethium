import { parse } from "../src/parser.ts";
import { assertArrayIncludes, assertMatch, assertNotMatch } from "https://deno.land/std@0.115.1/testing/asserts.ts";

Deno.test("Parsing static routes", () => {
    const a = parse("/about");
    assertArrayIncludes(a.keys, []);
    assertMatch("/about", a.pattern);
    assertNotMatch("/index.txt", a.pattern);

    const b = parse("/");
    assertArrayIncludes(b.keys, []);
    assertMatch("/", b.pattern);
    assertNotMatch("/index.txt", b.pattern);
});

Deno.test("Parsing dynamic routes", () => {
    const a = parse("/cdn/:image.png");
    assertArrayIncludes(a.keys, ["image"]);
    assertMatch("/cdn/file1.png", a.pattern);
    assertMatch("/cdn/file_2.png", a.pattern);
    assertNotMatch("/cdn/file-3.jpg", a.pattern);

    const b = parse("/api/:serverid?/:playerid?");
    assertArrayIncludes(b.keys, ["serverid", "playerid"]);
    assertMatch("/api", b.pattern);
    assertMatch("/api/853386288710156320", b.pattern);
    assertMatch("/api/853386288710156320/390394829789593601", b.pattern);
    assertNotMatch("/api/853386288710156320/390394829789593601/secret.txt", b.pattern);
    assertNotMatch("/not-api", b.pattern);

    const c = parse("/idea/:author/:idea?");
    assertArrayIncludes(c.keys, ["author", "idea"]);
    assertMatch("/idea/amatsagu/build-bot", c.pattern);
    assertMatch("/idea/lorkas/learn-basic-c", c.pattern);
    assertMatch("/idea/skanerooo", c.pattern);

    // Injecting
    const params = b.pattern.exec("/api/853386288710156320/390394829789593601");
    assertArrayIncludes(params!, ["853386288710156320", "390394829789593601"]);
});