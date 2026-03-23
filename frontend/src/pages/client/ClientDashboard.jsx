import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaClipboardCheck, FaFolderOpen, FaHandshake, FaHourglassHalf } from "react-icons/fa6";
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
    const pendingBids = bids.filter((bid) => bid.status === "pending").length;
    const recentProjects = projects.slice(0, 4);
    const completionScore = profile ? 100 : 35;

    return (
        <div className="dashboard-screen">
            <section className="dashboard-hero">
                <div>
                    <span className="eyebrow">Client workspace</span>
                    <h1 className="dashboard-hero__title">Client Dashboard</h1>
                    <p className="dashboard-hero__subtitle">
                        Welcome back, {userInfo?.name}. Review active projects, compare incoming bids, and keep delivery moving with a clearer command center.
                    </p>
                </div>
                <div className="dashboard-hero__actions">
                    <Button as={Link} to="/my-projects" tone="light">
                        View Projects
                    </Button>
                    <Button as={Link} to="/projects/create">
                        Post Project
                    </Button>
                </div>
            </section>

            <section className="dashboard-metrics dashboard-metrics--developer">
                <article className="dashboard-panel dashboard-stat dashboard-stat--wide">
                    <div className="dashboard-stat__eyebrow">Projects Posted</div>
                    <div className="dashboard-stat__value">{projects.length}</div>
                    <div className="dashboard-progress-row">
                        <div>
                            <span className="dashboard-progress-row__label">Open ({openProjects})</span>
                            <div className="dashboard-progress"><span style={{ width: `${projects.length ? (openProjects / projects.length) * 100 : 0}%` }} /></div>
                        </div>
                        <div>
                            <span className="dashboard-progress-row__label">In Progress ({activeProjects})</span>
                            <div className="dashboard-progress dashboard-progress--green"><span style={{ width: `${projects.length ? (activeProjects / projects.length) * 100 : 0}%` }} /></div>
                        </div>
                    </div>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Bids Received</div>
                    <div className="dashboard-stat__value">{bids.length}</div>
                    <p className="dashboard-stat__note">
                        <FaHandshake /> Across all projects
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Pending Review</div>
                    <div className="dashboard-stat__value">{submittedProjects.length}</div>
                    <p className="dashboard-stat__note">
                        <FaClipboardCheck /> Submitted work waiting
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat dashboard-stat--accent">
                    <div className="dashboard-stat__eyebrow">Bid Review Flow</div>
                    <div className="dashboard-stat__value">{pendingBids}</div>
                    <p className="dashboard-stat__note">
                        <FaHourglassHalf /> Decisions still pending
                    </p>
                </article>
            </section>

            <section className="dashboard-grid-layout">
                <article className="dashboard-panel dashboard-panel--main">
                    <div className="dashboard-panel__header">
                        <div>
                            <h2>Ongoing Engagements</h2>
                            <p>Projects you are currently funding, reviewing, or moving toward delivery.</p>
                        </div>
                        <Link to="/my-projects" className="section-link">
                            View all projects
                        </Link>
                    </div>

                    {recentProjects.length > 0 ? (
                        <div className="dashboard-activity-list">
                            {recentProjects.map((project) => (
                                <article key={project._id} className="dashboard-activity-item">
                                    <div className="dashboard-activity-item__main">
                                        <div className="dashboard-activity-item__title-row">
                                            <h3>{project.title}</h3>
                                            <ProjectStatusBadge status={project.status} />
                                        </div>
                                        <p>
                                            {project.description?.length > 125
                                                ? `${project.description.slice(0, 125)}...`
                                                : project.description}
                                        </p>
                                        <div className="dashboard-activity-item__meta">
                                            <span><FaFolderOpen /> {project.skillsRequired?.slice(0, 2).join(", ") || "Project"}</span>
                                            <span>Budget: ${project.budget?.min} - ${project.budget?.max}</span>
                                            <span>Developer: {project.selectedDeveloper?.name || "Not selected"}</span>
                                        </div>
                                    </div>
                                    <div className="dashboard-activity-item__actions">
                                        <Button as={Link} to={`/projects/${project._id}`} tone="light">
                                            View
                                        </Button>
                                        <Button as={Link} to={`/projects/${project._id}/bids`}>
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
                </article>

                <div className="dashboard-side-column">
                    <article className="dashboard-panel">
                        <div className="dashboard-panel__header">
                            <div>
                                <h2>Workspace Readiness</h2>
                                <p>Make it easier for developers to trust your project briefs.</p>
                            </div>
                        </div>
                        <div className="dashboard-health">
                            <div className="dashboard-health__meter">
                                <span>Profile completion</span>
                                <strong>{completionScore}%</strong>
                            </div>
                            <div className="dashboard-progress dashboard-progress--green">
                                <span style={{ width: `${completionScore}%` }} />
                            </div>
                            <ul className="dashboard-mini-list">
                                <li>{profile ? `${profile.companyName || "Company profile"} is live` : "Client profile still needs setup"}</li>
                                <li>{pendingBids} proposals awaiting your review</li>
                                <li>{submittedProjects.length} submissions waiting on decisions</li>
                            </ul>
                        </div>
                        <Button as={Link} to={profile ? "/client/profile" : "/client/profile/create"}>
                            {profile ? "Open Profile" : "Create Profile"}
                        </Button>
                    </article>

                    <article className="dashboard-panel dashboard-panel--dark">
                        <div className="dashboard-panel__header">
                            <div>
                                <h2>Submission Queue</h2>
                                <p>Projects already delivered and ready for your approval cycle.</p>
                            </div>
                        </div>
                        <div className="dashboard-side-stat">{submittedProjects.length}</div>
                        <p className="dashboard-panel__support">
                            Review completed work, approve completion, or request one more pass.
                        </p>
                        <Button as={Link} to="/client/submitted-projects" tone="light">
                            Review Submissions
                        </Button>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default ClientDashboard;
