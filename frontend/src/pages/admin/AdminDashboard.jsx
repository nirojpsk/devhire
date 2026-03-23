import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowTrendUp, FaFlag, FaShieldHalved, FaUsersGear } from "react-icons/fa6";
import { useGetAllProjectsAdminQuery, useGetAllUsersQuery } from "../../api/adminApiSlice";
import Button from "../../components/ui/Button";
import ProjectStatusBadge from "../../components/projects/ProjectStatusBadge";

function AdminDashboard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { data: usersData } = useGetAllUsersQuery();
    const { data: projectsData } = useGetAllProjectsAdminQuery();

    const users = usersData?.users || [];
    const projects = projectsData?.projects || [];
    const developerCount = users.filter((user) => user.role === "developer").length;
    const clientCount = users.filter((user) => user.role === "client").length;
    const bannedUsers = users.filter((user) => user.isBanned).length;
    const openProjects = projects.filter((project) => project.status === "open").length;
    const flaggedProjects = projects.filter((project) => project.status === "cancelled" || project.status === "disputed").length;
    const recentUsers = users.slice(0, 4);
    const recentProjects = projects.slice(0, 4);

    return (
        <div className="dashboard-screen">
            <section className="dashboard-hero">
                <div>
                    <span className="eyebrow">Admin control center</span>
                    <h1 className="dashboard-hero__title">Admin Dashboard</h1>
                    <p className="dashboard-hero__subtitle">
                        Welcome back, {userInfo?.name}. Monitor platform activity, keep users healthy, and manage project quality across DevHire.
                    </p>
                </div>
                <div className="dashboard-hero__actions">
                    <Button as={Link} to="/admin/projects" tone="light">
                        Review Projects
                    </Button>
                    <Button as={Link} to="/admin/users">
                        Manage Users
                    </Button>
                </div>
            </section>

            <section className="dashboard-metrics dashboard-metrics--developer">
                <article className="dashboard-panel dashboard-stat dashboard-stat--wide">
                    <div className="dashboard-stat__eyebrow">Total Users</div>
                    <div className="dashboard-stat__value">{users.length}</div>
                    <div className="dashboard-progress-row">
                        <div>
                            <span className="dashboard-progress-row__label">Clients ({clientCount})</span>
                            <div className="dashboard-progress"><span style={{ width: `${users.length ? (clientCount / users.length) * 100 : 0}%` }} /></div>
                        </div>
                        <div>
                            <span className="dashboard-progress-row__label">Developers ({developerCount})</span>
                            <div className="dashboard-progress dashboard-progress--green"><span style={{ width: `${users.length ? (developerCount / users.length) * 100 : 0}%` }} /></div>
                        </div>
                    </div>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Total Projects</div>
                    <div className="dashboard-stat__value">{projects.length}</div>
                    <p className="dashboard-stat__note">
                        <FaUsersGear /> {openProjects} open right now
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Restricted Accounts</div>
                    <div className="dashboard-stat__value">{bannedUsers}</div>
                    <p className="dashboard-stat__note">
                        <FaShieldHalved /> Moderation actions active
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat dashboard-stat--accent">
                    <div className="dashboard-stat__eyebrow">Platform Focus</div>
                    <div className="dashboard-stat__value">{Math.max(openProjects - flaggedProjects, 0)}</div>
                    <p className="dashboard-stat__note">
                        <FaArrowTrendUp /> Healthy active project flow
                    </p>
                </article>
            </section>

            <section className="dashboard-grid-layout">
                <article className="dashboard-panel dashboard-panel--main">
                    <div className="dashboard-panel__header">
                        <div>
                            <h2>Recent Users</h2>
                            <p>Latest accounts and moderation-sensitive profiles that may need attention.</p>
                        </div>
                        <Link to="/admin/users" className="section-link">
                            Open user management
                        </Link>
                    </div>

                    <div className="dashboard-activity-list">
                        {recentUsers.map((user) => (
                            <article key={user._id} className="dashboard-activity-item">
                                <div className="dashboard-activity-item__main">
                                    <div className="dashboard-activity-item__title-row">
                                        <h3>{user.name}</h3>
                                        <span className={`status-pill status-pill--${user.isBanned ? "rejected" : "accepted"}`}>
                                            {user.isBanned ? "Banned" : "Active"}
                                        </span>
                                    </div>
                                    <p>{user.email}</p>
                                    <div className="dashboard-activity-item__meta">
                                        <span>{user.role}</span>
                                        <span>{user.address?.country || "N/A"}</span>
                                        <span>{user.address?.city || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="dashboard-activity-item__actions">
                                    <Button as={Link} to={`/admin/users/${user._id}/profile`}>
                                        View Profile
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                </article>

                <div className="dashboard-side-column">
                    <article className="dashboard-panel">
                        <div className="dashboard-panel__header">
                            <div>
                                <h2>Active Watchlist</h2>
                                <p>Signals that deserve moderation or follow-up.</p>
                            </div>
                        </div>
                        <ul className="dashboard-mini-list">
                            <li>{bannedUsers} users are currently restricted</li>
                            <li>{openProjects} open projects are still accepting bids</li>
                            <li>{flaggedProjects} projects look blocked or disputed</li>
                        </ul>
                        <Button as={Link} to="/admin/projects" tone="light">
                            Open Project Queue
                        </Button>
                    </article>

                    <article className="dashboard-panel dashboard-panel--dark">
                        <div className="dashboard-panel__header">
                            <div>
                                <h2>Recent Projects</h2>
                                <p>Fresh project activity across the marketplace.</p>
                            </div>
                        </div>
                        <div className="dashboard-activity-list">
                            {recentProjects.map((project) => (
                                <article key={project._id} className="dashboard-activity-item">
                                    <div className="dashboard-activity-item__main">
                                        <div className="dashboard-activity-item__title-row">
                                            <h3>{project.title}</h3>
                                            <ProjectStatusBadge status={project.status} />
                                        </div>
                                        <p>
                                            {project.description?.length > 90
                                                ? `${project.description.slice(0, 90)}...`
                                                : project.description}
                                        </p>
                                        <div className="dashboard-activity-item__meta">
                                            <span>Budget: ${project.budget?.min} - ${project.budget?.max}</span>
                                            <span><FaFlag /> {project.clientId?.name || "Client"}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;
