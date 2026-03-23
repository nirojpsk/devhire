import { Container, Card, Row, Col, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetBidsForProjectQuery, useAcceptBidMutation, useRejectBidMutation } from '../../api/bidApiSlice';
import getErrorMessage from '../../utils/getErrorMessage';

function ProjectBidsPage() {
    const { projectId } = useParams();

    const { data, isLoading, error } = useGetBidsForProjectQuery(projectId);
    const [acceptBid, { isLoading: loadingAccept }] = useAcceptBidMutation();
    const [rejectBid, { isLoading: loadingReject }] = useRejectBidMutation();

    const bids = data?.bids || [];
    const hasAcceptedBid = bids.some((bid) => bid.status === 'accepted');

    const acceptHandler = async (bidId) => {
        try {
            const res = await acceptBid(bidId).unwrap();
            toast.success(res?.message || 'Bid accepted successfully');
        } catch (err) {
            toast.error(getErrorMessage(err, 'Unable to accept bid'));
        }
    };

    const rejectHandler = async (bidId) => {
        try {
            const res = await rejectBid(bidId).unwrap();
            toast.success(res?.message || 'Bid rejected successfully');
        } catch (err) {
            toast.error(getErrorMessage(err, 'Unable to reject bid'));
        }
    };

    return (
        <Container className='py-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Project Bids</h2>
                <Button as={Link} to={`/projects/${projectId}`} variant='outline-secondary' size='sm'>
                    Back to Project
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
                <Alert variant='info'>No bids found for this project yet.</Alert>
            ) : (
                <>
                    {hasAcceptedBid && (
                        <Alert variant='info'>
                            A bid has already been accepted for this project. Remaining bids can no longer be accepted.
                        </Alert>
                    )}

                    <Row>
                        {bids.map((bid) => (
                            <Col key={bid._id} sm={12} md={6} lg={4} className='mb-4'>
                                <Card className='h-100 shadow-sm'>
                                    <Card.Body>
                                        <Card.Title>
                                            {bid.developerId?.name || 'Developer'}
                                        </Card.Title>

                                    <Card.Text>
                                        <strong>Email:</strong>{' '}
                                        {bid.developerId?.email || 'N/A'}
                                    </Card.Text>

                                    {bid.developerId?._id && (
                                        <div className='mb-2'>
                                            <Button
                                                as={Link}
                                                to={`/developers/${bid.developerId._id}/profile`}
                                                variant='outline-primary'
                                                size='sm'
                                            >
                                                View Profile
                                            </Button>
                                        </div>
                                    )}

                                        <Card.Text>
                                            <strong>Bid Amount:</strong> ${bid.bidAmount}
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Delivery Time:</strong> {bid.deliveryTime} days
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Status:</strong>{' '}
                                            <Badge bg='secondary'>{bid.status}</Badge>
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Proposal:</strong>
                                            <br />
                                            {bid.proposal}
                                        </Card.Text>

                                        <div className='d-flex gap-2 flex-wrap'>
                                            <Button
                                                variant='success'
                                                size='sm'
                                                disabled={loadingAccept || bid.status !== 'pending' || hasAcceptedBid}
                                                onClick={() => acceptHandler(bid._id)}
                                            >
                                                {loadingAccept ? 'Accepting...' : 'Accept'}
                                            </Button>

                                            <Button
                                                variant='danger'
                                                size='sm'
                                                disabled={loadingReject || bid.status !== 'pending'}
                                                onClick={() => rejectHandler(bid._id)}
                                            >
                                                {loadingReject ? 'Rejecting...' : 'Reject'}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default ProjectBidsPage;
