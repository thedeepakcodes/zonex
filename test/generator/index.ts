import fs from "fs";
import zonex from "../../src/index";

async function test(fileName: string) {
    const input = await fs.promises.readFile(`test/generator/${fileName}`, "utf-8");

    const records = JSON.parse(input);

    const output = zonex.generate(records, {
        origin: "example.com.",   // ensures all relative names are resolved relative to this domain
        ttl: 3500,                // default TTL for records
        keepComments: true,       // useful for readability, especially during testing
        keepHeaders: true         // includes metadata like export date and tool info
    });

    console.log(output);
}

test("test.json");
