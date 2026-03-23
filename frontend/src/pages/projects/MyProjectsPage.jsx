import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetMyProjectsQuery, useDeleteProjectMutation } from "../../api/projectApiSlice";
import { toast } from "react-toastify";
import getErrorMessage from "../../utils/getErrorMessage";

function MyProjectsPage() {
    const { data, isLoading, error } = useGetMyProjectsQuery();
    const [deleteProject, { isLoading: loadingDelete }] = useDeleteProjectMutation();
    const projects = data?.projects || [];

    const deleteHandler = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const res = await deleteProject(projectId).unwrap();
                toast.success(res?.message || 'project deleted successfully');
            } catch (err) {
                toast.error(getErrorMessage(err, "Unable to delete project"));
            }
        }
    };
    return (
        <Container className="py-4">
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>My Projects</h2>
                <Button as={Link} to='/client/dashboard' variant='outline-secondary' size='sm'>
                    Back to Dashboard
                </Button>
            </div>
            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error?.data?.message || error?.error || 'Error fetching your projects'}</Alert>
            ) : projects.length === 0 ? (
                <Alert variant="info">You have not created any projects yet.</Alert>
            ) : (
                <Row>
                    {projects.map((project) => {
                        const statusLabel = project.status === 'in-progress' ? 'in progress' : project.status;
                        return (
                            <Col key={project._id} sm={12} md={6} lg={4} className="mb-4">
                                <Card className="h-100 shadow-sm">
                                    <Card.Body>
                                        <Card.Title>{project.title}</Card.Title>
                                        <Card.Text>{project.description.length > 120 ? `${project.description.substring(0, 120)}...` : project.description}

                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Budget:</strong>{' '} ${project.budget?.min} - ${project.budget?.max}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Status:</strong>{' '}
                                            <Badge bg='secondary'>{statusLabel}</Badge>
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Selected Developer:</strong>{' '}
                                            {project.selectedDeveloper?.name || 'Not selected yet'}
                                        </Card.Text>
                                        {project.selectedDeveloper?._id && (
                                            <div className="mb-2">
                                                <Button
                                                    as={Link}
                                                    to={`/developers/${project.selectedDeveloper._id}/profile`}
                                                    variant="outline-primary"
                                                    size="sm"
                                                >
                                                    View Selected Developer Profile
                                                </Button>
                                            </div>
                                        )}

                                        <Card.Text>
                                            <strong>Skills:</strong>{' '}
                                            {project.skillsRequired?.length > 0
                                                ? project.skillsRequired.join(', ')
                                                : 'N/A'}
                                        </Card.Text>

                                        <div className='d-flex gap-2'>
                                            <Button
                                                as={Link}
                                                to={`/projects/${project._id}`}
                                                variant='dark'
                                                size='sm'
                                            >
                                                View Details
                                            </Button>

                                            <Button as={Link} to={`/projects/${project._id}/edit`} variant="warning" size="sm">
                                                Edit
                                            </Button>

                                            <Button
                                                variant="danger"
                                                size="sm"
                                                disabled={loadingDelete || project.status !== "open"}
                                                onClick={() => deleteHandler(project._id)}
                                            >
                                                {loadingDelete ? 'Deleting...' : 'Delete'}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
}

export default MyProjectsPage;
