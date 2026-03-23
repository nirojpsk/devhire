import { Alert, Container, Spinner } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../api/projectApiSlice";
import { useSelector } from "react-redux";
import { useGetMyBidsQuery } from "../../api/bidApiSlice";
import { useGetDeveloperProfileQuery } from "../../api/developerApiSlice";
import Button from "../../components/ui/Button";
import ProjectStatusBadge from "../../components/projects/ProjectStatusBadge";

function ProjectDetailPage() {
    const { projectId } = useParams();
    const { userInfo } = useSelector((state) => state.auth);
    const { data, isLoading, error } = useGetProjectByIdQuery(projectId);
    const isDeveloper = userInfo?.role === "developer";
    const { data: myBidsData } = useGetMyBidsQuery(undefined, { skip: !isDeveloper });
    const { data: developerProfileData } = useGetDeveloperProfileQuery(undefined, { skip: !isDeveloper });

    const project = data?.project;

    const isClientOwner =
        userInfo?.role === "client" &&
        userInfo?.id === project?.clientId?._id;

    const isProjectOpen = project?.status === "open";
    const hasDeveloperProfile = !!developerProfileData?.profile;
    const hasAlreadyPlacedBid = myBidsData?.bids?.some((bid) => {
        const bidProjectId = typeof bid?.projectId === "object" ? bid.projectId?._id : bid?.projectId;
        return String(bidProjectId) === String(project?._id);
    });

    return (
        <div className="public-page">
            <Container>
                <div className="page-actions mb-4">
                    <Button as={Link} to="/projects" tone="light">
                        Back to Projects
                    </Button>
                </div>

                {isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">
                        {error?.data?.message || error?.error || "Error fetching project details"}
                    </Alert>
                ) : !project ? (
                    <div className="empty-state">Project not found.</div>
                ) : (
                    <>
                        <section className="project-detail-hero public-card animate-in">
                            <div className="project-detail-hero__top">
                                <div className="project-detail-hero__summary">
                                    <div className="page-actions">
                                        <ProjectStatusBadge status={project.status} />
                                        {project.skillsRequired?.slice(0, 3).map((skill) => (
                                            <span key={skill} className="app-chip">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="page-title page-title--compact">{project.title}</h1>
                                    <p className="page-subtitle">
                                        {project.description?.length > 220
                                            ? `${project.description.slice(0, 220)}...`
                                            : project.description}
                                    </p>
                                </div>
                            </div>

                            <div className="metric-grid mt-4">
                                <article className="stats-card">
                                    <div className="stats-card__label">Budget</div>
                                    <div className="stats-card__value">${project.budget?.min} - ${project.budget?.max}</div>
                                </article>
                                <article className="stats-card">
                                    <div className="stats-card__label">Deadline</div>
                                    <div className="stats-card__value">
                                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}
                                    </div>
                                </article>
                                <article className="stats-card">
                                    <div className="stats-card__label">Client</div>
                                    <div className="stats-card__value">{project.clientId?.name || "N/A"}</div>
                                </article>
                                <article className="stats-card">
                                    <div className="stats-card__label">Selected Developer</div>
                                    <div className="stats-card__value">{project.selectedDeveloper?.name || "Pending"}</div>
                                </article>
                            </div>
                        </section>

                        <div className="detail-layout">
                            <div className="detail-column">
                                <article className="detail-card">
                                    <div className="detail-card__section">
                                        <h2 className="section-title">Project description</h2>
                                        <p>{project.description}</p>
                                    </div>

                                    <div className="detail-card__section">
                                        <h3>Requirements</h3>
                                        <div className="chip-list">
                                            {project.skillsRequired?.length > 0
                                                ? project.skillsRequired.map((skill) => (
                                                    <span key={skill} className="app-chip">
                                                        {skill}
                                                    </span>
                                                ))
                                                : <span className="app-chip">No requirements listed</span>}
                                        </div>
                                    </div>

                                    {project.submission?.submittedAt ? (
                                        <div className="detail-card__section">
                                            <h3>Submission status</h3>
                                            <Alert variant="success" className="mb-0">
                                                <strong>Project submitted:</strong>{" "}
                                                {new Date(project.submission.submittedAt).toLocaleDateString()}
                                                {project.submission?.link ? (
                                                    <>
                                                        {" "} |{" "}
                                                        <a href={project.submission.link} target="_blank" rel="noreferrer">
                                                            View submission link
                                                        </a>
                                                    </>
                                                ) : null}
                                                {project.submission?.clientDecision?.status ? (
                                                    <>
                                                        <br />
                                                        <strong>Client decision:</strong>{" "}
                                                        {project.submission.clientDecision.status}
                                                        {project.submission.clientDecision.note ? (
                                                            <>
                                                                <br />
                                                                <strong>Client note:</strong>{" "}
                                                                {project.submission.clientDecision.note}
                                                            </>
                                                        ) : null}
                                                    </>
                                                ) : null}
                                            </Alert>
                                        </div>
                                    ) : null}
                                </article>
                            </div>

                            <aside className="detail-column">
                                <article className="detail-card">
                                    <div className="detail-card__section">
                                        <h2 className="section-title">Actions</h2>
                                        <div className="stacked-info">
                                            {isDeveloper && !hasDeveloperProfile ? (
                                                <Alert variant="warning" className="mb-0">
                                                    Please create your developer profile before placing a bid.{" "}
                                                    <Link to="/developer/profile/create">Create Profile</Link>
                                                </Alert>
                                            ) : null}

                                            {isDeveloper && isProjectOpen && hasDeveloperProfile && !hasAlreadyPlacedBid ? (
                                                <Button as={Link} to={`/projects/${project._id}/bid`}>
                                                    Place Bid
                                                </Button>
                                            ) : null}

                                            {isDeveloper && isProjectOpen && hasDeveloperProfile && hasAlreadyPlacedBid ? (
                                                <Alert variant="info" className="mb-0">
                                                    You have already placed the bid for this project.
                                                </Alert>
                                            ) : null}

                                            {isClientOwner && isProjectOpen ? (
                                                <Button as={Link} to={`/projects/${project._id}/edit`} tone="light">
                                                    Edit Project
                                                </Button>
                                            ) : null}

                                            {isClientOwner ? (
                                                <Button as={Link} to={`/projects/${project._id}/bids`} tone="light">
                                                    View Bids
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                </article>

                                <article className="detail-card">
                                    <div className="detail-card__section">
                                        <h2 className="section-title">Project snapshot</h2>
                                        <div className="detail-list">
                                            <div className="detail-list__item">
                                                <span>Client Email</span>
                                                <strong>{project.clientId?.email || "N/A"}</strong>
                                            </div>
                                            <div className="detail-list__item">
                                                <span>Status</span>
                                                <ProjectStatusBadge status={project.status} />
                                            </div>
                                            <div className="detail-list__item">
                                                <span>Selected Developer</span>
                                                <strong>{project.selectedDeveloper?.name || "Not selected yet"}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {project.selectedDeveloper?._id ? (
                                        <div className="detail-card__section">
                                            <Button
                                                as={Link}
                                                to={`/developers/${project.selectedDeveloper._id}/profile`}
                                                tone="light"
                                            >
                                                View Selected Developer
                                            </Button>
                                        </div>
                                    ) : null}
                                </article>
                            </aside>
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
}

export default ProjectDetailPage;
