export interface DNSRecord {
    name: string
    type: string
    ttl: number
    class: string
    rdata: string
}

export interface ARecord extends DNSRecord {
    address: string;
}

export interface AAAARecord extends DNSRecord {
    address: string;
}

export interface CNAMERecord extends DNSRecord {
    target: string;
}

export interface NSRecord extends DNSRecord {
    host: string;
}

export interface TXTRecord extends DNSRecord {
    text: string;
}

export interface MXRecord extends DNSRecord {
    priority: number;
    exchange: string;
}

export interface PTRRecord extends DNSRecord {
    ptrdname: string;
}

export interface SOARecord extends DNSRecord {
    mname: string;
    rname: string;
    serial: number;
    refresh: number;
    retry: number;
    expire: number;
    minimum: number;
}

export interface SRVRecord extends DNSRecord {
    priority: number;
    weight: number;
    port: number;
    target: string;
}

export interface CAARecord extends DNSRecord {
    flag: number;
    tag: string;
    value: string;
}

export interface SPFRecord extends DNSRecord {
    text: string;
}

export interface DMS {
    degrees: number;
    minutes: number;
    seconds: number;
    hemisphere: string;
}

export interface LOCRecord extends DNSRecord {
    latitude: DMS;
    longitude: DMS;
    altitude: number;
    size: number;
    horizPrecision: number;
    vertPrecision: number;
}

export interface DSRecord extends DNSRecord {
    keyTag: number;
    algorithm: number;
    digestType: number;
    digest: string;
}

export interface DNSKEYRecord extends DNSRecord {
    flags: number;
    protocol: number;
    algorithm: number;
    publicKey: string;
}

export interface TLSARecord extends DNSRecord {
    usage: number;
    selector: number;
    matchingType: number;
    certificateAssociationData: string;
}

export interface SSHFPRecord extends DNSRecord {
    algorithm: number;
    fingerprintType: number;
    fingerprint: string;
}

export interface HTTPSRecord extends DNSRecord {
    priority: number;
    target: string;
    params: string;
}

export interface IPSECKEYRecord extends DNSRecord {
    precedence: number;
    gatewayType: number;
    algorithm: number;
    gateway: string;
    publicKey: string;
}

export interface ALIASRecord extends DNSRecord {
    target: string;
}

export interface NAPTRRecord extends DNSRecord {
    order: number;
    preference: number;
    flags: string;
    service: string;
    regexp: string;
    replacement: string;
}

export interface CERTRecord extends DNSRecord {
    certType: number;
    keyTag: number;
    algorithm: number;
    certificate: string;
}

export interface SMIMEARecord extends DNSRecord {
    usage: number;
    selector: number;
    matchingType: number;
    certAssociationData: string;
}

export interface SVCBRecord extends DNSRecord {
    priority: number;
    target: string;
    params: string;
}

export interface URIRecord extends DNSRecord {
    priority: number;
    weight: number;
    target: string;
}

export interface DNAMERecord extends DNSRecord {
    target: string;
}

export interface HINFORecord extends DNSRecord {
    cpu: string;
    os: string;
}

export interface OPENPGPKEYRecord extends DNSRecord {
    publicKey: string;
}

export interface RPRecord extends DNSRecord {
    mailbox: string;
    txtDomain: string;
}


export type ParsedRecord =
    | ARecord
    | AAAARecord
    | CNAMERecord
    | NSRecord
    | TXTRecord
    | MXRecord
    | PTRRecord
    | SOARecord
    | SRVRecord
    | CAARecord
    | SPFRecord
    | LOCRecord
    | DSRecord
    | DNSKEYRecord
    | TLSARecord
    | SSHFPRecord
    | HTTPSRecord
    | IPSECKEYRecord
    | ALIASRecord
    | NAPTRRecord
    | CERTRecord
    | SMIMEARecord
    | SVCBRecord
    | URIRecord
    | DNAMERecord
    | HINFORecord
    | OPENPGPKEYRecord
    | RPRecord


export interface ParseOptions {
    preserveSpacing?: boolean;
    keepTrailingDot?: boolean;
    flatten?: boolean;
}

export type DNSRecordsByType = {
    [key: string]: DNSRecord[];
};
