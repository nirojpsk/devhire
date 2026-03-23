import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetClientProfileQuery } from "../../api/clientApiSlice";
import { useGetMyProjectsQuery, useGetSubmittedProjectsQuery } from "../../api/projectApiSlice";
import { useGetClientBidsQuery } from "../../api/bidApiSlice";
import Button from "../../components/ui/Button";
import ProjectStatusBadge from "../../components/projects/ProjectStatusBadge";

function ClientDashboard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { data: profileData } = useGetClientProfileQuery();
    const { data: projectsData } = useGetMyProjectsQuery();
    const { data: bidsData } = useGetClientBidsQuery();
    const { data: submittedData } = useGetSubmittedProjectsQuery();

    const profile = profileData?.profile;
    const projects = projectsData?.projects || [];
    const bids = bidsData?.bids || [];
    const submittedProjects = submittedData?.projects || [];

    const openProjects = projects.filter((project) => project.status === "open").length;
    const activeProjects = projects.filter((project) => project.status === "in-progress").length;
    const recentProjects = projects.slice(0, 3);

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Client workspace</span>
                    <h1 className="page-title page-title--compact">Client Dashboard</h1>
                    <p className="page-subtitle">
                        Welcome back, {userInfo?.name}. Review your projects, compare incoming bids, and keep delivery moving.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/projects/create">
                        Post Project
                    </Button>
                    <Button as={Link} to="/my-projects" tone="light">
                        View All Projects
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Projects Posted</div>
                    <div className="stats-card__value">{projects.length}</div>
                    <p className="metric-note">
                        <strong>{openProjects}</strong> currently open for bids
                    </p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Active Delivery</div>
                    <div className="stats-card__value">{activeProjects}</div>
                    <p className="metric-note">Projects already paired with a developer</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Bids Received</div>
                    <div className="stats-card__value">{bids.length}</div>
                    <p className="metric-note">Across all of your current projects</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Pending Review</div>
                    <div className="stats-card__value">{submittedProjects.length}</div>
                    <p className="metric-note">Submitted work waiting for your decision</p>
                </article>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">Ongoing engagements</h2>
                    <Link to="/my-projects" className="section-link">
                        View all projects
                    </Link>
                </div>

                {recentProjects.length > 0 ? (
                    <div className="dashboard-stack">
                        {recentProjects.map((project) => (
                            <article key={project._id} className="dashboard-card dashboard-list-card interactive-card">
                                <div className="dashboard-list-card__main">
                                    <div className="page-actions">
                                        <ProjectStatusBadge status={project.status} />
                                        <span className="app-chip">
                                            {project.skillsRequired?.[0] || "Project"}
                                        </span>
                                    </div>
                                    <h3 className="dashboard-list-card__title">{project.title}</h3>
                                    <p>
                                        {project.description?.length > 160
                                            ? `${project.description.slice(0, 160)}...`
                                            : project.description}
                                    </p>
                                    <div className="meta-row">
                                        <span><strong>Budget:</strong> ${project.budget?.min} - ${project.budget?.max}</span>
                                        <span><strong>Skills:</strong> {project.skillsRequired?.slice(0, 3).join(", ") || "N/A"}</span>
                                        <span><strong>Developer:</strong> {project.selectedDeveloper?.name || "Not selected yet"}</span>
                                    </div>
                                </div>
                                <div className="dashboard-list-card__aside">
                                    <Button as={Link} to={`/projects/${project._id}`}>
                                        View Project
                                    </Button>
                                    <Button as={Link} to={`/projects/${project._id}/bids`} tone="light">
                                        Review Bids
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        You have not posted any projects yet. Create your first project to start receiving proposals.
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <div className="feature-grid">
                    <article className="dashboard-card">
                        <div className="stats-card__label">Profile status</div>
                        <div className="stats-card__value">{profile ? "Ready" : "Incomplete"}</div>
                        <p className="mt-3">
                            {profile
                                ? `${profile.companyName || "Your company"} is ready to hire from DevHire.`
                                : "Create your client profile to help developers understand who they will work with."}
                        </p>
                        <div className="page-actions mt-3">
                            <Button as={Link} to={profile ? "/client/profile" : "/client/profile/create"} tone="light">
                                {profile ? "View Profile" : "Create Profile"}
                            </Button>
                        </div>
                    </article>

                    <article className="dashboard-card">
                        <div className="stats-card__label">Bid review flow</div>
                        <div className="stats-card__value">{bids.filter((bid) => bid.status === "pending").length}</div>
                        <p className="mt-3">
                            Pending proposals still waiting for your decision across all projects.
                        </p>
                        <div className="page-actions mt-3">
                            <Button as={Link} to="/client/bids" tone="light">
                                Open All Bids
                            </Button>
                        </div>
                    </article>

                    <article className="dashboard-card">
                        <div className="stats-card__label">Submission queue</div>
                        <div className="stats-card__value">{submittedProjects.length}</div>
                        <p className="mt-3">
                            Review submitted work, approve completion, or request another delivery pass.
                        </p>
                        <div className="page-actions mt-3">
                            <Button as={Link} to="/client/submitted-projects" tone="light">
                                Review Submissions
                            </Button>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default ClientDashboard;
