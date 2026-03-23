import { Container, Spinner, Alert, Card, Badge, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetDeveloperProfileQuery } from "../../api/developerApiSlice";
import StarRating from "../../components/common/StarRating";

function DeveloperProfilePage() {
    const { data, isLoading, error } = useGetDeveloperProfileQuery();

    const profile = data?.profile;

    return (
        <Container className="py-4" style={{ maxWidth: "800px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Developer Profile</h2>
                <Button as={Link} to="/developer/dashboard" variant="outline-secondary" size="sm">
                    Back to Dashboard
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">
                    {error?.data?.message || error?.error || "Error fetching developer profile"}
                </Alert>
            ) : !profile ? (
                <Alert variant="info">Developer profile not found.</Alert>
            ) : (
                <>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Card.Title>{profile.userId?.name}</Card.Title>
                            <Card.Text>{profile.userId?.email}</Card.Text>

                            <Card.Text>
                                <strong>Average Rating:</strong>{" "}
                                <StarRating rating={profile.averageRating} />
                            </Card.Text>

                            <Card.Text>
                                <strong>Total Reviews:</strong> {profile.totalReviews}
                            </Card.Text>

                            <Card.Text>
                                <strong>Availability:</strong>{" "}
                                <Badge bg={profile.availability === "available" ? "success" : "warning"}>
                                    {profile.availability}
                                </Badge>
                            </Card.Text>

                            <Card.Text>
                                <strong>Experience Years:</strong> {profile.experienceYears}
                            </Card.Text>

                            <Card.Text>
                                <strong>Rate:</strong> {profile.rate}
                            </Card.Text>

                            <Card.Text>
                                <strong>Bio:</strong>
                                <br />
                                {profile.bio}
                            </Card.Text>

                            <Card.Text>
                                <strong>Skills:</strong>{" "}
                                {profile.skills?.length > 0
                                    ? profile.skills.join(", ")
                                    : "No skills added"}
                            </Card.Text>

                            <ListGroup variant="flush" className="mb-3">
                                <ListGroup.Item>
                                    <strong>Portfolio:</strong>{" "}
                                    {profile.links?.portfolio ? (
                                        <a
                                            href={profile.links.portfolio}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {profile.links.portfolio}
                                        </a>
                                    ) : (
                                        "Not added"
                                    )}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <strong>GitHub:</strong>{" "}
                                    {profile.links?.github ? (
                                        <a
                                            href={profile.links.github}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {profile.links.github}
                                        </a>
                                    ) : (
                                        "Not added"
                                    )}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <strong>LinkedIn:</strong>{" "}
                                    {profile.links?.linkedin ? (
                                        <a
                                            href={profile.links.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {profile.links.linkedin}
                                        </a>
                                    ) : (
                                        "Not added"
                                    )}
                                </ListGroup.Item>
                            </ListGroup>

                            <div className="d-flex gap-2 flex-wrap">
                                <Button
                                    as={Link}
                                    to="/developer/profile/edit"
                                    variant="warning"
                                    size="sm"
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    as={Link}
                                    to="/change-password"
                                    variant="outline-dark"
                                    size="sm"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}
        </Container>
    );
}

export default DeveloperProfilePage;
