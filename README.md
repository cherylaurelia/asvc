# Landed

Landed groups every bill for one import shipment, shows the true landed cost per unit, and flags charges that do not match the original quote. It is a hackathon prototype running entirely on hardcoded sample data.

## Run it

```
npm install
npm run dev
```

Tests:

```
npm test
```

Production build and preview:

```
npm run build
npm run preview
```

Deploys on Vercel with default Vite settings (build command `npm run build`, output directory `dist`), no extra config.

## Demo path

1. Open the page. Supplier price is $11.00 per chair for 1,000 chairs.
2. The bill timeline shows five bills from the supplier, forwarder, broker, customs and terminal.
3. Actual landed cost is $14.20 per chair against an expected $13.56 from the quote (+$0.64).
4. Two charges are flagged for review, $640 at risk: a fuel surcharge billed twice ($420) and demurrage that was not in the quote ($220).
5. Click **Dispute** on the fuel surcharge. Money at risk stays at $640 and "If disputes succeed: $13.78/unit" appears.
6. Click **Simulate new bill**. A late storage bill arrives: actual cost moves to $14.38, a third flag appears ($180), and $820 is at risk.
7. Click **Reset demo** to return to the starting state.

Also available: click a bill to highlight its flags, **Approve** a flag to take it out of money at risk, and **Draft dispute email** to see a pre-written message to the vendor.

## Limitations

- All data is hardcoded in `src/data/shipment.json`. There is one shipment, in USD only.
- No real bill or invoice extraction, and no matching of bills to shipments. The bills are already structured in the sample data.
- The dispute email is a filled-in text template shown on screen. Nothing is sent.
- No Ramp API or any other integration, no backend, no login.
- Flags mean "flagged for review". They are simple rule checks against the quote, not proof that a charge is wrong.
- Built for desktop widths (checked at 1440x900 and 1920x1080).
