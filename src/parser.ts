import { DNSRecord, DNSRecordsByType, ParseOptions } from "./types/parser.types";
import { extractRawRecords, sanitize } from "./utils/parser.helper";
import * as parser from "./utils/records.parser";


/**
 * Parse a BIND-style zone file into structured JSON records.
 * @param {string} input - BIND-style zone file contents.
 * @param {ParseOptions} [options] - Optional parsing options.
 *  
 * @returns {DNSRecordsByType | DNSRecord[]} Parsed DNS records in either grouped or flattened format.
 * 
 * @example 
 * 
 * const records = parse(input);
 * 
 */

export const parse = (input: string, options?: ParseOptions): DNSRecordsByType | DNSRecord[] => {
    const records = sanitize(input);

    const { records: dnsRecords } = extractRawRecords(records, options);

    const { flatten } = options || {
        flatten: false,
    };

    const groupedRecords: DNSRecordsByType = {};

    dnsRecords.forEach((dnsRecord) => {
        const type = dnsRecord.type.toUpperCase();

        let parsedRecord: DNSRecord;
        switch (type) {
            case "SOA": parsedRecord = parser.parseSOA(dnsRecord); break;
            case "A": parsedRecord = parser.parseA(dnsRecord); break;
            case "AAAA": parsedRecord = parser.parseAAAA(dnsRecord); break;
            case "CNAME": parsedRecord = parser.parseCNAME(dnsRecord); break;
            case "MX": parsedRecord = parser.parseMX(dnsRecord); break;
            case "NS": parsedRecord = parser.parseNS(dnsRecord); break;
            case "TXT": parsedRecord = parser.parseTXT(dnsRecord); break;
            case "SRV": parsedRecord = parser.parseSRV(dnsRecord); break;
            case "PTR": parsedRecord = parser.parsePTR(dnsRecord); break;
            case "CAA": parsedRecord = parser.parseCAA(dnsRecord); break;
            case "SPF": parsedRecord = parser.parseSPF(dnsRecord); break;
            case "LOC": parsedRecord = parser.parseLOC(dnsRecord); break;
            case "DS": parsedRecord = parser.parseDS(dnsRecord); break;
            case "DNSKEY": parsedRecord = parser.parseDNSKEY(dnsRecord); break;
            case "TLSA": parsedRecord = parser.parseTLSA(dnsRecord); break;
            case "SSHFP": parsedRecord = parser.parseSSHFP(dnsRecord); break;
            case "HTTPS": parsedRecord = parser.parseHTTPS(dnsRecord); break;
            case "IPSECKEY": parsedRecord = parser.parseIPSECKEY(dnsRecord); break;
            case "ALIAS": parsedRecord = parser.parseALIAS(dnsRecord); break;
            case "NAPTR": parsedRecord = parser.parseNAPTR(dnsRecord); break;
            case "CERT": parsedRecord = parser.parseCERT(dnsRecord); break;
            case "SMIMEA": parsedRecord = parser.parseSMIMEA(dnsRecord); break;
            case "SVCB": parsedRecord = parser.parseSVCB(dnsRecord); break;
            case "URI": parsedRecord = parser.parseURI(dnsRecord); break;
            case "DNAME": parsedRecord = parser.parseDNAME(dnsRecord); break;
            case "HINFO": parsedRecord = parser.parseHINFO(dnsRecord); break;
            case "OPENPGPKEY": parsedRecord = parser.parseOPENPGPKEY(dnsRecord); break;
            case "RP": parsedRecord = parser.parseRP(dnsRecord); break;
            default:
                parsedRecord = { ...dnsRecord, type };
        }

        if (!groupedRecords[type]) {
            groupedRecords[type] = [];
        }

        groupedRecords[type].push(parsedRecord);
    });

    return flatten ? Object.values(groupedRecords).flat() : groupedRecords;
};
