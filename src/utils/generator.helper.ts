import { GenerateOptions, InputRecord } from "../types/generator.types";
import { DNSRecord, RecordType } from "../types/parser.types";
import { DEFAULT_TTL, normalizeTtl } from "./parser.helper";

export const CanonicalFieldOrder: Record<string, string[]> = {
    A: ["address"],
    AAAA: ["address"],

    CNAME: ["target"],
    DNAME: ["target"],
    NS: ["host"],
    PTR: ["ptrdname"],
    ALIAS: ["target"],

    MX: ["priority", "exchange"],

    TXT: ["text"],
    SPF: ["text"],

    HINFO: ["cpu", "os"],
    SOA: ["mname", "rname", "serial", "refresh", "retry", "expire", "minimum"],

    SRV: ["priority", "weight", "port", "target"],
    NAPTR: ["order", "preference", "flags", "service", "regexp", "replacement"],

    CAA: ["flag", "tag", "value"],

    LOC: ["latitude.degrees", "latitude.minutes", "latitude.seconds", "latitude.hemisphere", "longitude.degrees", "longitude.minutes", "longitude.seconds", "longitude.hemisphere", "altitude", "size", "horizPrecision", "vertPrecision"],

    DS: ["keyTag", "algorithm", "digestType", "digest"],
    DNSKEY: ["flags", "protocol", "algorithm", "publicKey"],

    TLSA: ["usage", "selector", "matchingType", "certificateAssociationData"],
    SMIMEA: ["usage", "selector", "matchingType", "certAssociationData"],

    SSHFP: ["algorithm", "fingerprintType", "fingerprint"],

    CERT: ["certType", "keyTag", "algorithm", "certificate"],

    OPENPGPKEY: ["publicKey"],
    RP: ["mailbox", "txtDomain"],

    HTTPS: ["priority", "target", "params"],
    SVCB: ["priority", "target", "params"],

    URI: ["priority", "weight", "target"],

    IPSECKEY: ["precedence", "gatewayType", "algorithm", "gateway", "publicKey"],
};

export const prepareRecord = (record: InputRecord, options?: GenerateOptions): DNSRecord => {
    const { fieldMap } = options ?? {};

    return {
        name: record.name,
        ttl: normalizeTtl(record.ttl ?? options?.ttl),
        class: record.class ?? "IN",
        type: record.type as RecordType,
        rdata: buildRdata(record, fieldMap?.[record.type]),
    };
};

export const buildRdata = (record: InputRecord, fieldMap?: Record<string, string>): string => {
    const keyOrder = CanonicalFieldOrder[record.type];

    if (!keyOrder) return "";

    const values = keyOrder.map((canonicalKey) => {
        const inputKey = fieldMap?.[canonicalKey] ?? canonicalKey;

        if (!inputKey.includes(".")) return (record as any)[inputKey];

        const keyParts = inputKey.split(".").map((p) => p.trim()).filter(Boolean) as string[];

        let keyValue = "";
        let keyData: any = record;

        for (const key of keyParts) {
            keyData = keyData?.[key] ?? "";
        }

        keyValue += keyData + " ";

        return keyValue.trim();
    });

    return formatRdataValues(record.type, values);
};

export const formatRdataValues = (type: string, values: (string | number | undefined)[]): string => {
    const formatters: Record<string, (v: (string | number | undefined)[]) => string> = {
        TXT: (v) => v.filter(Boolean).map((t) => `"${t}"`).join(" "),
        HINFO: (v) => v.filter(Boolean).map((t) => `"${t}"`).join(" "),
        NAPTR: (v) => [v[0], v[1], `"${v[2]}"`, `"${v[3]}"`, `"${v[4]}"`, v[5]].join(" "),
        CAA: (v) => [v[0], v[1], `"${v[2]}"`].join(" ")
    };

    return (formatters[type] ?? ((v) => v.filter(Boolean).join(" ")))(values);
};