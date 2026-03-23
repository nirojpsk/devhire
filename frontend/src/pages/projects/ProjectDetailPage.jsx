import {
    Container,
    Card,
    Spinner,
    Alert,
    Badge,
    Row,
    Col,
    Button,
} from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useGetProjectByIdQuery } from '../../api/projectApiSlice';
import { useSelector } from 'react-redux';
import { useGetMyBidsQuery } from '../../api/bidApiSlice';
import { useGetDeveloperProfileQuery } from '../../api/developerApiSlice';

function ProjectDetailPage() {
    const { projectId } = useParams();
    const { userInfo } = useSelector((state) => state.auth);
    const { data, isLoading, error } = useGetProjectByIdQuery(projectId);
    const isDeveloper = userInfo?.role === 'developer';
    const { data: myBidsData } = useGetMyBidsQuery(undefined, { skip: !isDeveloper });
    const { data: developerProfileData } = useGetDeveloperProfileQuery(undefined, { skip: !isDeveloper });

    const project = data?.project;

    const isClientOwner =
        userInfo?.role === 'client' &&
        userInfo?.id === project?.clientId?._id;

    const isProjectOpen = project?.status === 'open';
    const statusLabel = project?.status === 'in-progress' ? 'in progress' : project?.status;
    const hasDeveloperProfile = !!developerProfileData?.profile;
    const hasAlreadyPlacedBid = myBidsData?.bids?.some((bid) => {
        const bidProjectId = typeof bid?.projectId === 'object' ? bid.projectId?._id : bid?.projectId;
        return String(bidProjectId) === String(project?._id);
    });

    return (
        <Container className='py-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Project Details</h2>
                <Button as={Link} to='/projects' variant='outline-secondary' size='sm'>
                    Back to Projects
                </Button>
            </div>

            {isLoading ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : error ? (
                <Alert variant='danger'>
                    {error?.data?.message || error?.error || 'Error fetching project details'}
                </Alert>
            ) : !project ? (
                <Alert variant='info'>Project not found.</Alert>
            ) : (
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
                                    <strong>Budget:</strong> ${project.budget?.min} - ${project.budget?.max}
                                </Card.Text>
                            </Col>

                            <Col md={6}>
                                <Card.Text>
                                    <strong>Status:</strong>{' '}
                                    <Badge bg='secondary'>{statusLabel}</Badge>
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
                        {project.selectedDeveloper?._id && (
                            <div className='mb-3'>
                                <Button
                                    as={Link}
                                    to={`/developers/${project.selectedDeveloper._id}/profile`}
                                    variant='outline-primary'
                                    size='sm'
                                >
                                    View Selected Developer Profile
                                </Button>
                            </div>
                        )}
                        {project.submission?.submittedAt && (
                            <Alert variant='success' className='py-2'>
                                <strong>Project Submitted:</strong>{' '}
                                {new Date(project.submission.submittedAt).toLocaleDateString()}
                                {project.submission?.link && (
                                    <>
                                        {' '}|{' '}
                                        <a href={project.submission.link} target='_blank' rel='noreferrer'>
                                            View Submission Link
                                        </a>
                                    </>
                                )}
                                {project.submission?.clientDecision?.status && (
                                    <>
                                        <br />
                                        <strong>Client Decision:</strong>{' '}
                                        {project.submission.clientDecision.status}
                                        {project.submission.clientDecision.note && (
                                            <>
                                                <br />
                                                <strong>Client Note:</strong>{' '}
                                                {project.submission.clientDecision.note}
                                            </>
                                        )}
                                    </>
                                )}
                            </Alert>
                        )}

                        <div className='mt-3 d-flex gap-2 flex-wrap'>
                            {isDeveloper && !hasDeveloperProfile && (
                                <Alert variant='warning' className='mb-0 py-2'>
                                    Please create your developer profile before placing a bid.{' '}
                                    <Link to='/developer/profile/create'>Create Profile</Link>
                                </Alert>
                            )}

                            {isDeveloper && isProjectOpen && hasDeveloperProfile && !hasAlreadyPlacedBid && (
                                <Button
                                    as={Link}
                                    to={`/projects/${project._id}/bid`}
                                    variant='dark'
                                    size='sm'
                                >
                                    Place Bid
                                </Button>
                            )}

                            {isDeveloper && isProjectOpen && hasDeveloperProfile && hasAlreadyPlacedBid && (
                                <Alert variant='info' className='mb-0 py-2'>
                                    You have already placed the bid for this project
                                </Alert>
                            )}

                            {isClientOwner && isProjectOpen && (
                                <Button
                                    as={Link}
                                    to={`/projects/${project._id}/edit`}
                                    variant='warning'
                                    size='sm'
                                >
                                    Edit Project
                                </Button>
                            )}

                            {isClientOwner && (
                                <Button
                                    as={Link}
                                    to={`/projects/${project._id}/bids`}
                                    variant='primary'
                                    size='sm'
                                >
                                    View Bids
                                </Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default ProjectDetailPage;
