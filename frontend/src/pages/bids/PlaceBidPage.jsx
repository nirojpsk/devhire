import { usePlaceBidMutation } from "../../api/bidApiSlice";
import { Form, Button, Container } from 'react-bootstrap';
import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';


function PlaceBidPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [bidAmount, setBidAmount] = useState('');
    const [proposal, setProposal] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    const [placeBid, { isLoading }] = usePlaceBidMutation();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!bidAmount || !proposal || !deliveryTime) {
            toast.error('Please fill all required fields');
            return;
        }

        if (Number(bidAmount) <= 0) {
            toast.error('Bid amount must be greater than 0');
            return;
        }

        if (Number(deliveryTime) <= 0) {
            toast.error('Delivery time must be greater than 0');
            return;
        }

        try {
            const res = await placeBid({
                projectId,
                data: {
                    bidAmount: Number(bidAmount),
                    proposal,
                    deliveryTime: Number(deliveryTime),
                },
            }).unwrap();

            toast.success(res?.message || 'Bid placed successfully');
            navigate(`/projects/${projectId}`);
        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.data?.error ||
                err?.error ||
                'Error placing bid'
            );
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '700px' }}>
            <h2 className="mb-4">Place Bid</h2>
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
                        rows={5}
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        placeholder='Explain why you are the right developer for this project'
                    />
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

                <Button type='submit' className='btn btn-sm' disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Place Bid'}
                </Button>
            </Form>
        </Container>
    );
};

export default PlaceBidPage;