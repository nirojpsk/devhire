import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetClientBidsQuery } from '../../api/bidApiSlice';

function ClientBidsPage() {
    const { data, isLoading, error } = useGetClientBidsQuery();
    const bids = data?.bids || [];

    const statusVariant = (status) => {
        if (status === 'accepted') return 'success';
        if (status === 'rejected') return 'danger';
        return 'secondary';
    };

    return (
        <Container className='py-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>All Bids</h2>
                <Button as={Link} to='/client/dashboard' variant='outline-secondary' size='sm'>
                    Back to Dashboard
                </Button>
            </div>

            {isLoading ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : error ? (
                <Alert variant='danger'>
                    {error?.data?.message || error?.error || 'Error fetching bids'}
                </Alert>
            ) : bids.length === 0 ? (
                <Alert variant='info'>No bids found for your projects yet.</Alert>
            ) : (
                <Row>
                    {bids.map((bid) => (
                        <Col key={bid._id} sm={12} md={6} lg={4} className='mb-4'>
                            <Card className='h-100 shadow-sm'>
                                <Card.Body>
                                    <Card.Title>{bid.projectId?.title || 'Project'}</Card.Title>
                                    <Card.Text>
                                        <strong>Developer:</strong> {bid.developerId?.name || 'N/A'}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Email:</strong> {bid.developerId?.email || 'N/A'}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Bid Amount:</strong> ${bid.bidAmount}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Delivery Time:</strong> {bid.deliveryTime} days
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Status:</strong>{' '}
                                        <Badge bg={statusVariant(bid.status)}>{bid.status}</Badge>
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Proposal:</strong>
                                        <br />
                                        {bid.proposal?.length > 120
                                            ? `${bid.proposal.substring(0, 120)}...`
                                            : bid.proposal}
                                    </Card.Text>

                                    <div className='d-flex gap-2 flex-wrap'>
                                        <Button
                                            as={Link}
                                            to={`/projects/${bid.projectId?._id}/bids`}
                                            variant='primary'
                                            size='sm'
                                        >
                                            Manage Bid
                                        </Button>
                                        <Button
                                            as={Link}
                                            to={`/projects/${bid.projectId?._id}`}
                                            variant='outline-dark'
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

export default ClientBidsPage;
