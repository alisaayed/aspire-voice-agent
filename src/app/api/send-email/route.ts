import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { summary, recipientEmail, scheduledAt } = await request.json();

    if (!summary || typeof summary !== "string") {
      return NextResponse.json(
        { error: "No summary provided" },
        { status: 400 }
      );
    }

    if (!recipientEmail || !EMAIL_REGEX.test(recipientEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: "noreply@alisaayed.com",
      to: recipientEmail,
      subject: "Voice Note Summary",
      text: summary,
    };

    if (scheduledAt) {
      emailOptions.scheduledAt = scheduledAt;
    }

    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
