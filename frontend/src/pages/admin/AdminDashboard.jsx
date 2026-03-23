import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminDashboard() {
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <Container className="py-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title>Welcome, {userInfo?.name}</Card.Title>
                    <Card.Text>
                        You are logged in as <strong>{userInfo?.role}</strong>.
                    </Card.Text>
                    <Card.Text>
                        From here, you can manage users and projects across the platform.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Row className="g-3">
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Manage Users</Card.Title>
                            <Card.Text>
                                View all users, ban/unban users, or delete users.
                            </Card.Text>
                            <Button as={Link} to="/admin/users" variant="dark">
                                Manage Users
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Manage Projects</Card.Title>
                            <Card.Text>
                                View all projects and remove projects when necessary.
                            </Card.Text>
                            <Button as={Link} to="/admin/projects" variant="outline-dark">
                                Manage Projects
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDashboard;