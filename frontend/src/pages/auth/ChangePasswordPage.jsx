import { Form } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../api/authApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";

function ChangePasswordPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const backLink = userInfo?.role === "client"
        ? "/client/dashboard"
        : userInfo?.role === "developer"
            ? "/developer/dashboard"
            : userInfo?.role === "admin"
                ? "/admin/dashboard"
                : "/";

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("Please fill all required fields");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            toast.error(
                "New password must be at least 8 characters and include uppercase, lowercase, and a special character"
            );
            return;
        }

        try {
            const res = await changePassword({
                oldPassword: currentPassword,
                newPassword,
            }).unwrap();

            toast.success(res?.message || "Password changed successfully");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            navigate(backLink);
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to change password"));
        }
    };

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Account security</span>
                    <h1 className="page-title page-title--compact">Change Password</h1>
                    <p className="page-subtitle">
                        Keep your account secure. Password rules and submission behavior remain exactly the same.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to={backLink} tone="light">
                        Back
                    </Button>
                </div>
            </section>

            <article className="detail-card" style={{ maxWidth: "760px" }}>
                <Form onSubmit={submitHandler} className="auth-form">
                    <Form.Group controlId="currentPassword">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </Form.Group>

                    <Form.Group controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <Form.Text>
                            Password must be at least 8 characters and include uppercase, lowercase, and a special character.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="confirmNewPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </Form.Group>

                    <div className="form-actions">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Change Password"}
                        </Button>
                    </div>
                </Form>
            </article>
        </div>
    );
}

export default ChangePasswordPage;
