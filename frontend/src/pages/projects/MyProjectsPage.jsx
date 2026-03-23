import { Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetMyProjectsQuery, useDeleteProjectMutation } from "../../api/projectApiSlice";
import { toast } from "react-toastify";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";
import ProjectStatusBadge from "../../components/projects/ProjectStatusBadge";

function MyProjectsPage() {
    const { data, isLoading, error } = useGetMyProjectsQuery();
    const [deleteProject, { isLoading: loadingDelete }] = useDeleteProjectMutation();
    const projects = data?.projects || [];

    const openProjects = projects.filter((project) => project.status === "open").length;
    const activeProjects = projects.filter((project) => project.status === "in-progress").length;
    const completedProjects = projects.filter((project) => project.status === "completed").length;

    const deleteHandler = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                const res = await deleteProject(projectId).unwrap();
                toast.success(res?.message || "Project deleted successfully");
            } catch (err) {
                toast.error(getErrorMessage(err, "Unable to delete project"));
            }
        }
    };

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Client projects</span>
                    <h1 className="page-title page-title--compact">My Projects</h1>
                    <p className="page-subtitle">
                        Review every posted project in a roomier layout with clearer metadata, developer context, and actions.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/client/dashboard" tone="light">
                        Back to Dashboard
                    </Button>
                    <Button as={Link} to="/projects/create">
                        Post Project
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Total Projects</div>
                    <div className="stats-card__value">{projects.length}</div>
                    <p className="metric-note">Everything you have published so far</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Open</div>
                    <div className="stats-card__value">{openProjects}</div>
                    <p className="metric-note">Still receiving bids from developers</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">In Progress</div>
                    <div className="stats-card__value">{activeProjects}</div>
                    <p className="metric-note">Already paired with a selected developer</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Completed</div>
                    <div className="stats-card__value">{completedProjects}</div>
                    <p className="metric-note">Successfully delivered projects</p>
                </article>
            </section>

            <section className="dashboard-section">
                {isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">
                        {error?.data?.message || error?.error || "Error fetching your projects"}
                    </Alert>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        You have not created any projects yet. Post a project to start receiving proposals.
                    </div>
                ) : (
                    <div className="dashboard-stack">
                        {projects.map((project) => (
                            <article key={project._id} className="dashboard-card dashboard-list-card interactive-card">
                                <div className="dashboard-list-card__main">
                                    <div className="page-actions">
                                        <ProjectStatusBadge status={project.status} />
                                        {project.skillsRequired?.slice(0, 3).map((skill) => (
                                            <span key={skill} className="app-chip">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <h2 className="dashboard-list-card__title">{project.title}</h2>
                                    <p>
                                        {project.description?.length > 220
                                            ? `${project.description.slice(0, 220)}...`
                                            : project.description}
                                    </p>

                                    <div className="meta-row">
                                        <span><strong>Budget:</strong> ${project.budget?.min} - ${project.budget?.max}</span>
                                        <span><strong>Selected Developer:</strong> {project.selectedDeveloper?.name || "Not selected yet"}</span>
                                        <span><strong>Skills:</strong> {project.skillsRequired?.join(", ") || "N/A"}</span>
                                    </div>

                                    {project.selectedDeveloper?._id ? (
                                        <div className="page-actions">
                                            <Button
                                                as={Link}
                                                to={`/developers/${project.selectedDeveloper._id}/profile`}
                                                tone="light"
                                            >
                                                View Selected Developer Profile
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="dashboard-list-card__aside">
                                    <Button as={Link} to={`/projects/${project._id}`}>
                                        View Details
                                    </Button>

                                    <Button as={Link} to={`/projects/${project._id}/edit`} tone="light">
                                        Edit Project
                                    </Button>

                                    <Button
                                        tone="danger"
                                        disabled={loadingDelete || project.status !== "open"}
                                        onClick={() => deleteHandler(project._id)}
                                    >
                                        {loadingDelete ? "Deleting..." : "Delete Project"}
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default MyProjectsPage;
