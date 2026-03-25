import { Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { NavLink, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useResendVerificationEmailMutation,
    useVerifyEmailMutation,
} from "../../api/authApiSlice";
import Button from "../../components/ui/Button";
import getErrorMessage from "../../utils/getErrorMessage";

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const emailFromQuery = searchParams.get("email") || "";
    const hasAttemptedVerification = useRef(false);

    const [email, setEmail] = useState(emailFromQuery);
    const [status, setStatus] = useState(token ? "verifying" : "idle");
    const [message, setMessage] = useState(
        token
            ? "We are verifying your email now. This only takes a moment."
            : "Check your inbox for the verification link. If you need another one, you can request it below."
    );

    const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
    const [resendVerificationEmail, { isLoading: isResending }] = useResendVerificationEmailMutation();

    useEffect(() => {
        if (!token) {
            setEmail(emailFromQuery);
        }
    }, [emailFromQuery, token]);

    useEffect(() => {
        if (!token || hasAttemptedVerification.current) {
            return;
        }

        hasAttemptedVerification.current = true;

        const verifyCurrentToken = async () => {
            try {
                const res = await verifyEmail({ token }).unwrap();
                setStatus("success");
                setMessage(res?.message || "Email verified successfully. You can now log in.");
                toast.success(res?.message || "Email verified successfully");
            } catch (err) {
                const nextMessage = getErrorMessage(err, "Unable to verify this email right now.");
                setStatus("error");
                setMessage(nextMessage);
                toast.error(nextMessage);
            }
        };

        verifyCurrentToken();
    }, [token, verifyEmail]);

    const resendHandler = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            const res = await resendVerificationEmail({ email: email.trim() }).unwrap();
            const nextMessage = res?.message || "Verification email sent successfully. Please check your inbox.";
            setStatus("idle");
            setMessage(nextMessage);
            toast.success(nextMessage);
        } catch (err) {
            const nextMessage = getErrorMessage(err, "Unable to resend the verification email");
            setStatus("error");
            setMessage(nextMessage);
            toast.error(nextMessage);
        }
    };

    const isBusy = isVerifying || isResending;
    const showResendForm = status !== "success";
    const heroTitle = status === "success"
        ? "Email verified"
        : token
            ? "Verify your email"
            : "Check your inbox";

    const heroSubtitle = status === "success"
        ? "Your account is ready. Sign in to continue into DevHire."
        : "Secure access starts with confirming that the inbox belongs to you.";

    return (
        <div className="public-page">
            <div className="container">
                <div className="auth-shell">
                    <div className="auth-panel animate-in">
                        <div className="auth-highlight">
                            <div className="stacked-info">
                                <span className="eyebrow">
                                    <FaShieldAlt />
                                    Email verification
                                </span>
                                <h1 className="page-title page-title--compact">{heroTitle}</h1>
                                <p className="page-subtitle">{heroSubtitle}</p>
                            </div>

                            <div className="auth-signal-row">
                                <div className="auth-signal">
                                    <strong>One secure inbox</strong>
                                    <span>We only activate accounts after the verification link is used.</span>
                                </div>
                                <div className="auth-signal">
                                    <strong>Easy recovery</strong>
                                    <span>Expired or missed links can be resent in a few seconds.</span>
                                </div>
                            </div>

                            <ul className="auth-checklist">
                                <li>Look for an email from <code>support@nepmailer.me</code>.</li>
                                <li>Check spam or promotions if the message does not appear quickly.</li>
                                <li>Return here any time to request a fresh verification link.</li>
                            </ul>

                            <div className="auth-highlight__footer">
                                <div className="auth-mini-card">
                                    <FaEnvelope className="mb-3" />
                                    <h3>Inbox confirmation</h3>
                                    <p>Only verified accounts can sign in and start posting projects or bids.</p>
                                </div>
                                <div className="auth-mini-card">
                                    <FaCheckCircle className="mb-3" />
                                    <h3>Ready to continue</h3>
                                    <p>Once the link is confirmed, your normal login flow works immediately.</p>
                                </div>
                            </div>
                        </div>

                        <div className="auth-form-panel">
                            <div className="auth-form-panel__header">
                                <span className="eyebrow">Verification status</span>
                                <h2 className="section-title">
                                    {status === "success" ? "Account confirmed" : "Complete your email check"}
                                </h2>
                                <p className="page-subtitle">{message}</p>
                            </div>

                            {showResendForm ? (
                                <Form onSubmit={resendHandler} className="auth-form">
                                    <Form.Group controlId="verificationEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            disabled={isBusy}
                                        />
                                    </Form.Group>

                                    <Form.Text>
                                        Use the same email you registered with if you need a fresh verification link.
                                    </Form.Text>

                                    <div className="form-actions">
                                        <Button type="submit" disabled={isBusy}>
                                            {isResending ? "Sending..." : "Resend Verification Email"}
                                        </Button>
                                        <Button as={NavLink} to="/login" tone="light" type="button">
                                            Back to Login
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div className="auth-form">
                                    <div className="auth-signal">
                                        <strong>Everything looks good</strong>
                                        <span>You can sign in now with the email address and password you created.</span>
                                    </div>

                                    <div className="form-actions">
                                        <Button as={NavLink} to="/login">
                                            Go to Login
                                        </Button>
                                        <Button as={NavLink} to="/register" tone="light" type="button">
                                            Create Another Account
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmailPage;
