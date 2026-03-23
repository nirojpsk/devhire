import { Form } from "react-bootstrap";
import { useLoginMutation } from "../../api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setCredentials } from "../../slices/authSlice";
import apiSlice from "../../api/apiSlice";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock, FaProjectDiagram, FaUserShield } from "react-icons/fa";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";

function LoginPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const sp = new URLSearchParams(location.search);
    const redirect = sp.get("redirect");

    useEffect(() => {
        if (userInfo) {
            if (redirect) {
                navigate(redirect);
            } else if (userInfo.role === "client") {
                navigate("/client/dashboard");
            } else if (userInfo.role === "developer") {
                navigate("/developer/dashboard");
            } else if (userInfo.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [userInfo, navigate, redirect]);

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(apiSlice.util.resetApiState());
            dispatch(setCredentials(res.user));
            toast.success("Login successful");

            if (res.user.role === "client") {
                navigate("/client/dashboard");
            } else if (res.user.role === "developer") {
                navigate("/developer/dashboard");
            } else if (res.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            const apiMessage = getErrorMessage(err, "Login failed");
            const normalizedMessage = apiMessage?.toLowerCase().includes("valid credentials")
                ? "Incorrect email or password"
                : apiMessage;
            toast.error(normalizedMessage || "Login failed");
        }
    };

    return (
        <div className="public-page">
            <div className="container">
                <div className="auth-shell">
                    <div className="auth-panel animate-in">
                        <div className="auth-highlight">
                            <div className="stacked-info">
                                <span className="eyebrow">Welcome back</span>
                                <h1 className="page-title page-title--compact">
                                    Sign in to continue managing projects and proposals.
                                </h1>
                                <p className="page-subtitle">
                                    Clients, developers, and admins all return to the same polished workspace.
                                </p>
                            </div>

                            <div className="auth-highlight__footer">
                                <div className="auth-mini-card">
                                    <FaProjectDiagram className="mb-3" />
                                    <h3>Project visibility</h3>
                                    <p>Track bids, submissions, and next actions without losing context.</p>
                                </div>
                                <div className="auth-mini-card">
                                    <FaUserShield className="mb-3" />
                                    <h3>Role-aware access</h3>
                                    <p>Your dashboard and workflow stay tailored to your permissions.</p>
                                </div>
                            </div>
                        </div>

                        <div className="auth-form-panel">
                            <div className="page-intro__copy mb-4">
                                <span className="eyebrow">Account access</span>
                                <h2 className="section-title">Sign In</h2>
                                <p className="page-subtitle">
                                    Use your existing DevHire account to return to your workspace.
                                </p>
                            </div>

                            <Form onSubmit={loginHandler} className="auth-form">
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                    />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="mb-0">Password</Form.Label>
                                        <span className="section-link">
                                            <FaLock className="me-1" />
                                            Secure login
                                        </span>
                                    </div>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                </Form.Group>

                                <div className="form-actions">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Logging in..." : "Sign In"}
                                    </Button>
                                    <Button as={NavLink} to="/register" tone="light" type="button">
                                        Create Account
                                    </Button>
                                </div>

                                <div className="form-divider">
                                    <span>New to DevHire?</span>
                                </div>

                                <p className="page-subtitle">
                                    Create a client or developer account to start posting projects or sending proposals.
                                </p>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
