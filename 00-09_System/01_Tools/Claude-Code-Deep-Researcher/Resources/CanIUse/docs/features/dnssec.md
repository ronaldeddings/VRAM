# DNSSEC and DANE Support

## Overview

**DNSSEC** (Domain Name System Security Extensions) is a security protocol that validates DNS responses against a trusted root server. It helps mitigate various DNS spoofing attacks that could redirect users to fraudulent sites while displaying the legitimate URL in their browser.

**DANE** (DNS-based Authentication of Named Entities) extends DNSSEC functionality to provide additional security mechanisms for authenticating services.

## Feature Description

DNSSEC provides a method of cryptographically validating DNS responses to ensure they haven't been tampered with or intercepted during transmission. This security mechanism protects against DNS spoofing and cache poisoning attacks that could silently redirect users to malicious websites.

The protocol works by having authoritative DNS servers digitally sign their DNS records with a private key, allowing clients to verify these signatures using the corresponding public key. This creates a chain of trust from the root DNS servers down to individual domain records.

## Specification

**Official Specification:** [RFC 4033](https://tools.ietf.org/html/rfc4033)

**Status:** Other (infrastructure-level protocol)

## Category

- **Security**

## Benefits and Use Cases

### Primary Benefits

- **DNS Spoofing Prevention**: Protects against man-in-the-middle attacks on DNS queries
- **Cache Poisoning Defense**: Prevents attackers from poisoning DNS resolver caches
- **Transparent Security**: Security validation occurs at the DNS network level, protecting all applications
- **Trust Chain Establishment**: Creates verifiable chain of trust for DNS records
- **Wide Applicability**: Benefits all applications and services that rely on DNS, not just web browsers

### Use Cases

- **Enterprise Security**: Protecting critical infrastructure and internal services from DNS-based attacks
- **Domain Validation**: Ensuring certificate delivery and authentication mechanisms are secure
- **Email Security**: Supporting DANE-based certificate authentication for SMTP/TLS
- **API Security**: Protecting API endpoints from DNS redirection attacks
- **Service Authentication**: DANE certificates provide additional validation layer for services

## Current Browser Support

### Support Status Summary

- **Supported (actively)**: 0% - No browsers currently implement browser-level DNSSEC validation
- **Partial Support (architectural benefit)**: 93.72% - All major browsers benefit from DNSSEC at the DNS infrastructure level
- **No Support**: 6.28% - Older or niche browsers

### Desktop Browsers

| Browser | Versions | Support Level |
|---------|----------|---------------|
| **Chrome** | 4.0 - 146.0 | Network-level benefit only |
| **Firefox** | 2.0 - 148.0 | Network-level benefit only |
| **Safari** | 3.1 - 18.5+ | Network-level benefit only |
| **Opera** | 9.0 - 122.0 | Network-level benefit only |
| **Edge** | 12.0 - 143.0 | Network-level benefit only |
| **Internet Explorer** | 5.5 - 11.0 | Network-level benefit only |

### Mobile Browsers

| Browser | Versions | Support Level |
|---------|----------|---------------|
| **iOS Safari** | 3.2 - 18.5+ | Network-level benefit only |
| **Android Browser** | 2.1 - 14.2 | Network-level benefit only |
| **Chrome Mobile** | 142.0 | Network-level benefit only |
| **Firefox Mobile** | 144.0 | Network-level benefit only |
| **Samsung Internet** | 4.0 - 29.0 | Network-level benefit only |
| **Opera Mobile** | 10.0 - 80.0 | Network-level benefit only |
| **Opera Mini** | All versions | Network-level benefit only |
| **UC Browser** | 15.5 | Network-level benefit only |
| **QQ Browser** | 14.9 | Network-level benefit only |
| **Baidu Browser** | 13.52 | Network-level benefit only |
| **KaiOS** | 2.5 - 3.1 | Network-level benefit only |
| **Blackberry** | 7.0, 10.0 | Network-level benefit only |
| **IE Mobile** | 10.0 - 11.0 | Network-level benefit only |

## Implementation Notes

### Why Browsers Don't Implement DNSSEC

Browsers have generally decided **not to implement browser-level DNSSEC validation** because:

1. **Complexity vs. Benefit Trade-off**: The added implementation complexity outweighs the direct browser-level improvements
2. **Network-Level Implementation**: The majority of DNSSEC security improvements are realized at the DNS network infrastructure level, not in the browser
3. **DNS Resolver Trust**: Modern browsers rely on the operating system's DNS resolver, which can benefit from DNSSEC validation transparently
4. **Validation Location**: DNSSEC primarily protects DNS communication between DNS servers and between servers and the resolver, not from the resolver to the browser

### How Browsers Currently Benefit from DNSSEC

Despite not implementing browser-level validation, all browsers benefit from DNSSEC through:

- **Operating System Integration**: DNS resolvers at the OS level can validate DNSSEC signatures
- **ISP/Network Resolvers**: Internet Service Providers may use DNSSEC-validating resolvers
- **Public DNS Services**: Services like Google Public DNS, Cloudflare DNS, and others support DNSSEC validation
- **Transparent Security**: Any DNS spoofing prevention happens transparently without browser involvement

### Historical Context

Early versions of Chrome (6.0-30.0) **experimented with browser-level DNSSEC validation**, as documented in [this article](https://www.imperialviolet.org/2011/06/16/dnssecchrome.html). However, this implementation was ultimately removed in favor of letting the system-level DNS resolver handle validation.

### Modern Alternative: Certificate Transparency

[Certificate Transparency](https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency) is now the widely adopted alternative that provides similar security goals to DNSSEC but through very different means:

- **TLS Certificate Logging**: Certificates are logged in public CT logs
- **Browser Validation**: Browsers validate certificate inclusion in CT logs
- **Domain Verification**: Provides similar assurance that a domain owner controls certificates
- **Simpler Implementation**: Easier for browsers to implement compared to DNSSEC

## Related Keywords

DNSSEC, Domain Name System Security Extensions, DANE, DNS-based Authentication of Named Entities, TLSA, DNS security

## Relevant Links

- [Wikipedia - DNSSEC](https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions)
- [Chrome Implementation Bug/Discussion](https://bugs.chromium.org/p/chromium/issues/detail?id=50874)
- [Firefox Implementation Bug/Discussion](https://bugzilla.mozilla.org/show_bug.cgi?id=672600)
- [RFC 4033 - DNSSEC Protocol Specification](https://tools.ietf.org/html/rfc4033)
- [Certificate Transparency - Mozilla MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency)
- [Imperial Violet - DNSSEC in Chrome (Historical)](https://www.imperialviolet.org/2011/06/16/dnssecchrome.html)

## Summary

DNSSEC is a critical security infrastructure that protects DNS systems from tampering and spoofing attacks. While browsers do not implement browser-level DNSSEC validation, they benefit significantly from DNSSEC validation that occurs at the DNS infrastructure level (between DNS servers and recursive resolvers). Modern web security has largely shifted to Certificate Transparency as the primary mechanism for domain validation and verification, while DNSSEC continues to serve as a foundational DNS security layer.
