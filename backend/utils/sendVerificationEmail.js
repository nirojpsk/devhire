const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const DEFAULT_SENDER_NAME = "DevHire";

const escapeHtml = (value = "") =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const buildFallbackHtml = ({ name, verifyUrl }) => {
    const safeName = escapeHtml(name || "there");
    const safeVerifyUrl = escapeHtml(verifyUrl);

    return `
        <div style="font-family: Arial, sans-serif; background: #f6f7fb; padding: 32px 16px; color: #1f2937;">
            <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 40px 32px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);">
                <div style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #111827;">Verify your DevHire account</div>
                <p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">Hi ${safeName},</p>
                <p style="font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
                    Thanks for signing up for DevHire. Please confirm your email address to activate your account.
                </p>
                <a
                    href="${safeVerifyUrl}"
                    style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-weight: 600;"
                >
                    Verify Email
                </a>
                <p style="font-size: 14px; line-height: 1.7; margin: 24px 0 0; color: #4b5563;">
                    If the button does not work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 14px; line-height: 1.7; word-break: break-all; color: #2563eb;">${safeVerifyUrl}</p>
                <p style="font-size: 14px; line-height: 1.7; margin-top: 24px; color: #6b7280;">
                    If you did not create this account, you can safely ignore this email.
                </p>
            </div>
        </div>
    `;
};

const sendVerificationEmail = async ({ email, name, verifyUrl }) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || DEFAULT_SENDER_NAME;
    const configuredTemplateId = Number(process.env.BREVO_TEMPLATE_ID);

    if (!apiKey) {
        throw new Error("BREVO_API_KEY is not configured");
    }

    if (!senderEmail) {
        throw new Error("BREVO_SENDER_EMAIL is not configured");
    }

    const payload = {
        sender: {
            email: senderEmail,
            name: senderName,
        },
        to: [
            {
                email,
                name,
            },
        ],
    };

    if (Number.isInteger(configuredTemplateId) && configuredTemplateId > 0) {
        payload.templateId = configuredTemplateId;
        payload.params = {
            name,
            verifyUrl,
        };
    } else {
        payload.subject = "Verify your DevHire account";
        payload.htmlContent = buildFallbackHtml({ name, verifyUrl });
    }

    const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send verification email");
    }

    try {
        return await response.json();
    } catch {
        return {};
    }
};

export default sendVerificationEmail;
