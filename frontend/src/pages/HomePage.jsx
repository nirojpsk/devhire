import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBriefcase, FaGavel, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";

function HomePage() {
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <>
            <section className="py-5 bg-light border-bottom">
                <Container>
                    <Row className="align-items-center gy-4">
                        <Col md={6}>
                            <h1 className="fw-bold mb-3">
                                Connect Clients with Skilled Developers
                            </h1>
                            <p className="lead text-muted mb-4">
                                DevHire helps clients post projects, developers place bids,
                                and teams collaborate with confidence.
                            </p>

                            <div className="d-flex gap-3 flex-wrap">
                                <Button as={Link} to="/projects" variant="dark" size="lg">
                                    Browse Projects
                                </Button>

                                {!userInfo ? (
                                    <Button as={Link} to="/register" variant="outline-dark" size="lg">
                                        Get Started
                                    </Button>
                                ) : (
                                    <Button
                                        as={Link}
                                        to={
                                            userInfo.role === "client"
                                                ? "/client/dashboard"
                                                : userInfo.role === "developer"
                                                ? "/developer/dashboard"
                                                : "/admin/dashboard"
                                        }
                                        variant="outline-dark"
                                        size="lg"
                                    >
                                        Go to Dashboard
                                    </Button>
                                )}
                            </div>
                        </Col>

                        <Col md={6}>
                            <Card className="shadow-sm border-0">
                                <Card.Body className="p-4">
                                    <h4 className="mb-3">Why DevHire?</h4>
                                    <p className="text-muted mb-2">
                                        Post projects, receive bids, compare developers, and manage
                                        work from one place.
                                    </p>
                                    <p className="text-muted mb-2">
                                        Developers can showcase their profile, bid on projects,
                                        and grow their freelance career.
                                    </p>
                                    <p className="text-muted mb-0">
                                        Simple, focused, and built for real hiring workflows.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Platform Features</h2>
                        <p className="text-muted">
                            Everything needed to connect clients and developers efficiently.
                        </p>
                    </div>

                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="h-100 shadow-sm text-center">
                                <Card.Body>
                                    <div className="mb-3 fs-2">
                                        <FaBriefcase />
                                    </div>
                                    <Card.Title>Post Projects</Card.Title>
                                    <Card.Text className="text-muted">
                                        Clients can create projects, set budgets, define required
                                        skills, and manage project details easily.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card className="h-100 shadow-sm text-center">
                                <Card.Body>
                                    <div className="mb-3 fs-2">
                                        <FaGavel />
                                    </div>
                                    <Card.Title>Place Bids</Card.Title>
                                    <Card.Text className="text-muted">
                                        Developers can browse projects, submit competitive bids,
                                        and update their offers professionally.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card className="h-100 shadow-sm text-center">
                                <Card.Body>
                                    <div className="mb-3 fs-2">
                                        <FaUsers />
                                    </div>
                                    <Card.Title>Hire with Confidence</Card.Title>
                                    <Card.Text className="text-muted">
                                        Review profiles, compare proposals, and choose the right
                                        developer for the project.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="py-5 bg-light">
                <Container>
                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title className="fw-bold mb-3">
                                        For Clients
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        Create projects, manage bids, review developers, and track
                                        project progress from your dashboard.
                                    </Card.Text>
                                    {userInfo?.role === "client" ? (
                                        <Button as={Link} to="/projects/create" variant="dark">
                                            Post a Project
                                        </Button>
                                    ) : (
                                        <p className="text-danger fw-semibold mb-0">
                                            You are not authorized to post a project.
                                        </p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title className="fw-bold mb-3">
                                        For Developers
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        Browse available work, place bids, build your developer
                                        profile, and grow your freelance opportunities.
                                    </Card.Text>
                                    <Button as={Link} to="/projects" variant="outline-dark">
                                        Explore Projects
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="py-5 text-center">
                <Container>
                    <h2 className="fw-bold mb-3">Ready to get started?</h2>
                    <p className="text-muted mb-4">
                        Join DevHire and connect the right clients with the right developers.
                    </p>

                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        {!userInfo ? (
                            <>
                                <Button as={Link} to="/register" variant="dark">
                                    Create Account
                                </Button>
                                <Button as={Link} to="/login" variant="outline-dark">
                                    Login
                                </Button>
                            </>
                        ) : (
                            <Button
                                as={Link}
                                to={
                                    userInfo.role === "client"
                                        ? "/client/dashboard"
                                        : userInfo.role === "developer"
                                        ? "/developer/dashboard"
                                        : "/admin/dashboard"
                                }
                                variant="dark"
                            >
                                Go to Dashboard
                            </Button>
                        )}
                    </div>
                </Container>
            </section>
        </>
    );
}

export default HomePage;
