import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetDeveloperProfileQuery } from "../../api/developerApiSlice";
import { useGetMyBidsQuery } from "../../api/bidApiSlice";
import Button from "../../components/ui/Button";
import BidStatusBadge from "../../components/bids/BidStatusBadge";

function DeveloperDashboard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { data: profileData } = useGetDeveloperProfileQuery();
    const { data: bidsData } = useGetMyBidsQuery();

    const profile = profileData?.profile;
    const bids = bidsData?.bids || [];
    const acceptedBids = bids.filter((bid) => bid.status === "accepted");
    const pendingBids = bids.filter((bid) => bid.status === "pending");
    const recentBids = bids.slice(0, 3);

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Developer workspace</span>
                    <h1 className="page-title page-title--compact">Developer Dashboard</h1>
                    <p className="page-subtitle">
                        Welcome back, {userInfo?.name}. Keep proposals organized, track accepted work, and strengthen your profile.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/projects">
                        Browse Projects
                    </Button>
                    <Button as={Link} to="/my-bids" tone="light">
                        Open My Bids
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Total Bids</div>
                    <div className="stats-card__value">{bids.length}</div>
                    <p className="metric-note">Every proposal you have submitted so far</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Pending Proposals</div>
                    <div className="stats-card__value">{pendingBids.length}</div>
                    <p className="metric-note">Still under review by clients</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Accepted Work</div>
                    <div className="stats-card__value">{acceptedBids.length}</div>
                    <p className="metric-note">Projects you can currently deliver</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Profile Rating</div>
                    <div className="stats-card__value">{profile?.averageRating?.toFixed?.(1) || "0.0"}</div>
                    <p className="metric-note">{profile?.totalReviews || 0} client reviews</p>
                </article>
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">Recent proposal activity</h2>
                    <Link to="/my-bids" className="section-link">
                        View all bids
                    </Link>
                </div>

                {recentBids.length > 0 ? (
                    <div className="dashboard-stack">
                        {recentBids.map((bid) => (
                            <article key={bid._id} className="dashboard-card dashboard-list-card interactive-card">
                                <div className="dashboard-list-card__main">
                                    <div className="page-actions">
                                        <BidStatusBadge status={bid.status} />
                                        <span className="app-chip">
                                            {bid.projectId?.skillsRequired?.[0] || "Proposal"}
                                        </span>
                                    </div>
                                    <h3 className="dashboard-list-card__title">{bid.projectId?.title || "Project"}</h3>
                                    <p>
                                        {bid.proposal?.length > 170
                                            ? `${bid.proposal.slice(0, 170)}...`
                                            : bid.proposal}
                                    </p>
                                    <div className="meta-row">
                                        <span><strong>Bid Amount:</strong> ${bid.bidAmount}</span>
                                        <span><strong>Delivery:</strong> {bid.deliveryTime} days</span>
                                        <span><strong>Edit Count:</strong> {bid.editCount}</span>
                                    </div>
                                </div>
                                <div className="dashboard-list-card__aside">
                                    <Button as={Link} to={`/projects/${bid.projectId?._id}`}>
                                        View Project
                                    </Button>
                                    {bid.status === "pending" && bid.editCount < 2 ? (
                                        <Button as={Link} to={`/bids/${bid._id}/edit`} tone="light">
                                            Edit Bid
                                        </Button>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        No bids yet. Start browsing projects to submit your first proposal.
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <div className="feature-grid">
                    <article className="dashboard-card">
                        <div className="stats-card__label">Profile readiness</div>
                        <div className="stats-card__value">{profile ? "Ready" : "Create"}</div>
                        <p className="mt-3">
                            {profile
                                ? "Your developer profile is live and ready to support future proposals."
                                : "Create your developer profile before placing bids on projects."}
                        </p>
                        <div className="page-actions mt-3">
                            <Button as={Link} to={profile ? "/developer/profile" : "/developer/profile/create"} tone="light">
                                {profile ? "View Profile" : "Create Profile"}
                            </Button>
                        </div>
                    </article>

                    <article className="dashboard-card">
                        <div className="stats-card__label">Accepted delivery queue</div>
                        <div className="stats-card__value">{acceptedBids.length}</div>
                        <p className="mt-3">
                            Review active accepted work and move projects toward submission.
                        </p>
                        <div className="page-actions mt-3">
                            <Button as={Link} to="/developer/accepted-projects" tone="light">
                                Open Accepted Projects
                            </Button>
                        </div>
                    </article>

                    <article className="dashboard-card">
                        <div className="stats-card__label">Marketplace focus</div>
                        <div className="stats-card__value">{profile?.skills?.length || 0}</div>
                        <p className="mt-3">
                            Skills currently listed on your profile and used to position you more clearly.
                        </p>
                        <div className="page-actions mt-3">
                            <Button as={Link} to="/projects" tone="light">
                                Discover Projects
                            </Button>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default DeveloperDashboard;
