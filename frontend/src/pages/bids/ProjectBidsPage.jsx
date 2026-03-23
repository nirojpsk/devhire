import { Alert, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetBidsForProjectQuery, useAcceptBidMutation, useRejectBidMutation } from "../../api/bidApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";
import BidStatusBadge from "../../components/bids/BidStatusBadge";

function ProjectBidsPage() {
    const { projectId } = useParams();

    const { data, isLoading, error } = useGetBidsForProjectQuery(projectId);
    const [acceptBid, { isLoading: loadingAccept }] = useAcceptBidMutation();
    const [rejectBid, { isLoading: loadingReject }] = useRejectBidMutation();

    const bids = data?.bids || [];
    const hasAcceptedBid = bids.some((bid) => bid.status === "accepted");
    const averageBid = bids.length > 0
        ? Math.round(bids.reduce((sum, bid) => sum + Number(bid.bidAmount || 0), 0) / bids.length)
        : 0;

    const acceptHandler = async (bidId) => {
        try {
            const res = await acceptBid(bidId).unwrap();
            toast.success(res?.message || "Bid accepted successfully");
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to accept bid"));
        }
    };

    const rejectHandler = async (bidId) => {
        try {
            const res = await rejectBid(bidId).unwrap();
            toast.success(res?.message || "Bid rejected successfully");
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to reject bid"));
        }
    };

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Client bid review</span>
                    <h1 className="page-title page-title--compact">Project Bids</h1>
                    <p className="page-subtitle">
                        Compare proposals, review delivery timelines, and accept the strongest fit for your project.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to={`/projects/${projectId}`} tone="light">
                        Back to Project
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Total proposals</div>
                    <div className="stats-card__value">{bids.length}</div>
                    <p className="metric-note">All bids currently submitted for this project</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Average bid</div>
                    <div className="stats-card__value">${averageBid}</div>
                    <p className="metric-note">A quick budget benchmark across candidates</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Pending review</div>
                    <div className="stats-card__value">{bids.filter((bid) => bid.status === "pending").length}</div>
                    <p className="metric-note">Still awaiting a client decision</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Accepted</div>
                    <div className="stats-card__value">{hasAcceptedBid ? 1 : 0}</div>
                    <p className="metric-note">Once a bid is accepted, other pending bids remain locked</p>
                </article>
            </section>

            <section className="dashboard-section">
                {isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">
                        {error?.data?.message || error?.error || "Error fetching bids"}
                    </Alert>
                ) : bids.length === 0 ? (
                    <div className="empty-state">No bids found for this project yet.</div>
                ) : (
                    <div className="bid-list">
                        {hasAcceptedBid ? (
                            <Alert variant="info">
                                A bid has already been accepted for this project. Remaining bids can no longer be accepted.
                            </Alert>
                        ) : null}

                        {bids.map((bid) => (
                            <article key={bid._id} className="bid-card interactive-card">
                                <div className="proposal-layout">
                                    <div className="proposal-layout__profile">
                                        <div className="proposal-layout__profile-card">
                                            <div className="page-actions mb-3">
                                                <BidStatusBadge status={bid.status} />
                                            </div>
                                            <h3>{bid.developerId?.name || "Developer"}</h3>
                                            <p>{bid.developerId?.email || "N/A"}</p>
                                            <div className="chip-list mt-3">
                                                <span className="app-chip">Bid ${bid.bidAmount}</span>
                                                <span className="app-chip">{bid.deliveryTime} days</span>
                                            </div>
                                        </div>

                                        {bid.developerId?._id ? (
                                            <Button
                                                as={Link}
                                                to={`/developers/${bid.developerId._id}/profile`}
                                                tone="light"
                                            >
                                                View Profile
                                            </Button>
                                        ) : null}
                                    </div>

                                    <div className="proposal-layout__content">
                                        <div className="stacked-info">
                                            <div className="stats-card__label">Proposal summary</div>
                                            <p className="proposal-summary">{bid.proposal}</p>
                                        </div>

                                        <div className="meta-row">
                                            <span><strong>Status:</strong> {bid.status}</span>
                                            <span><strong>Bid Amount:</strong> ${bid.bidAmount}</span>
                                            <span><strong>Delivery Time:</strong> {bid.deliveryTime} days</span>
                                        </div>
                                    </div>

                                    <div className="proposal-actions">
                                        <Button
                                            tone="success"
                                            disabled={loadingAccept || bid.status !== "pending" || hasAcceptedBid}
                                            onClick={() => acceptHandler(bid._id)}
                                        >
                                            {loadingAccept ? "Accepting..." : "Accept Bid"}
                                        </Button>

                                        <Button
                                            tone="danger"
                                            disabled={loadingReject || bid.status !== "pending"}
                                            onClick={() => rejectHandler(bid._id)}
                                        >
                                            {loadingReject ? "Rejecting..." : "Reject Bid"}
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ProjectBidsPage;
