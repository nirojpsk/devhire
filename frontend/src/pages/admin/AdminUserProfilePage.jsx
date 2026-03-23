import { Spinner, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useGetUserProfileAdminQuery } from "../../api/adminApiSlice";
import StarRating from "../../components/common/StarRating";
import Button from "../../components/ui/Button";

function AdminUserProfilePage() {
    const { userId } = useParams();
    const { data, isLoading, error } = useGetUserProfileAdminQuery(userId);

    const user = data?.user;
    const profile = data?.profile;
    const roleTone = user?.role === "developer" ? "available" : user?.role === "client" ? "reviewing" : "open";
    const bannedTone = user?.isBanned ? "rejected" : "accepted";

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Admin user view</span>
                    <h1 className="page-title page-title--compact">User profile details</h1>
                    <p className="page-subtitle">
                        Review the user account, role, status, and attached profile data in a clearer admin-friendly detail layout.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/admin/users" tone="light">
                        Back to Users
                    </Button>
                </div>
            </section>

            {isLoading ? (
                <div className="loading-state">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">
                    {error?.data?.message || error?.error || "Error fetching user profile"}
                </Alert>
            ) : !user ? (
                <div className="empty-state">User not found.</div>
            ) : (
                <>
                    <section className="profile-hero surface-card animate-in">
                        <div className="profile-hero__main">
                            <div className="page-actions">
                                <span className={`status-pill status-pill--${roleTone}`}>{user.role}</span>
                                <span className={`status-pill status-pill--${bannedTone}`}>{user.isBanned ? "Banned" : "Active"}</span>
                            </div>
                            <h1 className="profile-title">{user.name}</h1>
                            <p className="profile-lead">{user.email}</p>
                        </div>

                        <div className="profile-hero__aside">
                            <Button as={Link} to="/admin/users" tone="light">
                                Return to user list
                            </Button>
                        </div>
                    </section>

                    <div className="profile-layout">
                        <div className="profile-column">
                            <article className="detail-card profile-card">
                                {!profile ? (
                                    <Alert variant="info" className="mb-0">
                                        This user has not created a profile yet.
                                    </Alert>
                                ) : user.role === "developer" ? (
                                    <>
                                        <div className="detail-card__section">
                                            <h2 className="section-title">Developer summary</h2>
                                            <p>{profile.bio || "No bio added."}</p>
                                        </div>

                                        <div className="detail-card__section">
                                            <h2 className="section-title">Skills</h2>
                                            <div className="chip-list">
                                                {profile.skills?.length > 0 ? (
                                                    profile.skills.map((skill) => (
                                                        <span key={skill} className="app-chip">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="profile-empty">Not added</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="detail-card__section">
                                            <h2 className="section-title">Links</h2>
                                            <div className="profile-link-list">
                                                <div className="profile-link-row">
                                                    <strong>Portfolio</strong>
                                                    {profile.links?.portfolio ? (
                                                        <a href={profile.links.portfolio} target="_blank" rel="noreferrer">
                                                            {profile.links.portfolio}
                                                        </a>
                                                    ) : (
                                                        <span className="profile-empty">Not added</span>
                                                    )}
                                                </div>
                                                <div className="profile-link-row">
                                                    <strong>GitHub</strong>
                                                    {profile.links?.github ? (
                                                        <a href={profile.links.github} target="_blank" rel="noreferrer">
                                                            {profile.links.github}
                                                        </a>
                                                    ) : (
                                                        <span className="profile-empty">Not added</span>
                                                    )}
                                                </div>
                                                <div className="profile-link-row">
                                                    <strong>LinkedIn</strong>
                                                    {profile.links?.linkedin ? (
                                                        <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                                                            {profile.links.linkedin}
                                                        </a>
                                                    ) : (
                                                        <span className="profile-empty">Not added</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="detail-card__section">
                                            <h2 className="section-title">Client summary</h2>
                                            <p>{profile.bio || "No bio added."}</p>
                                        </div>

                                        <div className="detail-card__section">
                                            <h2 className="section-title">Company details</h2>
                                            <div className="profile-link-list">
                                                <div className="profile-link-row">
                                                    <strong>Company Name</strong>
                                                    <span>{profile.companyName || "Not added"}</span>
                                                </div>
                                                <div className="profile-link-row">
                                                    <strong>Website</strong>
                                                    {profile.website ? (
                                                        <a href={profile.website} target="_blank" rel="noreferrer">
                                                            {profile.website}
                                                        </a>
                                                    ) : (
                                                        <span className="profile-empty">Not added</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </article>
                        </div>

                        <aside className="profile-column">
                            <article className="detail-card profile-card">
                                <h2 className="section-title">Account snapshot</h2>
                                <div className="profile-stat-grid mt-3">
                                    <div className="profile-stat">
                                        <div className="profile-stat__label">Role</div>
                                        <div className="profile-stat__value">{user.role}</div>
                                    </div>
                                    <div className="profile-stat">
                                        <div className="profile-stat__label">Status</div>
                                        <div className="profile-stat__value">{user.isBanned ? "Banned" : "Active"}</div>
                                    </div>

                                    {user.role === "developer" && profile ? (
                                        <>
                                            <div className="profile-stat">
                                                <div className="profile-stat__label">Rating</div>
                                                <div className="profile-stat__value">
                                                    <StarRating rating={profile.averageRating} showValue />
                                                </div>
                                            </div>
                                            <div className="profile-stat">
                                                <div className="profile-stat__label">Rate</div>
                                                <div className="profile-stat__value">{profile.rate || 0}</div>
                                            </div>
                                        </>
                                    ) : null}

                                    {user.role === "client" && profile ? (
                                        <div className="profile-stat">
                                            <div className="profile-stat__label">Projects Posted</div>
                                            <div className="profile-stat__value">{profile.totalProjectsPosted || 0}</div>
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        </aside>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminUserProfilePage;
