# Use Renewal Confirmation PDF as a Payment Receipt

## Goal
When you send a renewal **confirmation** (thank-you) email, the attached PDF becomes a proper **Payment Receipt** instead of an invoice-style document. The reminder email's PDF stays unchanged.

## Changes (all in `src/pages/admin/Renewals.tsx`, plus one small touch in `DocumentTemplate.tsx` if needed)

1. **Receipt label for confirmations**
   - The confirmation PDF currently renders with the invoice template titled via `document_type: "invoice"` (shows "INVOICE").
   - In thank-you mode, pass `labelOverride: "PAYMENT RECEIPT"` so the document clearly reads as a receipt, in all three templates (Classic / Modern / Minimal).

2. **Receipt numbering & dates**
   - Number stays `REN-YYYYMMDD` style but prefixed as a receipt: `RCPT-YYYYMMDD` (unique per day; can add renewal id suffix if needed).
   - Show issue date (today = payment date); remove the "Due" date in receipt mode — instead show "Paid on" / "Valid until next renewal".

3. **Receipt wording**
   - Replace the notes with: "Payment received — thank you. The services listed above have been renewed and are valid until the dates shown."
   - Table line items already include service label, vendor, type, and next renewal date — keep as-is.

4. **Total section**
   - In receipt mode, label the final row "Total paid" (via notes wording; totals already show the summed amount).

5. **Reminder mode untouched** — reminder emails keep the current invoice-style summary PDF.

## Result
- Confirmation email → attached PDF titled **PAYMENT RECEIPT** with paid/renewed wording — send it to customers as their proof of payment.
- Reminder email → unchanged renewal summary.

## Technical details
- `DocumentTemplate` already supports `labelOverride` — just pass it when `emailMode === "thankyou"`.
- Adjust the `pdfDoc` object in `Renewals.tsx`: receipt number, `due_date: null`, receipt-specific `notes`.
- No database changes, no edge function changes.
- After approval you'll want a fresh dist zip for cPanel, since this runs in the browser.
