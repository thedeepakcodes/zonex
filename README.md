# ZoneX

**ZoneX** is a lightweight TypeScript library for **parsing and generating DNS zone files** compliant with RFC standards (e.g., RFC 1035). It allows you to convert BIND-style zone files into structured JSON and generate zone files from JSON, supporting a wide variety of DNS record types including SOA, MX, TXT, HINFO, RP, OPENPGPKEY, and more.

---

## Features

* Parse BIND zone files into structured JSON objects.
* Generate BIND zone files from JSON records.
* Supports **all common and advanced DNS record types**: A, AAAA, MX, CNAME, NS, TXT, HINFO, SOA, RP, OPENPGPKEY, TLSA, SSHFP, SVCB, URI, and more.
* **Customizable field mapping** — adapt the generator to work with your own JSON property names.
* TypeScript ready with full typings.
* RFC-compliant output for production use (after editing SOA/NS records as needed).

---

## Installation

```bash
npm install zonex-dns
# or
yarn add zonex-dns
# or
pnpm add zonex-dns
```

---

## Usage

### Importing

```ts
import zonex from "zonex-dns";

const { parse, generate, toZoneFile } = zonex;
```

---

### Parsing a Zone File

```ts
import fs from "fs";

const zoneData = fs.readFileSync("example.txt", "utf8");
const records = parse(zoneData, { flatten: false });

console.log(records);
```

**Output Example:**

```json
{
  "A": [
    {
      "name": "example.com.",
      "ttl": 600,
      "class": "IN",
      "type": "A",
      "rdata": "192.0.2.1",
      "address": "192.0.2.1"
    }
  ],
  "MX": [
    {
      "name": "example.com.",
      "ttl": 3600,
      "class": "IN",
      "type": "MX",
      "rdata": "10 mail.example.com.",
      "priority": 10,
      "exchange": "mail.example.com."
    }
  ]
}
```

---

### Generating a Zone File

```ts
import { generate } from "zonex-dns";

const inputRecords = [
  { name: "example.com.", type: "A", ttl: 3600, class: "IN", address: "192.0.2.1" },
  { name: "mail.example.com.", type: "MX", ttl: 3600, class: "IN", preference: 10, exchange: "mail.example.com." }
];

// Example: map your own property names to the standard ones
const jsonByType = generate(inputRecords, {
  fieldMap: {
    MX: {
      priority: "preference" // user property "preference" will be mapped to DNS field "priority"
    }
  }
});

/**
 * Or, if your input objects already match the standard record interfaces,
 * you can call generate(inputRecords) without options.
 */
```

**Output Example:**

```txt
$ORIGIN example.com.
$TTL 3500

;; A records
example.com.        3600    IN    A    192.0.2.1

;; MX records
mail.example.com.   3600    IN    MX   mail.example.com.
```

---

## Customizing Field Mapping

By default, ZoneX expects input objects to follow the standard DNS record property names.
With the `fieldMap` option, you can map your own property names to those expected by ZoneX.

### Example: MX record

If your JSON uses `preference` instead of the standard `priority`:

```ts
generate(records, {
  fieldMap: {
    MX: { priority: "preference" }
  }
});
```

This tells ZoneX:

* Look for `preference` in your objects,
* But treat it as the standard `priority` field.

---

### Example: SOA record

If your JSON uses `retryInterval` instead of the standard `retry`:

```ts
generate(records, {
  fieldMap: {
    SOA: { retry: "retryInterval" }
  }
});
```

---

## API Reference

### `parse(input: string, options?: ParseOptions): ParsedRecord[]`

Parses a zone file string into structured JSON.

**Options:**

* `preserveSpacing?: boolean` – keep whitespace formatting in TXT records.
* `keepTrailingDot?: boolean` – retain trailing dot on record names.
* `flatten?: boolean` – flatten records into a single array.

---

### `generate(records: InputRecord[], options?: GenerateOptions): DNSRecordsByType`

Generates structured JSON from input records.

**Options:**

* `fieldMap?: Record<string, Record<string, string>>` – customize property names (see [Customizing Field Mapping](#customizing-field-mapping)).
* `origin?: string` – default domain origin.
* `ttl?: number` – default TTL.

---

## Supported Record Types

A, AAAA, CAA, CNAME, MX, NS, TXT, SRV, PTR, SOA, DS, DNSKEY, TLSA, SSHFP, HTTPS, IPSECKEY, ALIAS, SPF, NAPTR, CERT, LOC, SMIMEA, SVCB, URI, DNAME, HINFO, OPENPGPKEY, RP

---

## Disclaimer

* This library is intended for **development and educational purposes**.
* You must update SOA, NS, and other records before deploying to a production DNS server.
* Use at your own risk.

---

## Authors & Contributors

* **Deepak K.** – [GitHub](https://github.com/thedeepakcodes)
* **Sandeep K.** – [GitHub](https://github.com/thesandeepcodes)

---

## License

ZoneX is licensed under the **MIT License**.

---

## NPM

📦 [https://www.npmjs.com/package/zonex-dns](https://www.npmjs.com/package/zonex-dns)