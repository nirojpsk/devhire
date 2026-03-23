import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetClientProfileQuery } from "../../api/clientApiSlice";

function ClientProfilePage() {
    const { data, isLoading, error } = useGetClientProfileQuery();

    const profile = data?.profile;

    return (
        <Container className="py-4" style={{ maxWidth: "800px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Client Profile</h2>
                <Button as={Link} to="/client/dashboard" variant="outline-secondary" size="sm">
                    Back to Dashboard
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
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>{profile.userId?.name}</Card.Title>
                        <Card.Text>{profile.userId?.email}</Card.Text>

                        <Card.Text>
                            <strong>Company Name:</strong> {profile.companyName}
                        </Card.Text>

                        <Card.Text>
                            <strong>Total Projects Posted:</strong> {profile.totalProjectsPosted}
                        </Card.Text>

                        <Card.Text>
                            <strong>Bio:</strong>
                            <br />
                            {profile.bio}
                        </Card.Text>

                        <Card.Text>
                            <strong>Website:</strong>{" "}
                            {profile.website ? (
                                <a href={profile.website} target="_blank" rel="noreferrer">
                                    {profile.website}
                                </a>
                            ) : (
                                "Not added"
                            )}
                        </Card.Text>

                        <Button
                            as={Link}
                            to="/client/profile/edit"
                            variant="warning"
                            size="sm"
                        >
                            Edit Profile
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default ClientProfilePage;
