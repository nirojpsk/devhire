import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetClientProfileQuery } from "../../api/clientApiSlice";

function ClientDashboard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { data } = useGetClientProfileQuery();

    const profile = data?.profile;

    return (
        <Container className="py-4">
            <h2 className="mb-4">Client Dashboard</h2>

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title>Welcome, {userInfo?.name}</Card.Title>
                    <Card.Text>
                        You are logged in as a <strong>{userInfo?.role}</strong>.
                    </Card.Text>
                    <Card.Text>
                        From here, you can manage your profile, create projects, and manage posted projects.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Row className="g-3">
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Create a New Project</Card.Title>
                            <Card.Text>Post a new project and let developers bid on it.</Card.Text>
                            <Button as={Link} to="/projects/create" variant="dark">
                                Create Project
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>My Projects</Card.Title>
                            <Card.Text>View and manage all the projects you have posted.</Card.Text>
                            <Button as={Link} to="/my-projects" variant="outline-dark">
                                View My Projects
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>All Bids</Card.Title>
                            <Card.Text>See all bids submitted across your projects.</Card.Text>
                            <Button as={Link} to="/client/bids" variant="outline-primary">
                                View All Bids
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {!profile && (
                    <Col md={6}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>Create Profile</Card.Title>
                                <Card.Text>Create your client profile if you have not made one yet.</Card.Text>
                                <Button as={Link} to="/client/profile/create" variant="primary">
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
                            <Card.Text>View and update your client profile.</Card.Text>
                            <Button as={Link} to="/client/profile" variant="warning">
                                View Profile
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ClientDashboard;
