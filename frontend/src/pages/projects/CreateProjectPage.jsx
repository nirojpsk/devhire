import { Form, Button, Container } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateProjectMutation } from '../../api/projectApiSlice';
import getErrorMessage from '../../utils/getErrorMessage';

const isFutureDate = (dateValue) => {
    const selectedDate = new Date(dateValue);
    if (Number.isNaN(selectedDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate > today;
};

const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};

function CreateProjectPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [skillsRequired, setSkillsRequired] = useState('');
    const [deadline, setDeadline] = useState('');

    const [createProject, { isLoading }] = useCreateProjectMutation();
    const navigate = useNavigate();


    const submitHandler = async (e) => {
        e.preventDefault();

        if (!title || !description || !budgetMin || !budgetMax || !skillsRequired || !deadline) {
            toast.error('Please fill all required fields');
            return;
        }

        if (Number(budgetMin) > Number(budgetMax)) {
            toast.error('Minimum budget cannot be greater than Maximum budget');
            return;
        }

        const skillsArray = skillsRequired.split(',').map((skill) => skill.trim()).filter((skill) => skill !== '');

        if (skillsArray.length === 0) {
            toast.error('Please enter at least one skill');
            return;
        }

        if (!isFutureDate(deadline)) {
            toast.error('Deadline must be a future date');
            return;
        }

        try {
            const res = await createProject({
                title,
                description,
                budget: {
                    min: Number(budgetMin),
                    max: Number(budgetMax),
                },
                skillsRequired: skillsArray,
                deadline,
            }).unwrap();
            toast.success(res?.message || 'Project created successfully');
            navigate('/client/dashboard');
        } catch (err) {
            toast.error(getErrorMessage(err, 'Unable to create project'));
        }
    };

    return (
        <Container className='py-2' style={{ maxWidth: '700px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Create Project</h2>
                <Button as={Link} to='/client/dashboard' variant='outline-secondary' size='sm'>
                    Back to Dashboard
                </Button>
            </div>

            <Form onSubmit={submitHandler}>

                <Form.Group controlId='title' className='my-3'>
                    <Form.Label>Project Title</Form.Label>
                    <Form.Control type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder='Enter Project Title' />
                </Form.Group>

                <Form.Group controlId='description' className='my-3'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as='textarea' rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder='Describe your Project' />
                </Form.Group>

                <Form.Group controlId='budgetMin' className='my-3'>
                    <Form.Label>Minimum Budget</Form.Label>
                    <Form.Control
                        type='number'
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                        placeholder='Enter minimum budget'
                    />
                </Form.Group>

                <Form.Group controlId='budgetMax' className='my-3'>
                    <Form.Label>Maximum Budget</Form.Label>
                    <Form.Control
                        type='number'
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                        placeholder='Enter maximum budget'
                    />
                </Form.Group>

                <Form.Group controlId='skillsRequired' className='my-3'>
                    <Form.Label>Skills Required</Form.Label>
                    <Form.Control
                        type='text'
                        value={skillsRequired}
                        onChange={(e) => setSkillsRequired(e.target.value)}
                        placeholder='Example: React, Node.js, MongoDB'
                    />
                    <Form.Text muted>
                        Enter skills separated by commas.
                    </Form.Text>
                </Form.Group>

                    <Form.Group controlId='deadline' className='my-3'>
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                        type='date'
                        value={deadline}
                        min={getTomorrowDateString()}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                </Form.Group>

                <Button type='submit' className='btn btn-sm' disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Project'}
                </Button>

            </Form>
        </Container>
    );
}

export default CreateProjectPage;
