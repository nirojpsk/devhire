import { Container, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProjectByIdQuery, useUpdateProjectMutation } from '../../api/projectApiSlice';

function EditProjectPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetProjectByIdQuery(projectId);
    const [updateProject, { isLoading: loadingUpdate }] = useUpdateProjectMutation();
    const project = data?.project;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [skillsRequired, setSkillsRequired] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        if (project) {
            setTitle(project.title || '');
            setDescription(project.description || '');
            setBudgetMin(project.budget?.min || '');
            setBudgetMax(project.budget?.max || '');
            setSkillsRequired(project.skillsRequired?.join(',') || '');
            setDeadline(
                project.deadline ? new Date(project.deadline).toISOString().split('T')[0]
                    : ''
            );
        }
    }, [project]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!title || !description || !budgetMin || !budgetMax || !skillsRequired || !deadline) {
            toast.error('Please fill all the required fields');
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

        try {
            const res = await updateProject({
                projectId,
                data: {
                    title,
                    description,
                    budget: {
                        min: Number(budgetMin),
                        max: Number(budgetMax),
                    },
                    skillsRequired: skillsArray,
                    deadline,
                },
            }).unwrap();

            toast.success(res?.message || 'Project updated successfully');
            navigate('/my-projects');
        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.data?.error ||
                err?.error ||
                'Error updating project'
            );
        }
    }
    return (
        <Container className='py-2' style={{ maxWidth: '700px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Edit Project</h2>
                <Button as={Link} to='/my-projects' variant='outline-secondary' size='sm'>
                    Back to My Projects
                </Button>
            </div>

            {isLoading ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : error ? (
                <Alert variant='danger'>{error?.data?.message || error?.error || 'Error fetching project'}</Alert>
            ) : !project ? (
                <Alert variant='info'>Project not found.</Alert>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='title' className='my-3'>
                        <Form.Label>Project Title</Form.Label>
                        <Form.Control
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Enter project title'
                        />
                    </Form.Group>

                    <Form.Group controlId='description' className='my-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Describe your project'
                        />
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
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </Form.Group>

                    <Button type='submit' className='btn btn-sm' disabled={loadingUpdate}>
                        {loadingUpdate ? 'Updating...' : 'Update Project'}
                    </Button>
                </Form>
            )}
        </Container>

    );
};

export default EditProjectPage;
