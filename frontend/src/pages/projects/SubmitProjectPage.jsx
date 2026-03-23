import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProjectByIdQuery, useSubmitProjectMutation } from '../../api/projectApiSlice';
import { useSelector } from 'react-redux';
import getErrorMessage from '../../utils/getErrorMessage';

function SubmitProjectPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const { data, isLoading, error } = useGetProjectByIdQuery(projectId);
    const [submitProject, { isLoading: loadingSubmit }] = useSubmitProjectMutation();

    const [link, setLink] = useState('');
    const [note, setNote] = useState('');

    const project = data?.project;
    const isSelectedDeveloper =
        userInfo?.role === 'developer' &&
        String(project?.selectedDeveloper?._id) === String(userInfo?.id);
    const submissionDecision = project?.submission?.clientDecision?.status;
    const alreadySubmitted = !!project?.submission?.submittedAt;
    const canResubmit = alreadySubmitted && submissionDecision === 'rejected';

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!link.trim()) {
            toast.error('Please provide the project submission link');
            return;
        }

        try {
            const res = await submitProject({
                projectId,
                data: {
                    link: link.trim(),
                    note: note.trim(),
                },
            }).unwrap();

            toast.success(res?.message || 'Project submitted successfully');
            navigate('/developer/accepted-projects');
        } catch (err) {
            toast.error(getErrorMessage(err, 'Unable to submit project'));
        }
    };

    return (
        <Container className='py-4' style={{ maxWidth: '800px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='mb-0'>Submit Project</h2>
                <Button as={Link} to='/developer/accepted-projects' variant='outline-secondary' size='sm'>
                    Back to Accepted Projects
                </Button>
            </div>

            {isLoading ? (
                <div className='text-center'>
                    <Spinner animation='border' />
                </div>
            ) : error ? (
                <Alert variant='danger'>
                    {error?.data?.message || error?.error || 'Error fetching project'}
                </Alert>
            ) : !project ? (
                <Alert variant='info'>Project not found.</Alert>
            ) : !isSelectedDeveloper ? (
                <Alert variant='danger'>You are not authorized to submit this project.</Alert>
            ) : alreadySubmitted && !canResubmit ? (
                <Alert variant='info'>
                    This project has already been submitted.
                    {project.submission?.link && (
                        <>
                            {' '}Submission link:{' '}
                            <a href={project.submission.link} target='_blank' rel='noreferrer'>
                                {project.submission.link}
                            </a>
                        </>
                    )}
                    {project.submission?.clientDecision?.status && (
                        <>
                            <br />
                            <strong>Client Decision:</strong>{' '}
                            {project.submission.clientDecision.status}
                            {project.submission.clientDecision.note && (
                                <>
                                    <br />
                                    <strong>Client Note:</strong>{' '}
                                    {project.submission.clientDecision.note}
                                </>
                            )}
                        </>
                    )}
                </Alert>
            ) : canResubmit ? (
                <Card className='shadow-sm'>
                    <Card.Body>
                        <Card.Title className='mb-3'>{project.title}</Card.Title>
                        <Alert variant='warning'>
                            Your previous submission was rejected by the client. You can submit an updated project link.
                            {project.submission?.clientDecision?.note && (
                                <>
                                    <br />
                                    <strong>Client Note:</strong> {project.submission.clientDecision.note}
                                </>
                            )}
                        </Alert>

                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='projectLink' className='my-3'>
                                <Form.Label>Updated Project Link</Form.Label>
                                <Form.Control
                                    type='url'
                                    placeholder='https://github.com/username/repo or deployed app link'
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId='submissionNote' className='my-3'>
                                <Form.Label>Updated Submission Note (Optional)</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={4}
                                    placeholder='Add updates based on client feedback'
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </Form.Group>

                            <Button type='submit' className='btn btn-sm' disabled={loadingSubmit}>
                                {loadingSubmit ? 'Submitting...' : 'Resubmit Project'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            ) : (
                <Card className='shadow-sm'>
                    <Card.Body>
                        <Card.Title className='mb-3'>{project.title}</Card.Title>
                        <Card.Text>
                            Submit the final project link once your work is complete. You can submit only once.
                        </Card.Text>

                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='projectLink' className='my-3'>
                                <Form.Label>Project Link</Form.Label>
                                <Form.Control
                                    type='url'
                                    placeholder='https://github.com/username/repo or deployed app link'
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId='submissionNote' className='my-3'>
                                <Form.Label>Submission Note (Optional)</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={4}
                                    placeholder='Add any notes for the client'
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </Form.Group>

                            <Button type='submit' className='btn btn-sm' disabled={loadingSubmit}>
                                {loadingSubmit ? 'Submitting...' : 'Submit Project'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default SubmitProjectPage;
