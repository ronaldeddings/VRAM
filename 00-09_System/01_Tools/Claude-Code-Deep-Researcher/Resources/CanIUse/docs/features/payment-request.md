# Payment Request API

## Overview

The **Payment Request API** is a web standard that provides a streamlined interface for requesting payment information from users during checkout flows. It makes the payment process faster, easier, and more consistent across e-commerce websites by leveraging native payment methods available in web browsers.

## Description

Payment Request is a new API for the open web that makes checkout flows easier, faster and consistent on shopping sites. Instead of redirecting users to external payment gateways or requiring them to manually fill in payment details, the Payment Request API allows websites to request payment information directly through the browser, providing a unified and secure checkout experience.

## Specification Status

**Status:** Recommendation (REC)

**Specification:** [W3C Payment Request API](https://www.w3.org/TR/payment-request/)

## Categories

- **JS API** - JavaScript API for payment processing

## Benefits & Use Cases

### Benefits

- **Faster Checkout** - Streamlined payment flow reduces checkout time
- **Consistent Experience** - Unified payment interface across all supporting browsers
- **Better Security** - Browser handles sensitive payment data securely
- **Mobile Friendly** - Optimized for mobile and desktop experiences
- **Reduced Friction** - Auto-filled payment information improves conversion rates
- **Native Integration** - Leverages built-in browser payment methods

### Use Cases

- E-commerce checkout flows
- Subscription payment processing
- In-app purchases
- Digital goods transactions
- Travel and hospitality bookings
- Food delivery and services
- Any web application requiring payment processing

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| ✓ **y** | Full support |
| ◐ **a** | Partial/Alternative support |
| ✗ **n** | No support |
| **d** | Disabled by default |

### Desktop Browsers

| Browser | Minimum Version | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Chrome** | 78 | Full Support | Fully supported from v78+ |
| **Edge** | 79 | Full Support | Full support from v79 onwards |
| **Firefox** | 66+ | Partial Support (a) | Has `retry()` method limitation (#8). Disabled by default; requires flag in about:config. Supported regions: US, CA |
| **Safari** | 12.1 | Full Support | Full support from v12.1+; partial in 11.1-12 |
| **Opera** | 66 | Full Support | Full support from v66 onwards |
| **Internet Explorer** | - | Not Supported | No support across any IE version |

### Mobile Browsers

| Browser | Minimum Version | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Chrome for Android** | 53+ | Full Support | Support earlier than Desktop Chrome (#5) |
| **Firefox for Android** | 66+ | Partial Support (a) | Same limitations as Desktop Firefox (#8) |
| **Safari (iOS)** | 12.2+ | Full Support | Full support from 12.2+; partial in 11.3-12 |
| **Opera Mobile** | 80 | Full Support | Full support from v80 |
| **Samsung Internet** | 12.0 | Full Support | Full support from v12.0+ |
| **Opera Mini** | - | Not Supported | No support |
| **Android Browser** | - | Not Supported | No support in any version |
| **UC Browser** | - | Not Supported | No support |
| **QQ Browser** | - | Partial Support (a) | Limited to v14.9 with limitations (#7) |
| **Baidu** | - | Not Supported | No support |
| **KaiOS** | - | Not Supported | No support in any version |

### Support Summary

- **Global Support:** ~89.36% of users
- **Partial Support:** ~2.03% of users
- **Overall Coverage:** >91% of web traffic

## Implementation Notes

### Browser-Specific Notes

**#1 - Chrome (versions 53-60)**
Can be enabled via the "Experimental Web Platform features" flag

**#2 - Edge 14**
Can be enabled via the "Experimental Web Payments API" flag

**#3 - Safari (versions 10-11)**
Apple's proprietary implementation. Apple provides an equivalent proprietary API called [Apple Pay JS](https://developer.apple.com/reference/applepayjs/)

**#4 - Chrome (versions 59-60)**
Can be enabled via the "[Web Payments API](chrome://flags/#web-payments)" flag

**#5 - Chrome for Android 142**
Unlike Desktop Chrome, support has been in Chrome for Android since version 53

**#6 - Firefox (versions 55-65)**
Can be enabled via the `dom.payments.request.enabled` flag in "about:config"

**#7 - Multiple Browsers (Chrome 61+, Edge 15+, Opera 48+, Samsung 5.0+, QQ 14.9)**
Missing support for `PaymentResponse.prototype.retry()` method

**#8 - Firefox (66+)**
Disabled by default in Nightly. To enable:
1. Navigate to "about:config"
2. Set `dom.payments.request.enabled` to true
3. Set `dom.payments.request.supportedRegions` to "US,CA"

### Alternative APIs

Apple provides an equivalent proprietary API called **[Apple Pay JS](https://developer.apple.com/reference/applepayjs/)**. Google provides a [PaymentRequest wrapper for Apple Pay JS](https://github.com/GoogleChrome/appr-wrapper) to help bridge the gap between the standard and Apple's implementation.

## Resources & Documentation

- **[W3C Specification](https://www.w3.org/TR/payment-request/)** - Official specification
- **[GitHub Discussion](https://github.com/w3c/browser-payment-api/)** - Spec discussion and issue tracking
- **[Google: Payment Request API Integration Guide](https://developers.google.com/web/fundamentals/discovery-and-monetization/payment-request/)** - Comprehensive integration guide
- **[Google: Bringing Easy and Fast Checkout](https://developers.google.com/web/updates/2016/07/payment-request)** - Product announcement and updates
- **[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API)** - Complete API documentation
- **[Interactive Demo](https://paymentrequest.show/demo)** - Live demonstration
- **[Chrome Samples](https://googlechrome.github.io/samples/paymentrequest/)** - Code examples and demos

## Recommendation

For production use, the Payment Request API is recommended for modern web applications with strong browser support. However, consider:

1. **Fallback Strategy** - Implement fallback payment methods for unsupported browsers (approximately 8-9% of traffic)
2. **Feature Detection** - Always check for API availability before use
3. **Apple Pay** - Use Apple Pay JS directly for iOS Safari or leverage Google's wrapper
4. **Firefox** - Be aware of limitations with the `retry()` method in Firefox versions with partial support
5. **Testing** - Thoroughly test across target browsers and devices, especially mobile platforms

## Code Example

```javascript
// Feature detection
if (window.PaymentRequest) {
  const supportedMethods = ['https://apple.com/apple-pay'];
  const paymentDetails = {
    total: {
      label: 'Total',
      amount: { currency: 'USD', value: '99.99' }
    }
  };
  const options = { requestPayerName: true };

  const paymentRequest = new PaymentRequest(
    supportedMethods,
    paymentDetails,
    options
  );

  paymentRequest.show()
    .then(paymentResponse => {
      // Process payment
      console.log(paymentResponse);
    })
    .catch(error => {
      console.error('Payment failed:', error);
    });
} else {
  // Fallback to traditional checkout
  console.log('Payment Request API not supported');
}
```

---

*Last updated: December 2025*
*Data source: CanIUse Payment Request API support data*
