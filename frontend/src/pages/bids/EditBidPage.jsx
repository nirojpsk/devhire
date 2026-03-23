import { Form, Button, Container, Spinner, Alert, Card } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    useGetBidByIdQuery,
    useUpdateBidMutation,
} from '../../api/bidApiSlice';
import getErrorMessage from '../../utils/getErrorMessage';

function EditBidForm({ bid, bidId, loadingUpdate, updateBid, navigate, isEditLimitReached, remainingDays }) {
    const [bidAmount, setBidAmount] = useState(() => bid.bidAmount || '');
    const [proposal, setProposal] = useState(() => bid.proposal || '');
    const [deliveryTime, setDeliveryTime] = useState(() => bid.deliveryTime || '');

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

        if (remainingDays !== null && Number(deliveryTime) > remainingDays) {
            toast.error(`Delivery time must be within the project deadline (${remainingDays} day(s) left)`);
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
            toast.error(getErrorMessage(err, 'Unable to update bid'));
        }
    };

    return (
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

                {isEditLimitReached && (
                    <Alert variant='info' className='py-2'>
                        You have reached the maximum number of allowed bid edits for this project.
                    </Alert>
                )}

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
                        {remainingDays !== null && (
                            <Form.Text muted>
                                You must deliver within {remainingDays} day(s) based on the project deadline.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <div className='d-flex gap-2 flex-wrap'>
                        <Button
                            type='submit'
                            className='btn btn-sm'
                            disabled={loadingUpdate || isEditLimitReached}
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
    );
}

function EditBidPage() {
    const { bidId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetBidByIdQuery(bidId);
    const [updateBid, { isLoading: loadingUpdate }] = useUpdateBidMutation();

    const bid = data?.bid;
    const backTo = bid?.projectId?._id ? `/projects/${bid.projectId._id}` : '/my-bids';
    const isEditLimitReached = bid?.editCount >= 2;
    const remainingDays = bid?.projectId?.deadline
        ? Math.ceil((new Date(bid.projectId.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <Container className='py-4' style={{ maxWidth: '800px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Edit Bid</h2>
                <Button as={Link} to={backTo} variant='outline-secondary' size='sm'>
                    Back
                </Button>
            </div>

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
                <EditBidForm
                    key={bid._id}
                    bid={bid}
                    bidId={bidId}
                    loadingUpdate={loadingUpdate}
                    updateBid={updateBid}
                    navigate={navigate}
                    isEditLimitReached={isEditLimitReached}
                    remainingDays={remainingDays}
                />
            )}
        </Container>
    );
}

export default EditBidPage;
