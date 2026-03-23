import { useState } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProjectByIdQuery, useSubmitProjectMutation } from '../../api/projectApiSlice';
import { useSelector } from 'react-redux';
import getErrorMessage from '../../utils/getErrorMessage';
import Button from '../../components/ui/Button';
import ProjectStatusBadge from '../../components/projects/ProjectStatusBadge';

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
        <div className="dashboard-screen">
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Developer delivery</span>
                    <h1 className="page-title page-title--compact">Submit Project</h1>
                    <p className="page-subtitle">
                        Share your final delivery link and context with a clearer submission workspace.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to='/developer/accepted-projects' tone="light">
                        Back to Accepted Projects
                    </Button>
                </div>
            </section>

            {isLoading ? (
                <div className="loading-state">
                    <Spinner animation='border' />
                </div>
            ) : error ? (
                <Alert variant='danger'>
                    {error?.data?.message || error?.error || 'Error fetching project'}
                </Alert>
            ) : !project ? (
                <div className="empty-state">Project not found.</div>
            ) : !isSelectedDeveloper ? (
                <Alert variant='danger'>You are not authorized to submit this project.</Alert>
            ) : alreadySubmitted && !canResubmit ? (
                <div className="project-editor-layout">
                    <div className="project-editor-main">
                        <section className="profile-hero surface-card animate-in">
                            <div className="profile-hero__main">
                                <div className="page-actions">
                                    <ProjectStatusBadge status={project.status} />
                                </div>
                                <h1 className="profile-title">{project.title}</h1>
                                <p className="profile-lead">This project has already been submitted and is currently locked.</p>
                            </div>
                        </section>

                        <article className="detail-card profile-card">
                            <div className="detail-card__section">
                                <Alert variant='info' className="mb-0">
                                    This project has already been submitted.
                                    {project.submission?.link ? (
                                        <>
                                            {' '}Submission link:{' '}
                                            <a href={project.submission.link} target='_blank' rel='noreferrer'>
                                                {project.submission.link}
                                            </a>
                                        </>
                                    ) : null}
                                    {project.submission?.clientDecision?.status ? (
                                        <>
                                            <br />
                                            <strong>Client Decision:</strong>{' '}
                                            {project.submission.clientDecision.status}
                                            {project.submission.clientDecision.note ? (
                                                <>
                                                    <br />
                                                    <strong>Client Note:</strong>{' '}
                                                    {project.submission.clientDecision.note}
                                                </>
                                            ) : null}
                                        </>
                                    ) : null}
                                </Alert>
                            </div>
                        </article>
                    </div>

                    <aside className="project-editor-side">
                        <article className="surface-card project-note-card">
                            <span className="eyebrow">Submission status</span>
                            <p className="page-subtitle mt-3 mb-0">
                                The delivery is already with the client. If changes are requested, this page will reopen for resubmission.
                            </p>
                        </article>
                    </aside>
                </div>
            ) : (
                <div className="project-editor-layout">
                    <div className="project-editor-main">
                        <section className="profile-hero surface-card animate-in">
                            <div className="profile-hero__main">
                                <div className="page-actions">
                                    <ProjectStatusBadge status={project.status} />
                                    <span className="app-chip">{project.selectedDeveloper?.name || "Assigned developer"}</span>
                                </div>
                                <h1 className="profile-title">{project.title}</h1>
                                <p className="profile-lead">
                                    {canResubmit
                                        ? "Your previous submission was rejected. Share an updated delivery link and explain what changed."
                                        : "Submit the final project link once your work is complete. You can submit only once unless the client requests changes."}
                                </p>
                            </div>
                        </section>

                        {canResubmit && project.submission?.clientDecision?.note ? (
                            <div className="submission-banner">
                                <strong>Client Note:</strong> {project.submission.clientDecision.note}
                            </div>
                        ) : null}

                        <article className="detail-card profile-card project-editor-card">
                            <Form onSubmit={submitHandler} className="auth-form">
                                <Form.Group controlId='projectLink'>
                                    <Form.Label>{canResubmit ? 'Updated Project Link' : 'Project Link'}</Form.Label>
                                    <Form.Control
                                        type='url'
                                        placeholder='https://github.com/username/repo or deployed app link'
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId='submissionNote'>
                                    <Form.Label>{canResubmit ? 'Updated Submission Note (Optional)' : 'Submission Note (Optional)'}</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        rows={4}
                                        placeholder={canResubmit ? 'Add updates based on client feedback' : 'Add any notes for the client'}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="form-actions">
                                    <Button type='submit' disabled={loadingSubmit}>
                                        {loadingSubmit ? 'Submitting...' : canResubmit ? 'Resubmit Project' : 'Submit Project'}
                                    </Button>
                                </div>
                            </Form>
                        </article>
                    </div>

                    <aside className="project-editor-side">
                        <article className="surface-card project-note-card">
                            <span className="eyebrow">Delivery checklist</span>
                            <ul className="project-step-list">
                                <li>Share a production URL, repository, or combined handoff link.</li>
                                <li>Use the note field for credentials, demo steps, or review instructions.</li>
                                <li>If the client rejects the submission, this page will reopen for a revised handoff.</li>
                            </ul>
                        </article>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default SubmitProjectPage;
