import { Container, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProjectByIdQuery, useUpdateProjectMutation } from '../../api/projectApiSlice';
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

function EditProjectForm({ project, projectId, loadingUpdate, updateProject, navigate }) {
    const [title, setTitle] = useState(() => project.title || '');
    const [description, setDescription] = useState(() => project.description || '');
    const [budgetMin, setBudgetMin] = useState(() => project.budget?.min || '');
    const [budgetMax, setBudgetMax] = useState(() => project.budget?.max || '');
    const [skillsRequired, setSkillsRequired] = useState(() => project.skillsRequired?.join(',') || '');
    const [deadline, setDeadline] = useState(() =>
        project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : ''
    );

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

        if (!isFutureDate(deadline)) {
            toast.error('Deadline must be a future date');
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
            toast.error(getErrorMessage(err, 'Unable to update project'));
        }
    };

    return (
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
                    min={getTomorrowDateString()}
                    onChange={(e) => setDeadline(e.target.value)}
                />
            </Form.Group>

            <Button type='submit' className='btn btn-sm' disabled={loadingUpdate}>
                {loadingUpdate ? 'Updating...' : 'Update Project'}
            </Button>
        </Form>
    );
}

function EditProjectPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetProjectByIdQuery(projectId);
    const [updateProject, { isLoading: loadingUpdate }] = useUpdateProjectMutation();
    const project = data?.project;

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
                <EditProjectForm
                    key={project._id}
                    project={project}
                    projectId={projectId}
                    loadingUpdate={loadingUpdate}
                    updateProject={updateProject}
                    navigate={navigate}
                />
            )}
        </Container>

    );
}

export default EditProjectPage;
