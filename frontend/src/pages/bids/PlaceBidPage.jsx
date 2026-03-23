import { usePlaceBidMutation } from "../../api/bidApiSlice";
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useState } from "react";
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetProjectByIdQuery } from "../../api/projectApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";
import { useGetDeveloperProfileQuery } from "../../api/developerApiSlice";


function PlaceBidPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [bidAmount, setBidAmount] = useState('');
    const [proposal, setProposal] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    const [placeBid, { isLoading }] = usePlaceBidMutation();
    const { data: projectData } = useGetProjectByIdQuery(projectId);
    const { data: developerProfileData, isLoading: loadingDeveloperProfile } = useGetDeveloperProfileQuery();
    const project = projectData?.project;
    const developerProfile = developerProfileData?.profile;
    const hasDeveloperProfile = !!developerProfile;
    const isDeveloperBusy = developerProfile?.availability === "busy";
    const remainingDays = project?.deadline
        ? Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!bidAmount || !proposal || !deliveryTime) {
            toast.error('Please fill all required fields');
            return;
        }

        if (isDeveloperBusy) {
            toast.error('Your availability is set to busy. Change it back to available before placing a bid.');
            return;
        }

        if (Number(bidAmount) <= 0) {
            toast.error('Bid amount must be greater than 0');
            return;
        }

        if (proposal.trim().length < 50) {
            toast.error('Proposal must be at least 50 characters');
            return;
        }

        if (project?.budget?.min !== undefined && Number(bidAmount) < Number(project.budget.min)) {
            toast.error(`Bid amount cannot be less than the project minimum budget ($${project.budget.min})`);
            return;
        }

        if (Number(deliveryTime) <= 0) {
            toast.error('Delivery time must be greater than 0');
            return;
        }

        if (remainingDays !== null && Number(deliveryTime) > remainingDays) {
            toast.error(`Delivery time must be within the project deadline (${remainingDays} day(s) left)`);
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
            toast.error(getErrorMessage(err, 'Unable to place bid'));
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '700px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Place Bid</h2>
                <Button as={Link} to={`/projects/${projectId}`} variant='outline-secondary' size='sm'>
                    Back to Project
                </Button>
            </div>
            {loadingDeveloperProfile ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : !hasDeveloperProfile ? (
                <Alert variant='warning'>
                    Please create your developer profile before placing a bid.{' '}
                    <Link to='/developer/profile/create'>Create Profile</Link>
                </Alert>
            ) : isDeveloperBusy ? (
                <Alert variant='warning'>
                    Your availability is currently set to busy.{' '}
                    <Link to='/developer/profile/edit'>Change it back to available</Link>{' '}
                    before placing a new bid.
                </Alert>
            ) : (
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='bidAmount' className='my-3'>
                    <Form.Label>Bid Amount</Form.Label>
                    <Form.Control
                        type='number'
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder='Enter your bid amount'
                    />
                    {project?.budget && (
                        <Form.Text muted>
                            Project budget range: ${project.budget.min} - ${project.budget.max}
                        </Form.Text>
                    )}
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

                <Button type='submit' className='btn btn-sm' disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Place Bid'}
                </Button>
            </Form>
            )}
        </Container>
    );
};

export default PlaceBidPage;
