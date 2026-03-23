import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetMyBidsQuery } from '../../api/bidApiSlice';

function AcceptedProjectsPage() {
    const { data, isLoading, error } = useGetMyBidsQuery();
    const bids = data?.bids || [];

    const acceptedProjectBids = bids.filter(
        (bid) => bid.status === 'accepted' && bid.projectId?._id
    );

    return (
        <Container className='py-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Accepted Projects</h2>
                <Button as={Link} to='/developer/dashboard' variant='outline-secondary' size='sm'>
                    Back to Dashboard
                </Button>
            </div>

            {isLoading ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : error ? (
                <Alert variant='danger'>
                    {error?.data?.message || error?.error || 'Error fetching accepted projects'}
                </Alert>
            ) : acceptedProjectBids.length === 0 ? (
                <Alert variant='info'>No accepted projects yet.</Alert>
            ) : (
                <Row>
                    {acceptedProjectBids.map((bid) => (
                        <Col key={bid._id} sm={12} md={6} lg={4} className='mb-4'>
                            <Card className='h-100 shadow-sm'>
                                <Card.Body>
                                    <Card.Title>{bid.projectId?.title || 'Project'}</Card.Title>

                                    <Card.Text>
                                        <strong>Status:</strong>{' '}
                                        <Badge bg='success'>accepted</Badge>
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Your Bid Amount:</strong> ${bid.bidAmount}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Delivery Time:</strong> {bid.deliveryTime} days
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Project Budget:</strong>{' '}
                                        ${bid.projectId?.budget?.min} - ${bid.projectId?.budget?.max}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Deadline:</strong>{' '}
                                        {bid.projectId?.deadline
                                            ? new Date(bid.projectId.deadline).toLocaleDateString()
                                            : 'N/A'}
                                    </Card.Text>

                                    {bid.projectId?.submission?.submittedAt ? (
                                        <Alert variant='success' className='py-2'>
                                            Project submitted on{' '}
                                            {new Date(bid.projectId.submission.submittedAt).toLocaleDateString()}.
                                            <br />
                                            {bid.projectId.submission.link && (
                                                <>
                                                    Link:{' '}
                                                    <a href={bid.projectId.submission.link} target='_blank' rel='noreferrer'>
                                                        Open submission
                                                    </a>
                                                </>
                                            )}
                                        </Alert>
                                    ) : (
                                        <Button
                                            as={Link}
                                            to={`/projects/${bid.projectId?._id}/submit`}
                                            variant='success'
                                            size='sm'
                                        >
                                            Submit Project
                                        </Button>
                                    )}

                                    {bid.projectId?.submission?.clientDecision?.status && (
                                        <Alert
                                            variant={
                                                bid.projectId.submission.clientDecision.status === 'accepted'
                                                    ? 'success'
                                                    : bid.projectId.submission.clientDecision.status === 'rejected'
                                                        ? 'danger'
                                                        : 'warning'
                                            }
                                            className='py-2'
                                        >
                                            <strong>Client Decision:</strong>{' '}
                                            {bid.projectId.submission.clientDecision.status}
                                            {bid.projectId.submission.clientDecision.note && (
                                                <>
                                                    <br />
                                                    <strong>Client Note:</strong>{' '}
                                                    {bid.projectId.submission.clientDecision.note}
                                                </>
                                            )}
                                        </Alert>
                                    )}

                                    {bid.projectId?.submission?.clientDecision?.status === 'rejected' && (
                                        <Button
                                            as={Link}
                                            to={`/projects/${bid.projectId?._id}/submit`}
                                            variant='warning'
                                            size='sm'
                                        >
                                            Resubmit Project
                                        </Button>
                                    )}

                                    <div className='mt-2'>
                                        <Button
                                            as={Link}
                                            to={`/projects/${bid.projectId?._id}`}
                                            variant='dark'
                                            size='sm'
                                        >
                                            View Project
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default AcceptedProjectsPage;
