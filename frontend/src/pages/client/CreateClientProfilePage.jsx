import { Form, Button, Container } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateClientProfileMutation } from "../../api/clientApiSlice";

function CreateClientProfilePage() {
    const [companyName, setCompanyName] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");

    const [createClientProfile, { isLoading }] = useCreateClientProfileMutation();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!companyName || !bio) {
            toast.error("Please fill all the required fields");
            return;
        }

        try {
            const res = await createClientProfile({
                companyName,
                bio,
                website,
            }).unwrap();

            toast.success(res?.message || "Client profile created successfully");
            navigate("/client/profile");
        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.data?.error ||
                err?.error ||
                "Error creating client profile"
            );
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: "750px" }}>
            <h2 className="mb-4">Create Client Profile</h2>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId="companyName" className="my-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                    />
                </Form.Group>

                <Form.Group controlId="bio" className="my-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell about your company or project goals"
                    />
                </Form.Group>

                <Form.Group controlId="website" className="my-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                    />
                </Form.Group>

                <Button type="submit" className="btn btn-sm" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Profile"}
                </Button>
            </Form>
        </Container>
    );
}

export default CreateClientProfilePage;