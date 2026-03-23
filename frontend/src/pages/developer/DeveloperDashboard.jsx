import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetDeveloperProfileQuery } from "../../api/developerApiSlice";

function DeveloperDashboard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { data } = useGetDeveloperProfileQuery();

    const profile = data?.profile;

    return (
        <Container className="py-4">
            <h2 className="mb-4">Developer Dashboard</h2>

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title>Welcome, {userInfo?.name}</Card.Title>
                    <Card.Text>
                        You are logged in as a <strong>{userInfo?.role}</strong>.
                    </Card.Text>
                    <Card.Text>
                        From here, you can browse projects, manage your bids, and update your profile.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Row className="g-3">
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Browse Projects</Card.Title>
                            <Card.Text>Explore available projects and place bids.</Card.Text>
                            <Button as={Link} to="/projects" variant="dark">
                                Browse Projects
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>My Bids</Card.Title>
                            <Card.Text>View, edit, and manage the bids you have placed.</Card.Text>
                            <Button as={Link} to="/my-bids" variant="outline-dark">
                                My Bids
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {!profile && (
                    <Col md={6}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>Create Profile</Card.Title>
                                <Card.Text>Create your developer profile if you have not made one yet.</Card.Text>
                                <Button as={Link} to="/developer/profile/create" variant="primary">
                                    Create Profile
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>My Profile</Card.Title>
                            <Card.Text>View and update your developer profile.</Card.Text>
                            <Button as={Link} to="/developer/profile" variant="warning">
                                View Profile
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DeveloperDashboard;