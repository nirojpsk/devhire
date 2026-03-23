import { Form, Button, Container, Card } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../api/authApiSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function ChangePasswordPage() {
    const { userInfo } = useSelector((state) => state.auth);
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
                currentPassword,
                newPassword,
            }).unwrap();

            toast.success(res?.message || "Password changed successfully");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.data?.error ||
                err?.error ||
                "Error changing password"
            );
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: "600px" }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Change Password</h2>
                        <Button as={Link} to={backLink} variant="outline-secondary" size="sm">
                            Back
                        </Button>
                    </div>

                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="currentPassword" className="my-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </Form.Group>

                        <Form.Group controlId="newPassword" className="my-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <Form.Text muted>
                                Password must be at least 8 characters and include uppercase, lowercase, and a special character.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="confirmNewPassword" className="my-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </Form.Group>

                        <Button type="submit" className="btn btn-sm" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Change Password"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ChangePasswordPage;
