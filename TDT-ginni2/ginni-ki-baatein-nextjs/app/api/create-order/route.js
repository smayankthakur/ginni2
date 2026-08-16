import Razorpay from "razorpay";
import { NextResponse } from "next/server";

// Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET set as environment
// variables (server-side only — never expose the key secret to the client).
export async function POST() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payments aren't configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount: 199 * 100, // paise
      currency: "INR",
      receipt: `gkb_${Date.now()}`,
      notes: { product: "Ginni Ki Baatein — 30 day unlock" },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Could not create order." }, { status: 500 });
  }
}
