import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
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
    const recentUsers = users.slice(0, 4);
    const recentProjects = projects.slice(0, 4);

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Admin control center</span>
                    <h1 className="page-title page-title--compact">Admin Dashboard</h1>
                    <p className="page-subtitle">
                        Welcome back, {userInfo?.name}. Monitor platform activity, keep users healthy, and manage project quality across DevHire.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/admin/users">
                        Manage Users
                    </Button>
                    <Button as={Link} to="/admin/projects" tone="light">
                        Review Projects
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Total Users</div>
                    <div className="stats-card__value">{users.length}</div>
                    <p className="metric-note">{clientCount} clients and {developerCount} developers</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Banned Users</div>
                    <div className="stats-card__value">{bannedUsers}</div>
                    <p className="metric-note">Accounts currently restricted from platform access</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Total Projects</div>
                    <div className="stats-card__value">{projects.length}</div>
                    <p className="metric-note">{openProjects} still open and accepting bids</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Platform Focus</div>
                    <div className="stats-card__value">Stable</div>
                    <p className="metric-note">Clear visibility into user and project activity</p>
                </article>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">Recent users</h2>
                    <Link to="/admin/users" className="section-link">
                        Open user management
                    </Link>
                </div>

                <div className="dashboard-stack">
                    {recentUsers.map((user) => (
                        <article key={user._id} className="dashboard-card dashboard-list-card interactive-card">
                            <div className="dashboard-list-card__main">
                                <div className="page-actions">
                                    <span className="app-chip">{user.role}</span>
                                    <span className={`status-pill status-pill--${user.isBanned ? "rejected" : "accepted"}`}>
                                        {user.isBanned ? "Banned" : "Active"}
                                    </span>
                                </div>
                                <h3 className="dashboard-list-card__title">{user.name}</h3>
                                <p>{user.email}</p>
                                <div className="meta-row">
                                    <span><strong>Country:</strong> {user.address?.country || "N/A"}</span>
                                    <span><strong>City:</strong> {user.address?.city || "N/A"}</span>
                                </div>
                            </div>
                            <div className="dashboard-list-card__aside">
                                <Button as={Link} to={`/admin/users/${user._id}/profile`}>
                                    View Profile
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">Recent projects</h2>
                    <Link to="/admin/projects" className="section-link">
                        Open project management
                    </Link>
                </div>

                <div className="dashboard-stack">
                    {recentProjects.map((project) => (
                        <article key={project._id} className="dashboard-card dashboard-list-card interactive-card">
                            <div className="dashboard-list-card__main">
                                <div className="page-actions">
                                    <ProjectStatusBadge status={project.status} />
                                    <span className="app-chip">{project.clientId?.name || "Client"}</span>
                                </div>
                                <h3 className="dashboard-list-card__title">{project.title}</h3>
                                <p>
                                    {project.description?.length > 170
                                        ? `${project.description.slice(0, 170)}...`
                                        : project.description}
                                </p>
                                <div className="meta-row">
                                    <span><strong>Budget:</strong> ${project.budget?.min} - ${project.budget?.max}</span>
                                    <span><strong>Skills:</strong> {project.skillsRequired?.slice(0, 3).join(", ") || "N/A"}</span>
                                </div>
                            </div>
                            <div className="dashboard-list-card__aside">
                                <Button as={Link} to="/admin/projects" tone="light">
                                    Manage Project
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;
