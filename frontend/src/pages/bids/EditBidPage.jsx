import { Form, Button, Container, Spinner, Alert, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    useGetBidByIdQuery,
    useUpdateBidMutation,
} from '../../api/bidApiSlice';

function EditBidPage() {
    const { bidId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetBidByIdQuery(bidId);
    const [updateBid, { isLoading: loadingUpdate }] = useUpdateBidMutation();

    const bid = data?.bid;

    const [bidAmount, setBidAmount] = useState('');
    const [proposal, setProposal] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    useEffect(() => {
        if (bid) {
            setBidAmount(bid.bidAmount || '');
            setProposal(bid.proposal || '');
            setDeliveryTime(bid.deliveryTime || '');
        }
    }, [bid]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!bidAmount || !proposal || !deliveryTime) {
            toast.error('Please fill all required fields');
            return;
        }

        if (Number(bidAmount) < 50) {
            toast.error('Bid amount must be at least 50');
            return;
        }

        if (proposal.trim().length < 50) {
            toast.error('Proposal must be at least 50 characters');
            return;
        }

        if (Number(deliveryTime) < 1) {
            toast.error('Delivery time must be at least 1 day');
            return;
        }

        try {
            const res = await updateBid({
                bidId,
                data: {
                    bidAmount: Number(bidAmount),
                    proposal: proposal.trim(),
                    deliveryTime: Number(deliveryTime),
                },
            }).unwrap();

            toast.success(res?.message || 'Bid updated successfully');

            if (bid?.projectId?._id) {
                navigate(`/projects/${bid.projectId._id}`);
            } else {
                navigate('/developer/dashboard');
            }
        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.data?.error ||
                err?.error ||
                'Error updating bid'
            );
        }
    };

    return (
        <Container className='py-4' style={{ maxWidth: '800px' }}>
            <h2 className='mb-4'>Edit Bid</h2>

            {isLoading ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : error ? (
                <Alert variant='danger'>
                    {error?.data?.message || error?.error || 'Error fetching bid'}
                </Alert>
            ) : !bid ? (
                <Alert variant='info'>Bid not found.</Alert>
            ) : (
                <Card className='shadow-sm'>
                    <Card.Body>
                        <Card.Title className='mb-3'>
                            {bid.projectId?.title ? `Project: ${bid.projectId.title}` : 'Edit Your Bid'}
                        </Card.Title>

                        <Card.Text>
                            <strong>Status:</strong> {bid.status}
                        </Card.Text>

                        <Card.Text>
                            <strong>Edit Count:</strong> {bid.editCount}
                        </Card.Text>

                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='bidAmount' className='my-3'>
                                <Form.Label>Bid Amount</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder='Enter your bid amount'
                                />
                            </Form.Group>

                            <Form.Group controlId='proposal' className='my-3'>
                                <Form.Label>Proposal</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={6}
                                    value={proposal}
                                    onChange={(e) => setProposal(e.target.value)}
                                    placeholder='Update your proposal'
                                />
                                <Form.Text muted>
                                    Proposal must be at least 50 characters.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId='deliveryTime' className='my-3'>
                                <Form.Label>Delivery Time (in days)</Form.Label>
                                <Form.Control
                                    type='number'
                                    value={deliveryTime}
                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                    placeholder='Enter delivery time in days'
                                />
                            </Form.Group>

                            <div className='d-flex gap-2 flex-wrap'>
                                <Button
                                    type='submit'
                                    className='btn btn-sm'
                                    disabled={loadingUpdate}
                                >
                                    {loadingUpdate ? 'Updating...' : 'Update Bid'}
                                </Button>

                                <Button
                                    type='button'
                                    variant='outline-secondary'
                                    size='sm'
                                    onClick={() => {
                                        if (bid?.projectId?._id) {
                                            navigate(`/projects/${bid.projectId._id}`);
                                        } else {
                                            navigate('/developer/dashboard');
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default EditBidPage;