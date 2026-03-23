import { Form, Container, Button, Alert, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateDeveloperProfileMutation } from '../../api/developerApiSlice';
import getErrorMessage from '../../utils/getErrorMessage';
import { useGetCurrentUserQuery } from '../../api/authApiSlice';

function CreateDevProfilePage() {
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [experienceYears, setExperienceYears] = useState('');
    const [availability, setAvailability] = useState('available');
    const [portfolio, setPortfolio] = useState('');
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [rate, setRate] = useState('');

    const navigate = useNavigate();
    const [createDeveloperProfile, { isLoading }] = useCreateDeveloperProfileMutation();
    const { isLoading: loadingCurrentUser, error: currentUserError } = useGetCurrentUserQuery();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!bio || !skills || !rate) {
            toast.error("Please fill all required fields");
            return;
        }

        const skillsArray = skills.split(',').map((skill) => skill.trim()).filter((skill) => skill !== '');

        if (skillsArray.length === 0) {
            toast.error("Please enter at least one skill");
            return;
        }

        try {
            const res = await createDeveloperProfile({
                bio,
                skills: skillsArray,
                experienceYears: Number(experienceYears) || 0,
                availability,
                links: {
                    portfolio,
                    github,
                    linkedin,
                },
                rate: Number(rate),
            }).unwrap();
            toast.success(res?.message || "Developer profile created successfully");
            navigate('/developer/profile');
        } catch (err) {
            toast.error(getErrorMessage(err, 'Unable to create developer profile'));
        }
    };

    return (
        <Container className='py-4' style={{ maxWidth: '750px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Create Developer Profile</h2>
                <Button as={Link} to='/developer/dashboard' variant='outline-secondary' size='sm'>
                    Back to Dashboard
                </Button>
            </div>
            {loadingCurrentUser ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : currentUserError?.data?.message === "Your account has been banned" ? (
                <Alert variant='danger'>Your account has been banned</Alert>
            ) : (
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='bio' className='my-3'>
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as='textarea' rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Write a Short Bio' />
                </Form.Group>

                <Form.Group controlId='skills' className='my-3'>
                    <Form.Label>Skills</Form.Label>
                    <Form.Control type='text' value={skills} onChange={(e) => setSkills(e.target.value)} placeholder='React, Node.js, MongoDB' />
                    <Form.Text muted>Enter skills seperated by commas.</Form.Text>
                </Form.Group>

                <Form.Group controlId='experienceYears' className='my-3'>
                    <Form.Label>Experience Years</Form.Label>
                    <Form.Control type='number' value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder='Enter experience years' />
                </Form.Group>

                <Form.Group controlId='availability' className='my-3'>
                    <Form.Label>Availabilty</Form.Label>
                    <Form.Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                        <option value='available'>Available</option>
                        <option value='busy'>Busy</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId='portfolio' className='my-3'>
                    <Form.Label>Portfolio Link</Form.Label>
                    <Form.Control type='text' value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder='https://yourportfolio.com' />
                </Form.Group>

                <Form.Group controlId='github' className='my-3'>
                    <Form.Label>GitHub Link</Form.Label>
                    <Form.Control type='text' value={github} onChange={(e) => setGithub(e.target.value)} placeholder='https://github.com/username' />
                </Form.Group>

                <Form.Group controlId='linkedin' className='my-3'>
                    <Form.Label>LinkedInLink</Form.Label>
                    <Form.Control type='text' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder='https://linkedin.com/in/username' />
                </Form.Group>

                <Form.Group controlId='rate' className='my-3'>
                    <Form.Label>Rate</Form.Label>
                    <Form.Control type='number' value={rate} onChange={(e) => setRate(e.target.value)} placeholder='Enter your rate' />
                </Form.Group>

                <Button type='submit' className='btn btn-sm' disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Profile'}
                </Button>

            </Form>
            )}
        </Container>
    );
};

export default CreateDevProfilePage;
