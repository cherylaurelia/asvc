import { money } from "./format.js";

// Plain string template. Nothing is sent anywhere.
export function draftDisputeEmail(flag, shipment) {
  return [
    `To: ${flag.vendor} billing`,
    `Subject: Question on invoice ${flag.billId}: ${flag.description} (${money(flag.amountAtRisk)})`,
    "",
    "Hello,",
    "",
    `We are reviewing invoice ${flag.billId} for shipment ${shipment.id} (${shipment.name}) and have a question about one charge before we pay it.`,
    "",
    `Charge: ${flag.description}`,
    `Amount in question: ${money(flag.amountAtRisk)}`,
    `Why we are asking: ${flag.reason}`,
    "",
    "Could you confirm whether this charge is correct and share any supporting documents? If it was billed in error, please send a corrected invoice.",
    "",
    "Thank you,",
    "Accounts Payable",
  ].join("\n");
}
