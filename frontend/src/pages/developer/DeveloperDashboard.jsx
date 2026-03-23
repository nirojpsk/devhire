import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowTrendUp, FaBriefcase, FaClock, FaStar } from "react-icons/fa6";
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
    const recentBids = bids.slice(0, 4);
    const averageBid = bids.length
        ? Math.round(bids.reduce((sum, bid) => sum + Number(bid.bidAmount || 0), 0) / bids.length)
        : 0;
    const profileCompletion = profile
        ? [profile.title, profile.bio, profile.skills?.length, profile.hourlyRate].filter(Boolean).length * 25
        : 25;

    return (
        <div className="dashboard-screen">
            <section className="dashboard-hero">
                <div>
                    <span className="eyebrow">Developer workspace</span>
                    <h1 className="dashboard-hero__title">Developer Dashboard</h1>
                    <p className="dashboard-hero__subtitle">
                        Welcome back, {userInfo?.name}. Track proposals, accepted work, and profile momentum from one place.
                    </p>
                </div>
                <div className="dashboard-hero__actions">
                    <Button as={Link} to="/my-bids" tone="light">
                        Open My Bids
                    </Button>
                    <Button as={Link} to="/projects">
                        Browse Projects
                    </Button>
                </div>
            </section>

            <section className="dashboard-metrics dashboard-metrics--developer">
                <article className="dashboard-panel dashboard-stat dashboard-stat--wide">
                    <div className="dashboard-stat__eyebrow">Total Bids</div>
                    <div className="dashboard-stat__value">{bids.length}</div>
                    <div className="dashboard-progress-row">
                        <div>
                            <span className="dashboard-progress-row__label">Pending ({pendingBids.length})</span>
                            <div className="dashboard-progress"><span style={{ width: `${bids.length ? (pendingBids.length / bids.length) * 100 : 0}%` }} /></div>
                        </div>
                        <div>
                            <span className="dashboard-progress-row__label">Accepted ({acceptedBids.length})</span>
                            <div className="dashboard-progress dashboard-progress--green"><span style={{ width: `${bids.length ? (acceptedBids.length / bids.length) * 100 : 0}%` }} /></div>
                        </div>
                    </div>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Pending Proposals</div>
                    <div className="dashboard-stat__value">{pendingBids.length}</div>
                    <p className="dashboard-stat__note">
                        <FaClock /> Under client review
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat dashboard-stat--accent">
                    <div className="dashboard-stat__eyebrow">Average Bid</div>
                    <div className="dashboard-stat__value">${averageBid}</div>
                    <p className="dashboard-stat__note">
                        <FaArrowTrendUp /> Competitive positioning
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Profile Rating</div>
                    <div className="dashboard-stat__value">{profile?.averageRating?.toFixed?.(1) || "0.0"}</div>
                    <p className="dashboard-stat__note">
                        <FaStar /> {profile?.totalReviews || 0} reviews
                    </p>
                </article>
            </section>

            <section className="dashboard-grid-layout">
                <article className="dashboard-panel dashboard-panel--main">
                    <div className="dashboard-panel__header">
                        <div>
                            <h2>Recent Proposal Activity</h2>
                            <p>Your latest bids and their current delivery pressure.</p>
                        </div>
                        <Link to="/my-bids" className="section-link">
                            View all bids
                        </Link>
                    </div>

                    {recentBids.length > 0 ? (
                        <div className="dashboard-activity-list">
                            {recentBids.map((bid) => (
                                <article key={bid._id} className="dashboard-activity-item">
                                    <div className="dashboard-activity-item__main">
                                        <div className="dashboard-activity-item__title-row">
                                            <h3>{bid.projectId?.title || "Project"}</h3>
                                            <BidStatusBadge status={bid.status} />
                                        </div>
                                        <p>
                                            {bid.proposal?.length > 125
                                                ? `${bid.proposal.slice(0, 125)}...`
                                                : bid.proposal}
                                        </p>
                                        <div className="dashboard-activity-item__meta">
                                            <span><FaBriefcase /> ${bid.bidAmount}</span>
                                            <span><FaClock /> {bid.deliveryTime} days</span>
                                            <span>Edit count: {bid.editCount}</span>
                                        </div>
                                    </div>
                                    <div className="dashboard-activity-item__actions">
                                        <Button as={Link} to={`/projects/${bid.projectId?._id}`} tone="light">
                                            View
                                        </Button>
                                        {bid.status === "pending" && bid.editCount < 2 ? (
                                            <Button as={Link} to={`/bids/${bid._id}/edit`}>
                                                Edit
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
                </article>

                <div className="dashboard-side-column">
                    <article className="dashboard-panel">
                        <div className="dashboard-panel__header">
                            <div>
                                <h2>Profile Health</h2>
                                <p>Keep your profile ready to convert faster.</p>
                            </div>
                        </div>
                        <div className="dashboard-health">
                            <div className="dashboard-health__meter">
                                <span>Profile completion</span>
                                <strong>{profileCompletion}%</strong>
                            </div>
                            <div className="dashboard-progress dashboard-progress--green">
                                <span style={{ width: `${profileCompletion}%` }} />
                            </div>
                            <ul className="dashboard-mini-list">
                                <li>{profile ? "Developer profile is live" : "Create your developer profile"}</li>
                                <li>{profile?.skills?.length || 0} skills listed</li>
                                <li>{acceptedBids.length} accepted projects in queue</li>
                            </ul>
                        </div>
                        <Button as={Link} to={profile ? "/developer/profile" : "/developer/profile/create"}>
                            {profile ? "Open Profile" : "Create Profile"}
                        </Button>
                    </article>

                    <article className="dashboard-panel dashboard-panel--dark">
                        <div className="dashboard-panel__header">
                            <div>
                                <h2>Delivery Queue</h2>
                                <p>Accepted work waiting for updates or submission.</p>
                            </div>
                        </div>
                        <div className="dashboard-side-stat">{acceptedBids.length}</div>
                        <p className="dashboard-panel__support">
                            Move active projects toward submission and keep turnaround times healthy.
                        </p>
                        <Button as={Link} to="/developer/accepted-projects" tone="light">
                            Open Accepted Work
                        </Button>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default DeveloperDashboard;
