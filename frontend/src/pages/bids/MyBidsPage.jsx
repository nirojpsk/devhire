import { Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBriefcase, FaClock, FaPenRuler, FaTrash } from "react-icons/fa6";
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
        <div className="dashboard-screen">
            <section className="dashboard-hero">
                <div>
                    <span className="eyebrow">Developer proposals</span>
                    <h1 className="dashboard-hero__title">My Bids</h1>
                    <p className="dashboard-hero__subtitle">
                        Keep track of every proposal you have submitted, the current status, and the next action you can take.
                    </p>
                </div>
                <div className="dashboard-hero__actions">
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
                            <span className="dashboard-progress-row__label">Pending ({pendingCount})</span>
                            <div className="dashboard-progress"><span style={{ width: `${bids.length ? (pendingCount / bids.length) * 100 : 0}%` }} /></div>
                        </div>
                        <div>
                            <span className="dashboard-progress-row__label">Accepted ({acceptedCount})</span>
                            <div className="dashboard-progress dashboard-progress--green"><span style={{ width: `${bids.length ? (acceptedCount / bids.length) * 100 : 0}%` }} /></div>
                        </div>
                    </div>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Pending</div>
                    <div className="dashboard-stat__value">{pendingCount}</div>
                    <p className="dashboard-stat__note">
                        <FaClock /> Waiting on review
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Accepted</div>
                    <div className="dashboard-stat__value">{acceptedCount}</div>
                    <p className="dashboard-stat__note">
                        <FaBriefcase /> Won proposals
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat dashboard-stat--accent">
                    <div className="dashboard-stat__eyebrow">Editable</div>
                    <div className="dashboard-stat__value">
                        {bids.filter((bid) => bid.status === "pending" && bid.editCount < 2).length}
                    </div>
                    <p className="dashboard-stat__note">
                        <FaPenRuler /> Still open to edits
                    </p>
                </article>
            </section>

            <section className="dashboard-grid-layout">
                <article className="dashboard-panel dashboard-panel--main">
                    <div className="dashboard-panel__header">
                        <div>
                            <h2>Proposal Activity</h2>
                            <p>All of your submitted bids in one clean workflow view.</p>
                        </div>
                    </div>

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
                    <div className="dashboard-activity-list">
                        {bids.map((bid) => (
                            <article key={bid._id} className="dashboard-activity-item">
                                <div className="dashboard-activity-item__main">
                                    <div className="dashboard-activity-item__title-row">
                                        <h3>{bid.projectId?.title || "Project"}</h3>
                                        <BidStatusBadge status={bid.status} />
                                    </div>
                                    <p className="proposal-summary">
                                        {bid.proposal?.length > 140
                                            ? `${bid.proposal.substring(0, 140)}...`
                                            : bid.proposal}
                                    </p>
                                    <div className="dashboard-activity-item__meta">
                                        <span><FaBriefcase /> ${bid.bidAmount}</span>
                                        <span><FaClock /> {bid.deliveryTime} days</span>
                                        <span>Edit count: {bid.editCount}</span>
                                    </div>
                                    {bid.status === "pending" && bid.editCount >= 2 ? (
                                        <Alert variant="info" className="mb-0">
                                            You have reached the maximum number of allowed bid edits for this project.
                                        </Alert>
                                    ) : null}
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
                                    <Button
                                        tone="danger"
                                        disabled={loadingDelete || bid.status !== "pending"}
                                        onClick={() => deleteHandler(bid._id)}
                                    >
                                        <FaTrash />
                                        {loadingDelete ? "Deleting..." : "Delete"}
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                </article>

                <div className="dashboard-side-column">
                    <article className="dashboard-panel">
                        <div className="dashboard-panel__header">
                            <div>
                                <h2>Proposal Notes</h2>
                                <p>Use these signals to decide where to focus next.</p>
                            </div>
                        </div>
                        <ul className="dashboard-mini-list">
                            <li>{pendingCount} proposals are still under review</li>
                            <li>{acceptedCount} proposals have converted into work</li>
                            <li>{bids.filter((bid) => bid.status === "pending" && bid.editCount < 2).length} bids can still be edited</li>
                        </ul>
                        <Button as={Link} to="/projects" tone="light">
                            Find New Projects
                        </Button>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default MyBidsPage;
