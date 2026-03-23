import { Container, Spinner, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProjectByIdQuery, useUpdateProjectMutation } from '../../api/projectApiSlice';
import getErrorMessage from '../../utils/getErrorMessage';
import Button from '../../components/ui/Button';
import ProjectForm from '../../components/projects/ProjectForm';

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
        <ProjectForm
            values={{ title, description, budgetMin, budgetMax, skillsRequired, deadline }}
            onFieldChange={(field, value) => {
                if (field === 'title') setTitle(value);
                if (field === 'description') setDescription(value);
                if (field === 'budgetMin') setBudgetMin(value);
                if (field === 'budgetMax') setBudgetMax(value);
                if (field === 'skillsRequired') setSkillsRequired(value);
                if (field === 'deadline') setDeadline(value);
            }}
            onSubmit={submitHandler}
            isLoading={loadingUpdate}
            submitLabel='Update Project'
            minDate={getTomorrowDateString()}
        />
    );
}

function EditProjectPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetProjectByIdQuery(projectId);
    const [updateProject, { isLoading: loadingUpdate }] = useUpdateProjectMutation();
    const project = data?.project;

    return (
        <div className="public-page">
            <Container>
                <section className="project-editor-layout">
                    <div className="project-editor-main">
                        <section className="page-intro">
                            <div className="page-intro__copy">
                                <span className="eyebrow">Client workflow</span>
                                <h1 className="page-title page-title--compact">Edit Project</h1>
                                <p className="page-subtitle">
                                    Update the brief without losing your current structure, validation, or marketplace visibility.
                                </p>
                            </div>
                            <div className="page-actions">
                                <Button as={Link} to="/my-projects" tone="light">
                                    Back to My Projects
                                </Button>
                            </div>
                        </section>

                        {isLoading ? (
                            <div className="loading-state">
                                <Spinner animation='border' />
                            </div>
                        ) : error ? (
                            <Alert variant='danger'>{error?.data?.message || error?.error || 'Error fetching project'}</Alert>
                        ) : !project ? (
                            <div className="empty-state">Project not found.</div>
                        ) : (
                            <article className="detail-card project-editor-card">
                                <EditProjectForm
                                    key={project._id}
                                    project={project}
                                    projectId={projectId}
                                    loadingUpdate={loadingUpdate}
                                    updateProject={updateProject}
                                    navigate={navigate}
                                />
                            </article>
                        )}
                    </div>

                    <aside className="project-editor-side">
                        <article className="surface-card project-note-card">
                            <span className="eyebrow">Editing guidance</span>
                            <h2 className="section-title mt-3">Keep updates developer-friendly</h2>
                            <ul className="project-step-list">
                                <li>Only expand scope if the budget and deadline still match the work.</li>
                                <li>Update the skills list if the required stack has changed materially.</li>
                                <li>Clarify any delivery expectations before new bids or edits come in.</li>
                            </ul>
                        </article>

                        {project ? (
                            <article className="surface-card surface-card--soft project-note-card">
                                <span className="eyebrow">Current status</span>
                                <p className="page-subtitle mt-3 mb-0">
                                    This project is currently marked as <strong>{project.status}</strong>. Changes here update what developers and your workspace see.
                                </p>
                            </article>
                        ) : null}
                    </aside>
                </section>
            </Container>
        </div>
    );
}

export default EditProjectPage;
