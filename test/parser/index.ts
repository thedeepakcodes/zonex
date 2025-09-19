import fs from "fs";
import zonex from "../../src/index";

async function runTests() {
    const tests = JSON.parse(await fs.promises.readFile("./test/parser/tests.json", "utf-8"));

    let passed = 0;

    for (const test of tests) {
        console.log(`\nRunning: ${test.name}`);

        try {
            const output = zonex.parse(test.input, {
                flatten: true
            });

            const expected = JSON.stringify(test.expected, null, 2);
            const actual = JSON.stringify(output, null, 2);

            if (expected === actual) {
                console.log("✅ Passed");
                passed++;
            } else {
                console.error("❌ Failed");
                console.error("Expected:", expected);
                console.error("Got:", actual);
            }
        } catch (err) {
            console.error("❌ Error during parsing:", err);
        }
    }

    console.log(`\nSummary: ${passed}/${tests.length} tests passed`);
}

async function testZoneFile(fileName: string) {
    const input = await fs.promises.readFile(`test/parser/${fileName}`, "utf-8");
    const output = zonex.parse(input, {
        flatten: false, // disable flattening
        preserveSpacing: true, // preserve spacing in TXT records
        keepTrailingDot: true // keep trailing dot in RR Names
    });

    console.log(output);
}

// testZoneFile("test1.txt");
runTests();