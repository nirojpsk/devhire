import { Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useGetMyBidsQuery,
    useDeleteBidMutation,
} from "../../api/bidApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";
import BidStatusBadge from "../../components/bids/BidStatusBadge";

function MyBidsPage() {
    const { data, isLoading, error } = useGetMyBidsQuery();
    const [deleteBid, { isLoading: loadingDelete }] = useDeleteBidMutation();

    const bids = data?.bids || [];
    const acceptedCount = bids.filter((bid) => bid.status === "accepted").length;
    const pendingCount = bids.filter((bid) => bid.status === "pending").length;

    const deleteHandler = async (bidId) => {
        if (window.confirm("Are you sure you want to delete this bid?")) {
            try {
                const res = await deleteBid(bidId).unwrap();
                toast.success(res?.message || "Bid deleted successfully");
            } catch (err) {
                toast.error(getErrorMessage(err, "Unable to delete bid"));
            }
        }
    };

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Developer proposals</span>
                    <h1 className="page-title page-title--compact">My Bids</h1>
                    <p className="page-subtitle">
                        Keep track of every proposal you have submitted, the current status, and the next action you can take.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/projects">
                        Browse Projects
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Total Bids</div>
                    <div className="stats-card__value">{bids.length}</div>
                    <p className="metric-note">All proposals submitted through DevHire</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Pending</div>
                    <div className="stats-card__value">{pendingCount}</div>
                    <p className="metric-note">Still waiting on client review</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Accepted</div>
                    <div className="stats-card__value">{acceptedCount}</div>
                    <p className="metric-note">Projects where your proposal won</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Editable</div>
                    <div className="stats-card__value">
                        {bids.filter((bid) => bid.status === "pending" && bid.editCount < 2).length}
                    </div>
                    <p className="metric-note">Pending bids that still allow edits</p>
                </article>
            </section>

            <section className="dashboard-section">
                {isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">
                        {error?.data?.message || error?.error || "Error fetching your bids"}
                    </Alert>
                ) : bids.length === 0 ? (
                    <div className="empty-state">
                        You have not placed any bids yet. Browse projects to send your first proposal.
                    </div>
                ) : (
                    <div className="bid-list">
                        {bids.map((bid) => (
                            <article key={bid._id} className="bid-card interactive-card">
                                <div className="bid-card__top">
                                    <div className="stacked-info">
                                        <div className="page-actions">
                                            <BidStatusBadge status={bid.status} />
                                            <span className="app-chip">
                                                {bid.projectId?.skillsRequired?.[0] || "Proposal"}
                                            </span>
                                        </div>
                                        <h2 className="project-list-card__title">{bid.projectId?.title || "Project"}</h2>
                                        <p className="proposal-summary">
                                            {bid.proposal?.length > 210
                                                ? `${bid.proposal.substring(0, 210)}...`
                                                : bid.proposal}
                                        </p>
                                    </div>
                                    <div className="proposal-actions">
                                        <Button as={Link} to={`/projects/${bid.projectId?._id}`}>
                                            View Project
                                        </Button>

                                        {bid.status === "pending" && bid.editCount < 2 ? (
                                            <Button as={Link} to={`/bids/${bid._id}/edit`} tone="light">
                                                Edit Bid
                                            </Button>
                                        ) : null}

                                        <Button
                                            tone="danger"
                                            disabled={loadingDelete || bid.status !== "pending"}
                                            onClick={() => deleteHandler(bid._id)}
                                        >
                                            {loadingDelete ? "Deleting..." : "Delete Bid"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="meta-row">
                                    <span><strong>Bid Amount:</strong> ${bid.bidAmount}</span>
                                    <span><strong>Delivery Time:</strong> {bid.deliveryTime} days</span>
                                    <span><strong>Edit Count:</strong> {bid.editCount}</span>
                                </div>

                                {bid.status === "pending" && bid.editCount >= 2 ? (
                                    <Alert variant="info" className="mb-0">
                                        You have reached the maximum number of allowed bid edits for this project.
                                    </Alert>
                                ) : null}
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default MyBidsPage;
