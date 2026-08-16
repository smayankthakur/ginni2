import crypto from "crypto";
import { NextResponse } from "next/server";

// The client sends back what Razorpay's checkout gave it after payment.
// We re-derive the signature server-side with the key secret and compare —
// this is the step that actually proves the payment is real, not spoofed.
export async function POST(req) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 500 });
  }

  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    return NextResponse.json({ error: "Signature mismatch — payment could not be verified." }, { status: 400 });
  }

  return NextResponse.json({ verified: true });
}
