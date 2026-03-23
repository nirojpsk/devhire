import { Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetClientProfileQuery } from "../../api/clientApiSlice";
import Button from "../../components/ui/Button";

function ClientProfilePage() {
    const { data, isLoading, error } = useGetClientProfileQuery();
    const profile = data?.profile;

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Client profile</span>
                    <h1 className="page-title page-title--compact">Company and hiring profile</h1>
                    <p className="page-subtitle">
                        Present your company, project context, and credibility in a cleaner premium detail layout.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/client/dashboard" tone="light">
                        Back to Dashboard
                    </Button>
                </div>
            </section>

            {isLoading ? (
                <div className="loading-state">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">
                    {error?.data?.message || error?.error || "Error fetching client profile"}
                </Alert>
            ) : !profile ? (
                <div className="empty-state">Client profile not found.</div>
            ) : (
                <>
                    <section className="profile-hero surface-card animate-in">
                        <div className="profile-hero__main">
                            <div className="page-actions">
                                <span className="status-pill status-pill--reviewing">Client</span>
                                <span className="app-chip">{profile.userId?.email}</span>
                            </div>
                            <h1 className="profile-title">{profile.companyName || profile.userId?.name}</h1>
                            <p className="profile-lead">
                                {profile.bio || "No company description added yet."}
                            </p>
                        </div>

                        <div className="profile-hero__aside">
                            <Button as={Link} to="/client/profile/edit">
                                Edit Profile
                            </Button>
                            <Button as={Link} to="/change-password" tone="light">
                                Change Password
                            </Button>
                        </div>
                    </section>

                    <div className="profile-layout">
                        <div className="profile-column">
                            <article className="detail-card profile-card">
                                <div className="detail-card__section">
                                    <h2 className="section-title">Company summary</h2>
                                    <p>{profile.bio || "No company bio added yet."}</p>
                                </div>

                                <div className="detail-card__section">
                                    <h2 className="section-title">Links</h2>
                                    <div className="profile-link-list">
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
                            </article>
                        </div>

                        <aside className="profile-column">
                            <article className="detail-card profile-card">
                                <h2 className="section-title">Profile snapshot</h2>
                                <div className="profile-stat-grid mt-3">
                                    <div className="profile-stat">
                                        <div className="profile-stat__label">Account Name</div>
                                        <div className="profile-stat__value">{profile.userId?.name}</div>
                                    </div>
                                    <div className="profile-stat">
                                        <div className="profile-stat__label">Projects Posted</div>
                                        <div className="profile-stat__value">{profile.totalProjectsPosted || 0}</div>
                                    </div>
                                </div>
                            </article>
                        </aside>
                    </div>
                </>
            )}
        </div>
    );
}

export default ClientProfilePage;
