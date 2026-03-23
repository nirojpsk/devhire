import { Container, Spinner, Alert, Card, Badge, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useGetUserProfileAdminQuery } from "../../api/adminApiSlice";

function AdminUserProfilePage() {
    const { userId } = useParams();
    const { data, isLoading, error } = useGetUserProfileAdminQuery(userId);

    const user = data?.user;
    const profile = data?.profile;

    return (
        <Container className="py-4" style={{ maxWidth: "900px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">User Profile</h2>
                <Button as={Link} to="/admin/users" variant="outline-secondary" size="sm">
                    Back to Users
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">
                    {error?.data?.message || error?.error || "Error fetching user profile"}
                </Alert>
            ) : !user ? (
                <Alert variant="info">User not found.</Alert>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>{user.name}</Card.Title>
                        <Card.Text className="mb-1">{user.email}</Card.Text>
                        <Card.Text>
                            <strong>Role:</strong>{" "}
                            <Badge bg={user.role === "developer" ? "primary" : "secondary"}>
                                {user.role}
                            </Badge>
                        </Card.Text>
                        <Card.Text>
                            <strong>Banned:</strong> {user.isBanned ? "Yes" : "No"}
                        </Card.Text>

                        {!profile ? (
                            <Alert variant="info" className="mb-0">
                                This user has not created a profile yet.
                            </Alert>
                        ) : user.role === "developer" ? (
                            <>
                                <Card.Text><strong>Bio:</strong> {profile.bio}</Card.Text>
                                <Card.Text><strong>Skills:</strong> {profile.skills?.join(", ") || "Not added"}</Card.Text>
                                <Card.Text><strong>Experience Years:</strong> {profile.experienceYears}</Card.Text>
                                <Card.Text><strong>Availability:</strong> {profile.availability}</Card.Text>
                                <Card.Text><strong>Rate:</strong> {profile.rate}</Card.Text>
                                <Card.Text>
                                    <strong>Portfolio:</strong>{" "}
                                    {profile.links?.portfolio ? (
                                        <a href={profile.links.portfolio} target="_blank" rel="noreferrer">
                                            {profile.links.portfolio}
                                        </a>
                                    ) : (
                                        "Not added"
                                    )}
                                </Card.Text>
                                <Card.Text>
                                    <strong>GitHub:</strong>{" "}
                                    {profile.links?.github ? (
                                        <a href={profile.links.github} target="_blank" rel="noreferrer">
                                            {profile.links.github}
                                        </a>
                                    ) : (
                                        "Not added"
                                    )}
                                </Card.Text>
                                <Card.Text className="mb-0">
                                    <strong>LinkedIn:</strong>{" "}
                                    {profile.links?.linkedin ? (
                                        <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                                            {profile.links.linkedin}
                                        </a>
                                    ) : (
                                        "Not added"
                                    )}
                                </Card.Text>
                            </>
                        ) : (
                            <>
                                <Card.Text><strong>Company Name:</strong> {profile.companyName}</Card.Text>
                                <Card.Text><strong>Bio:</strong> {profile.bio}</Card.Text>
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
                                <Card.Text className="mb-0">
                                    <strong>Total Projects Posted:</strong> {profile.totalProjectsPosted}
                                </Card.Text>
                            </>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default AdminUserProfilePage;
