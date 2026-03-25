import crypto from "crypto";

const DEFAULT_FRONTEND_URL = "http://localhost:5173";
const DEFAULT_EXPIRY_MINUTES = 60;

const getConfiguredFrontendUrl = () => {
    const configuredOrigins = (process.env.FRONTEND_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return configuredOrigins[0] || DEFAULT_FRONTEND_URL;
};

const getVerificationExpiryMinutes = () => {
    const parsedValue = Number(process.env.EMAIL_VERIFICATION_EXPIRES_MINUTES);
    return Number.isFinite(parsedValue) && parsedValue > 0
        ? parsedValue
        : DEFAULT_EXPIRY_MINUTES;
};

const hashEmailVerificationToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const createEmailVerificationToken = () => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + getVerificationExpiryMinutes() * 60 * 1000);

    return {
        token,
        tokenHash: hashEmailVerificationToken(token),
        expiresAt,
    };
};

const buildEmailVerificationUrl = (token) => {
    const baseUrl = getConfiguredFrontendUrl().replace(/\/+$/, "");
    return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
};

export {
    buildEmailVerificationUrl,
    createEmailVerificationToken,
    hashEmailVerificationToken,
};
