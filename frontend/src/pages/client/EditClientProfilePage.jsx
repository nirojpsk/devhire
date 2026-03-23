import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
    useGetClientProfileQuery,
    useUpdateClientProfileMutation,
} from "../../api/clientApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";

function EditClientProfileForm({ profile, loadingUpdate, updateClientProfile, navigate }) {
    const [companyName, setCompanyName] = useState(() => profile.companyName || "");
    const [bio, setBio] = useState(() => profile.bio || "");
    const [website, setWebsite] = useState(() => profile.website || "");

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const res = await updateClientProfile({
                companyName,
                bio,
                website,
            }).unwrap();

            toast.success(res?.message || "Client profile updated successfully");
            navigate("/client/profile");
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to update client profile"));
        }
    };

    return (
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="companyName" className="my-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="bio" className="my-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="website" className="my-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </Form.Group>

            <div className="d-flex gap-2">
                <Button type="submit" className="btn btn-sm" disabled={loadingUpdate}>
                    {loadingUpdate ? "Updating..." : "Update Profile"}
                </Button>

                <Button
                    type="button"
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate("/client/profile")}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

function EditClientProfilePage() {
    const { data, isLoading, error } = useGetClientProfileQuery();
    const [updateClientProfile, { isLoading: loadingUpdate }] =
        useUpdateClientProfileMutation();
    const navigate = useNavigate();

    const profile = data?.profile;

    return (
        <Container className="py-4" style={{ maxWidth: "800px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Edit Client Profile</h2>
                <Button as={Link} to="/client/profile" variant="outline-secondary" size="sm">
                    Back to Profile
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">
                    {error?.data?.message || error?.error || "Error fetching client profile"}
                </Alert>
            ) : !profile ? (
                <Alert variant="info">Client profile not found.</Alert>
            ) : (
                <EditClientProfileForm
                    key={profile._id || profile.userId?._id || "client-profile"}
                    profile={profile}
                    loadingUpdate={loadingUpdate}
                    updateClientProfile={updateClientProfile}
                    navigate={navigate}
                />
            )}
        </Container>
    );
}

export default EditClientProfilePage;
