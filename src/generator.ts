import { GenerateOptions, InputRecord } from "./types/generator.types";
import { DNSRecordsByType } from "./types/parser.types";
import { prepareRecord } from "./utils/generator.helper";

/**
 * Generates a BIND-style DNS zone file string from input records.
 *
 * @param {InputRecord[]} records - The input DNS records to be converted.
 * @param {GenerateOptions} [options] - Optional settings for zone file generation.
 * 
 * @returns {string} A BIND-style zone file string.
 * 
 * @example
 * ```ts
 * const fieldMap = {
 *   MX: {
 *     priority: "preference",
 *     exchange: "host",
 *   },
 *   LOC: {
 *     latitude.degrees: "lat_degree",
 *     longitude.degrees: "long_degree",
 *   },
 * };
 *
 * const records = generate(input, { fieldMap });
 * ```
 * 
 */

export const generate = (records: InputRecord[], options?: GenerateOptions): string => {
    const { keepComments = true, keepHeaders = true, origin = "", ttl = 3600 } = options || {};

    const dnsRecords = records.map((record) => prepareRecord(record, options));

    const groupedRecords = dnsRecords.reduce((acc, rec) => {
        if (!acc[rec.type]) acc[rec.type] = [];
        acc[rec.type].push(rec);
        return acc;
    }, {} as DNSRecordsByType);

    return toZoneFile(groupedRecords, origin, ttl, keepComments, keepHeaders);
};

/**
 * Converts structured DNS records into a BIND-style zone file string.
 *
 * @param {DNSRecordsByType} dnsRecords - A map of DNS record types to arrays of records.
 * @param {string} origin - The origin of the DNS zone.
 * @param {number} [ttl=3600] - The default TTL for records without a TTL specified.
 * @param {boolean} [keepComments=false] - Whether to include comments in the zone file.
 * @param {boolean} [keepHeaders=true] - Whether to include headers in the zone file.
 *
 * @returns {string} A BIND-style zone file string.
 */

export const toZoneFile = (dnsRecords: DNSRecordsByType, origin: string, ttl: number, keepComments: boolean = true, keepHeaders: boolean = true): string => {
    const zoneEntries = Object.entries(dnsRecords);
    let zoneFileContent = "";

    // Ensure origin ends with a dot
    if (!origin) {
        origin = zoneEntries[0]?.[1]?.[0]?.name ?? "";
    }
    origin = origin.endsWith(".") ? origin : origin + ".";

    // Default TTL from first record if not provided
    if (!ttl) {
        ttl = zoneEntries[0]?.[1]?.[0]?.ttl ?? 3600;
    }

    // Add headers if requested
    if (keepHeaders) {
        zoneFileContent += `;;\n` +
            `;; Domain:     ${origin}\n` +
            `;; Exported:   ${new Date().toISOString()}\n` +
            `;;\n` +
            `;; Generated using: ZoneX\n` +
            `;; NPM Package: https://github.com/thedeepakcodes/zonex-dns.git\n` +
            `;; \n` +
            `;; ==================================================\n` +
            `;;\n` +
            `;; This file is intended for informational and archival\n` +
            `;; purposes ONLY and MUST be reviewed and edited before use\n` +
            `;; on a production DNS server.\n` +
            `;;\n` +
            `;; For further information, please consult the BIND documentation:\n` +
            `;;   https://www.isc.org/bind/\n` +
            `;;\n` +
            `;; And RFC 1035:\n` +
            `;;   https://www.rfc-editor.org/rfc/rfc1035.txt\n` +
            `;;\n` +
            `;; Disclaimer:\n` +
            `;;   We do NOT provide support for any use of this zone data,\n` +
            `;;   the BIND name server, or any other third-party DNS software.\n` +
            `;;\n` +
            `;; Use at your own risk.\n` +
            `;;\n` +
            `;; ==================================================\n`;
    }

    // Add $ORIGIN and $TTL directives
    if (origin) zoneFileContent += `\n$ORIGIN ${origin}`;
    if (ttl) zoneFileContent += `\n$TTL ${ttl}\n`;

    // Process each record type
    for (const [type, records] of zoneEntries) {
        if (keepComments) {
            zoneFileContent += `\n;; ${type} records\n`;
        } else {
            zoneFileContent += `\n`;
        }

        const recordLines = records.map(
            (record) => `${record.name}\t${record.ttl}\t${record.class}\t${record.type}\t${record.rdata}`
        );
        zoneFileContent += recordLines.join("\n") + "\n";
    }

    return zoneFileContent;
};