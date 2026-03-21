import { Container, Row, Col, Card, Spinner, Alert, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../api/projectApiSlice";

function ProjectDetailsPage() {
    const { projectId } = useParams();
    const { data, isLoading, error } = useGetProjectByIdQuery(projectId);
    const project = data?.project;

    return (
        <Container className="py-2">
            <h2 className="mb-4">Project Details</h2>
            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ): error? (
                <Alert variant="danger">{error?.data?.message || error?.error || 'Error fetching project details'}</Alert>
            ): !project ? (
                <Alert variant="info">Project not found</Alert>
            ): (
  <Card className='shadow-sm'>
                    <Card.Body>
                        <Card.Title className='mb-3'>{project.title}</Card.Title>

                        <Card.Text>
                            <strong>Description:</strong>
                            <br />
                            {project.description}
                        </Card.Text>

                        <Row className='mb-3'>
                            <Col md={6}>
                                <Card.Text>
                                    <strong>Budget:</strong>{' '}
                                    ${project.budget?.min} - ${project.budget?.max}
                                </Card.Text>
                            </Col>
                            <Col md={6}>
                                <Card.Text>
                                    <strong>Status:</strong>{' '}
                                    <Badge bg='secondary'>{project.status}</Badge>
                                </Card.Text>
                            </Col>
                        </Row>

                        <Row className='mb-3'>
                            <Col md={6}>
                                <Card.Text>
                                    <strong>Deadline:</strong>{' '}
                                    {project.deadline
                                        ? new Date(project.deadline).toLocaleDateString()
                                        : 'N/A'}
                                </Card.Text>
                            </Col>
                            <Col md={6}>
                                <Card.Text>
                                    <strong>Client:</strong>{' '}
                                    {project.clientId?.name || 'N/A'}
                                </Card.Text>
                            </Col>
                        </Row>

                        <Card.Text>
                            <strong>Client Email:</strong>{' '}
                            {project.clientId?.email || 'N/A'}
                        </Card.Text>

                        <Card.Text>
                            <strong>Skills Required:</strong>{' '}
                            {project.skillsRequired?.length > 0
                                ? project.skillsRequired.join(', ')
                                : 'N/A'}
                        </Card.Text>

                        <Card.Text>
                            <strong>Selected Developer:</strong>{' '}
                            {project.selectedDeveloper?.name || 'Not selected yet'}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        
        </Container>
    );
};

export default ProjectDetailsPage;