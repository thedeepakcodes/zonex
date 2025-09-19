# ZoneX

**ZoneX** is a lightweight TypeScript library for **parsing and generating DNS zone files** compliant with RFC standards (e.g., RFC 1035). It allows you to convert BIND-style zone files into structured JSON and generate zone files from JSON, supporting a wide variety of DNS record types, including SOA, MX, TXT, HINFO, RP, OPENPGPKEY, and more.

---

## Features

- Parse BIND zone files into structured JSON objects.
- Generate BIND zone files from JSON records.
- Supports **all common and advanced DNS record types**: A, AAAA, MX, CNAME, NS, TXT, HINFO, SOA, RP, OPENPGPKEY, TLSA, SSHFP, SVCB, URI, and more.
- Customizable field mapping to adapt to different JSON structures.
- TypeScript ready with full typings.
- RFC-compliant output for production use (after editing SOA/NS records as needed).