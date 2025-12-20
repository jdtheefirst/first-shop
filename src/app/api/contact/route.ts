// app/api/contact/route.ts
import { resend } from "@/lib/limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Send email to your sales team
    await resend.emails.send({
      from: "Demo Platform <work@noreply.worldsamma.org>",
      to: ["jngatia045@gmail.com"],
      subject: `New Quote Request: ${body.name} - ${body.business}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Business Type:</strong> ${body.business}</p>
        <p><strong>Estimated Orders:</strong> ${body.orders}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
        <hr>
        <p>Received: ${new Date().toLocaleString()}</p>
      `,
    });

    // Optional: Send confirmation to the user
    await resend.emails.send({
      from: "Demo Platform <quote@noreply.worldsamma.org>",
      to: [body.email],
      subject: "We received your quote request!",
      html: `
        <h2>Thank you for your interest!</h2>
        <p>Hi ${body.name},</p>
        <p>We've received your inquiry and our team will contact you within 2 hours to discuss your custom online store.</p>
        <p>In the meantime, you can check out our demo store at: <a href="https://first-shop-eta.vercel.app/">Your Complete
             E-commerce Solution</a></p>
        <p>Best regards,<br>Your E-commerce Platform Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
