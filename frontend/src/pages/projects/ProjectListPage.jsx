import { Alert, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetProjectsQuery } from "../../api/projectApiSlice";
import { useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import ProjectStatusBadge from "../../components/projects/ProjectStatusBadge";

function ProjectListPage() {
    const { data, isLoading, error } = useGetProjectsQuery();
    const { userInfo } = useSelector((state) => state.auth);
    const projects = data?.projects ?? [];

    const backLink = userInfo?.role === "client"
        ? "/client/dashboard"
        : userInfo?.role === "developer"
            ? "/developer/dashboard"
            : userInfo?.role === "admin"
                ? "/admin/dashboard"
                : "/";

    const backLabel = userInfo ? "Back to Dashboard" : "Back to Home";

    const skillFrequency = projects.reduce((accumulator, project) => {
        project.skillsRequired?.forEach((skill) => {
            accumulator[skill] = (accumulator[skill] || 0) + 1;
        });
        return accumulator;
    }, {});

    const popularSkills = Object.entries(skillFrequency)
        .sort((left, right) => right[1] - left[1])
        .slice(0, 6);

    const openCount = projects.filter((project) => project.status === "open").length;
    const activeCount = projects.filter((project) => project.status === "in-progress").length;

    return (
        <div className="public-page">
            <Container>
                <section className="market-hero">
                    <div className="market-hero__copy">
                        <span className="eyebrow">Marketplace</span>
                        <h1 className="page-title page-title--compact">Discover software projects</h1>
                        <p className="page-subtitle">
                            Browse current opportunities, compare requirements, and move quickly from interest to proposal.
                        </p>
                        <div className="page-actions">
                            <Button as={Link} to={backLink} tone="light">
                                {backLabel}
                            </Button>
                        </div>
                    </div>

                    <div className="market-hero__stats">
                        <article className="market-hero__stat">
                            <span>Open opportunities</span>
                            <strong>{openCount}</strong>
                        </article>
                        <article className="market-hero__stat">
                            <span>In delivery</span>
                            <strong>{activeCount}</strong>
                        </article>
                        <article className="market-hero__stat">
                            <span>Top skill</span>
                            <strong>{popularSkills[0]?.[0] || "TBD"}</strong>
                        </article>
                    </div>
                </section>

                {isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">
                        {error?.data?.message || error?.error || "Error fetching projects"}
                    </Alert>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        No projects are available right now. New opportunities will appear here as soon as clients publish them.
                    </div>
                ) : (
                    <div className="market-layout">
                        <aside className="market-sidebar">
                            <div className="surface-card market-sidebar__sticky">
                                <div className="stacked-info">
                                    <span className="eyebrow">Marketplace snapshot</span>
                                    <h2 className="section-title">A cleaner way to browse</h2>
                                    <p>
                                        Scan the market from one sidebar, then move deeper only when a project looks promising.
                                    </p>
                                </div>

                                <div className="dashboard-section">
                                    <div className="stats-card__label">Open opportunities</div>
                                    <div className="stats-card__value">{openCount}</div>
                                    <p className="metric-note">{activeCount} projects already in delivery</p>
                                </div>

                                <div className="dashboard-section">
                                    <div className="stats-card__label">Popular skills</div>
                                    <div className="chip-list mt-3">
                                        {popularSkills.length > 0 ? (
                                            popularSkills.map(([skill, count]) => (
                                                <span key={skill} className="app-chip">
                                                    {skill} - {count}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="app-chip">No skills listed yet</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="market-list">
                            <div className="surface-card surface-card--soft">
                                <div className="section-header mb-0">
                                    <div>
                                        <div className="stats-card__label">Live results</div>
                                        <div className="stats-card__value">{projects.length}</div>
                                    </div>
                                    <p className="page-subtitle">
                                        Each card below keeps the same route behavior while adopting the cleaner marketplace layout.
                                    </p>
                                </div>
                            </div>

                            {projects.map((project) => (
                                <article key={project._id} className="project-list-card interactive-card">
                                    <div className="project-list-card__main">
                                        <div className="page-actions">
                                            <ProjectStatusBadge status={project.status} />
                                            {project.skillsRequired?.slice(0, 2).map((skill) => (
                                                <span key={skill} className="app-chip">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <h2 className="project-list-card__title">{project.title}</h2>
                                        <p>
                                            {project.description?.length > 190
                                                ? `${project.description.slice(0, 190)}...`
                                                : project.description}
                                        </p>

                                        <div className="project-list-card__meta">
                                            <span><strong>Client:</strong> {project.clientId?.name || "N/A"}</span>
                                            <span><strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}</span>
                                            <span><strong>Skills:</strong> {project.skillsRequired?.join(", ") || "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="project-list-card__side">
                                        <div className="project-list-card__budget">
                                            ${project.budget?.min} - ${project.budget?.max}
                                        </div>
                                        <Button as={Link} to={`/projects/${project._id}`}>
                                            View Details
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </section>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default ProjectListPage;
