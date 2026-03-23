import { Card, Col, Row, Container, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetProjectsQuery } from '../../api/projectApiSlice';
import { useSelector } from 'react-redux';


function ProjectListPage() {
    const { data, isLoading, error } = useGetProjectsQuery();
    const { userInfo } = useSelector((state) => state.auth);
    const projects = data?.projects ?? [];
    const backLink = userInfo?.role === 'client'
        ? '/client/dashboard'
        : userInfo?.role === 'developer'
            ? '/developer/dashboard'
            : '/';
    const backLabel = userInfo ? 'Back to Dashboard' : 'Back to Home';

    return (
        <Container className='py-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Browse Projects</h2>
                <Link to={backLink} className='btn btn-outline-secondary btn-sm'>
                    {backLabel}
                </Link>
            </div>
            {isLoading ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : error ? (
                <Alert variant='danger'>
                    {error?.data?.message || error?.error || "Error Fetching Projects"}
                </Alert>
            ) : projects.length === 0 ? (
                <Alert variant='info'>
                    No Projects Found
                </Alert>
            ) : (
                <Row>
                    {projects.map((project) => (
                        <Col key={project._id} sm={12} md={6} lg={4} className='mb-4'>
                            <Card className='h-100 shadow-sm'>
                                <Card.Body>
                                    <Card.Title>
                                        {project.title}
                                    </Card.Title>
                                    <Card.Text>
                                        {project.description?.length > 120 ? `${project.description.substring(0, 120)}...`
                                            : project.description}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Budget:</strong> ${project.budget?.min} - ${project.budget?.max}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Deadline:</strong>{' '} {project.deadline ? new Date(project.deadline).toLocaleString() : 'N/A'}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Status:</strong>{' '}
                                        <Badge bg='secondary'>{project.status}</Badge>
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Skills:</strong>{' '}
                                        {project.skillsRequired?.length > 0
                                            ? project.skillsRequired.join(', ')
                                            : 'N/A'}
                                    </Card.Text>

                                    <Link to={`/projects/${project._id}`} className='btn btn-dark btn-sm'>View Details</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ProjectListPage;
