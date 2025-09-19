import { DNSRecord, ParsedRecord } from "../types/parser.types";

export const parseSOA = (dnsRecord: DNSRecord): ParsedRecord => {
    const [mname, rname, serial, refresh, retry, expire, minimum] =
        dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        mname,
        rname,
        serial: Number(serial) || 0,
        refresh: Number(refresh) || 0,
        retry: Number(retry) || 0,
        expire: Number(expire) || 0,
        minimum: Number(minimum) || 0,
    };
};

export const parseNS = (dnsRecord: DNSRecord): ParsedRecord => ({
    ...dnsRecord,
    host: dnsRecord.rdata.trim(),
});

export const parseA = (dnsRecord: DNSRecord): ParsedRecord => ({
    ...dnsRecord,
    address: dnsRecord.rdata.trim(),
});

export const parseAAAA = (dnsRecord: DNSRecord): ParsedRecord => ({
    ...dnsRecord,
    address: dnsRecord.rdata.trim(),
});

export const parseCNAME = (dnsRecord: DNSRecord): ParsedRecord => ({
    ...dnsRecord,
    target: dnsRecord.rdata.trim(),
});

export const parseTXT = (dnsRecord: DNSRecord): ParsedRecord => ({
    ...dnsRecord,
    text: dnsRecord.rdata.trim(),
});

export const parseMX = (dnsRecord: DNSRecord): ParsedRecord => {
    const [priority, exchange] = dnsRecord.rdata.trim().split(/\s+/);

    return { ...dnsRecord, priority: Number(priority), exchange };
};

export const parsePTR = (dnsRecord: DNSRecord): ParsedRecord => ({
    ...dnsRecord,
    ptrdname: dnsRecord.rdata.trim(),
});

export const parseSRV = (dnsRecord: DNSRecord): ParsedRecord => {
    const [priority, weight, port, target] = dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        priority: Number(priority) || 0,
        weight: Number(weight) || 0,
        port: Number(port) || 0,
        target,
    };
};

export const parseCAA = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    const flag = parts[0] ? Number(parts[0]) : 0;
    const tag = parts[1] || "";
    const value = parts.slice(2).join(" ").replace(/^"|"$/g, "");

    return {
        ...dnsRecord,
        flag,
        tag,
        value,
    };
};

export const parseSPF = (dnsRecord: DNSRecord): ParsedRecord => {
    const text = dnsRecord.rdata.trim().replace(/^"|"$/g, "");

    return {
        ...dnsRecord,
        text,
    };
};

export const parseLOC = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    const parseNum = (val?: string) => (val ? Number(val) || 0 : 0);

    let i = 0;

    /* :::: Latitude :::: */
    const latDeg = parseNum(parts[i++]);
    let latMin = 0, latSec = 0;
    let latHem = "N";
    if (i < parts.length && !/^[NS]$/i.test(parts[i])) latMin = parseNum(parts[i++]);
    if (i < parts.length && !/^[NS]$/i.test(parts[i])) latSec = parseNum(parts[i++]);
    if (i < parts.length && /^[NS]$/i.test(parts[i])) latHem = parts[i++].toUpperCase();

    /* :::: Longitude :::: */
    const lonDeg = parseNum(parts[i++]);
    let lonMin = 0, lonSec = 0;
    let lonHem = "E";
    if (i < parts.length && !/^[EW]$/i.test(parts[i])) lonMin = parseNum(parts[i++]);
    if (i < parts.length && !/^[EW]$/i.test(parts[i])) lonSec = parseNum(parts[i++]);
    if (i < parts.length && /^[EW]$/i.test(parts[i])) lonHem = parts[i++].toUpperCase();

    /* :::: Optional altitude and precision :::: */
    const altitude = i < parts.length ? parseNum(parts[i++].replace(/[mM]/, "")) : 0;
    const size = i < parts.length ? parseNum(parts[i++].replace(/[mM]/, "")) : 1;
    const horizPrecision = i < parts.length ? parseNum(parts[i++].replace(/[mM]/, "")) : 10000;
    const vertPrecision = i < parts.length ? parseNum(parts[i++].replace(/[mM]/, "")) : 10;

    return {
        ...dnsRecord,
        latitude: { degrees: latDeg, minutes: latMin, seconds: latSec, hemisphere: latHem },
        longitude: { degrees: lonDeg, minutes: lonMin, seconds: lonSec, hemisphere: lonHem },
        altitude,
        size,
        horizPrecision,
        vertPrecision,
    };
};

export const parseDS = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        keyTag: parts[0] ? Number(parts[0]) || 0 : 0,
        algorithm: parts[1] ? Number(parts[1]) || 0 : 0,
        digestType: parts[2] ? Number(parts[2]) || 0 : 0,
        digest: parts[3] || "",
    };
};

export const parseDNSKEY = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        flags: parts[0] ? Number(parts[0]) || 0 : 0,
        protocol: parts[1] ? Number(parts[1]) || 0 : 0,
        algorithm: parts[2] ? Number(parts[2]) || 0 : 0,
        publicKey: parts.slice(3).join(" ") || "",
    };
};

export const parseTLSA = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        usage: parts[0] ? Number(parts[0]) || 0 : 0,
        selector: parts[1] ? Number(parts[1]) || 0 : 0,
        matchingType: parts[2] ? Number(parts[2]) || 0 : 0,
        certificateAssociationData: parts.slice(3).join(" ") || "",
    };
};

export const parseSSHFP = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        algorithm: parts[0] ? Number(parts[0]) || 0 : 0,
        fingerprintType: parts[1] ? Number(parts[1]) || 0 : 0,
        fingerprint: parts.slice(2).join("") || "",
    };
};

export const parseHTTPS = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    // Extract priority
    const priority = parts[0] ? Number(parts[0]) || 0 : 0;

    // Extract target name
    const target = parts[1] || "";

    // Everything else is params as a raw string
    const params = parts.slice(2).join(" ");

    return {
        ...dnsRecord,
        priority,
        target,
        params,
    };
};

export const parseIPSECKEY = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        precedence: parts[0] ? Number(parts[0]) || 0 : 0,
        gatewayType: parts[1] ? Number(parts[1]) || 0 : 0,
        algorithm: parts[2] ? Number(parts[2]) || 0 : 0,
        gateway: parts[3] || "",
        publicKey: parts.slice(4).join(" ") || "",
    };
};


export const parseALIAS = (dnsRecord: DNSRecord): ParsedRecord => {
    const target = dnsRecord.rdata.trim() || "";

    return {
        ...dnsRecord,
        target,
    };
};


export const parseNAPTR = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    return {
        ...dnsRecord,
        order: parts[0] ? Number(parts[0]) || 0 : 0,
        preference: parts[1] ? Number(parts[1]) || 0 : 0,
        flags: parts[2] ? parts[2].replace(/"/g, "") : "",
        service: parts[3] ? parts[3].replace(/"/g, "") : "",
        regexp: parts[4] ? parts[4].replace(/"/g, "") : ".",
        replacement: parts[5] ? parts[5].replace(/"/g, "") : ".",
    };
};

export const parseCERT = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        certType: parts[0] ? Number(parts[0]) || 0 : 0,
        keyTag: parts[1] ? Number(parts[1]) || 0 : 0,
        algorithm: parts[2] ? Number(parts[2]) || 0 : 0,
        certificate: parts.slice(3).join(" ") || "",
    };
};

export const parseSMIMEA = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    return {
        ...dnsRecord,
        usage: parts[0] ? Number(parts[0]) || 0 : 0,
        selector: parts[1] ? Number(parts[1]) || 0 : 0,
        matchingType: parts[2] ? Number(parts[2]) || 0 : 0,
        certAssociationData: parts[3] || "",
    };
};

export const parseSVCB = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().split(/\s+/);

    const priority = parts[0] ? Number(parts[0]) || 0 : 0;
    const target = parts[1] || "";
    const params = parts.slice(2).join(" ") || "";

    return {
        ...dnsRecord,
        priority,
        target,
        params,
    };
};

export const parseURI = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    return {
        ...dnsRecord,
        priority: parts[0] ? Number(parts[0]) || 0 : 0,
        weight: parts[1] ? Number(parts[1]) || 0 : 0,
        target: parts[2] ? parts[2].replace(/^"|"$/g, "") : "",
    };
};

export const parseDNAME = (dnsRecord: DNSRecord): ParsedRecord => {
    const target = dnsRecord.rdata.trim().replace(/^"|"$/g, "");
    return {
        ...dnsRecord,
        target,
    };
};

export const parseHINFO = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const cpu = parts[0] ? parts[0].replace(/^"|"$/g, "") : "";
    const os = parts[1] ? parts[1].replace(/^"|"$/g, "") : "";

    return {
        ...dnsRecord,
        cpu,
        os,
    };
};

export const parseOPENPGPKEY = (dnsRecord: DNSRecord): ParsedRecord => {
    const publicKey = dnsRecord.rdata.trim().replace(/^"|"$/g, "");

    return {
        ...dnsRecord,
        publicKey,
    };
};

export const parseRP = (dnsRecord: DNSRecord): ParsedRecord => {
    const parts = dnsRecord.rdata.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const mailbox = parts[0] ? parts[0].replace(/^"|"$/g, "") : "";
    const txtDomain = parts[1] ? parts[1].replace(/^"|"$/g, "") : "";

    return {
        ...dnsRecord,
        mailbox,
        txtDomain,
    };
};