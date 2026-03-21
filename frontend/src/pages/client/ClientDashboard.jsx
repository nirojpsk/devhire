import { useSelector } from 'react-redux';
import { Button, Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
function ClientDashboard() {
    const { userInfo } = useSelector(state => state.auth);
    return (
        <Container className='py-4'>
            <h2 className='mb-4'>Client Dashboard</h2>
            <Card className='shadow-sm mb-4'>
                <Card.Body>
                    <Card.Title>Welcome, {userInfo?.name}</Card.Title>
                    <Card.Text>You are logged in as a <strong>{userInfo?.role}</strong></Card.Text>

                    <Card.Text>
                        From here, you can create new projects and manage your posted projects.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Row className='g-3'>
                <Col md={6}>
                    <Card className='h-100 shadow-sm'>
                        <Card.Body>
                            <Card.Title>Create a New Project</Card.Title>
                            <Card.Text>Post a new Project and let developers bid on it.</Card.Text>
                            <Button as={Link} to='/projects/create' variant='dark'>Create Project</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className='h-100 shadow-sm'>
                        <Card.Body>
                            <Card.Title>My Projects</Card.Title>
                            <Card.Text>View and Mange all the projects you have posted</Card.Text>
                            <Button as={Link} to='/my-projects' variant='outline-dark'>View My Projects</Button>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

        </Container>

    );
}

export default ClientDashboard;
