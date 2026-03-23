import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    useGetMyBidsQuery,
    useDeleteBidMutation,
} from '../../api/bidApiSlice';
import getErrorMessage from '../../utils/getErrorMessage';

function MyBidsPage() {
    const { data, isLoading, error } = useGetMyBidsQuery();
    const [deleteBid, { isLoading: loadingDelete }] = useDeleteBidMutation();

    const bids = data?.bids || [];

    const deleteHandler = async (bidId) => {
        if (window.confirm('Are you sure you want to delete this bid?')) {
            try {
                const res = await deleteBid(bidId).unwrap();
                toast.success(res?.message || 'Bid deleted successfully');
            } catch (err) {
                toast.error(getErrorMessage(err, 'Unable to delete bid'));
            }
        }
    };

    return (
        <Container className='py-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>My Bids</h2>
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
                    {error?.data?.message || error?.error || 'Error fetching your bids'}
                </Alert>
            ) : bids.length === 0 ? (
                <Alert variant='info'>You have not placed any bids yet.</Alert>
            ) : (
                <Row>
                    {bids.map((bid) => (
                        <Col key={bid._id} sm={12} md={6} lg={4} className='mb-4'>
                            <Card className='h-100 shadow-sm'>
                                <Card.Body>
                                    <Card.Title>
                                        {bid.projectId?.title || 'Project'}
                                    </Card.Title>

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
                                        {bid.proposal?.length > 120
                                            ? `${bid.proposal.substring(0, 120)}...`
                                            : bid.proposal}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Edit Count:</strong> {bid.editCount}
                                    </Card.Text>

                                    <div className='d-flex gap-2 flex-wrap'>
                                        <Button
                                            as={Link}
                                            to={`/projects/${bid.projectId?._id}`}
                                            variant='dark'
                                            size='sm'
                                        >
                                            View Project
                                        </Button>

                                        {bid.status === 'pending' && bid.editCount < 2 && (
                                            <Button
                                                as={Link}
                                                to={`/bids/${bid._id}/edit`}
                                                variant='warning'
                                                size='sm'
                                            >
                                                Edit Bid
                                            </Button>
                                        )}

                                        <Button
                                            variant='danger'
                                            size='sm'
                                            disabled={loadingDelete || bid.status !== 'pending'}
                                            onClick={() => deleteHandler(bid._id)}
                                        >
                                            {loadingDelete ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </div>

                                    {bid.status === 'pending' && bid.editCount >= 2 && (
                                        <Alert variant='info' className='mt-3 mb-0 py-2'>
                                            You have reached the maximum number of allowed bid edits for this project.
                                        </Alert>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default MyBidsPage;
