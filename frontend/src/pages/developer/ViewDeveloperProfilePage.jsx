import { Spinner, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useGetDeveloperProfileByUserIdQuery } from "../../api/developerApiSlice";
import StarRating from "../../components/common/StarRating";
import Button from "../../components/ui/Button";

function ViewDeveloperProfilePage() {
    const { userId } = useParams();
    const { data, isLoading, error } = useGetDeveloperProfileByUserIdQuery(userId);
    const profile = data?.profile;
    const availabilityTone = profile?.availability === "available" ? "available" : "reviewing";

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Developer profile</span>
                    <h1 className="page-title page-title--compact">Review developer details</h1>
                    <p className="page-subtitle">
                        Inspect the developer’s profile, experience, links, and rating in the same polished detail layout as the rest of the app.
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
                    {error?.data?.message || error?.error || "Error fetching developer profile"}
                </Alert>
            ) : !profile ? (
                <div className="empty-state">Developer profile not found.</div>
            ) : (
                <>
                    <section className="profile-hero surface-card animate-in">
                        <div className="profile-hero__main">
                            <div className="page-actions">
                                <span className={`status-pill status-pill--${availabilityTone}`}>
                                    {profile.availability}
                                </span>
                                <span className="app-chip">{profile.userId?.email}</span>
                            </div>
                            <h1 className="profile-title">{profile.userId?.name}</h1>
                            <div className="page-actions">
                                <StarRating rating={profile.averageRating} showValue />
                                <span className="app-chip">{profile.totalReviews || 0} reviews</span>
                            </div>
                            <p className="profile-lead">
                                {profile.bio || "No bio added yet."}
                            </p>
                        </div>

                        <div className="profile-hero__aside">
                            <Button as={Link} to="/client/bids" tone="light">
                                Back to Bids
                            </Button>
                        </div>
                    </section>

                    <div className="profile-layout">
                        <div className="profile-column">
                            <article className="detail-card profile-card">
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
                                            <span className="profile-empty">No skills added.</span>
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
                            </article>
                        </div>

                        <aside className="profile-column">
                            <article className="detail-card profile-card">
                                <h2 className="section-title">Profile snapshot</h2>
                                <div className="profile-stat-grid mt-3">
                                    <div className="profile-stat">
                                        <div className="profile-stat__label">Average Rating</div>
                                        <div className="profile-stat__value">{(profile.averageRating || 0).toFixed(1)}</div>
                                    </div>
                                    <div className="profile-stat">
                                        <div className="profile-stat__label">Total Reviews</div>
                                        <div className="profile-stat__value">{profile.totalReviews || 0}</div>
                                    </div>
                                    <div className="profile-stat">
                                        <div className="profile-stat__label">Experience</div>
                                        <div className="profile-stat__value">{profile.experienceYears} years</div>
                                    </div>
                                    <div className="profile-stat">
                                        <div className="profile-stat__label">Rate</div>
                                        <div className="profile-stat__value">{profile.rate || 0}</div>
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

export default ViewDeveloperProfilePage;
