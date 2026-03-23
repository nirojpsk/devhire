import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetClientBidsQuery } from '../../api/bidApiSlice';
import Button from '../../components/ui/Button';
import BidStatusBadge from '../../components/bids/BidStatusBadge';

function ClientBidsPage() {
    const { data, isLoading, error } = useGetClientBidsQuery();
    const bids = data?.bids || [];

    const pendingCount = bids.filter((bid) => bid.status === 'pending').length;
    const acceptedCount = bids.filter((bid) => bid.status === 'accepted').length;
    const rejectedCount = bids.filter((bid) => bid.status === 'rejected').length;

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Client proposal overview</span>
                    <h1 className="page-title page-title--compact">All Bids</h1>
                    <p className="page-subtitle">
                        See every incoming proposal in the same roomier layout, with space for developer context, proposal summary, and quick actions.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to='/client/dashboard' tone="light">
                        Back to Dashboard
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Total Bids</div>
                    <div className="stats-card__value">{bids.length}</div>
                    <p className="metric-note">Every proposal submitted across your projects</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Pending</div>
                    <div className="stats-card__value">{pendingCount}</div>
                    <p className="metric-note">Still waiting for your decision</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Accepted</div>
                    <div className="stats-card__value">{acceptedCount}</div>
                    <p className="metric-note">Proposals you have already approved</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Rejected</div>
                    <div className="stats-card__value">{rejectedCount}</div>
                    <p className="metric-note">Closed proposals with a final decision</p>
                </article>
            </section>

            <section className="dashboard-section">
                {isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant='danger'>
                        {error?.data?.message || error?.error || 'Error fetching bids'}
                    </Alert>
                ) : bids.length === 0 ? (
                    <div className="empty-state">No bids found for your projects yet.</div>
                ) : (
                    <div className="dashboard-stack">
                        {bids.map((bid) => (
                            <article key={bid._id} className="dashboard-card dashboard-list-card interactive-card">
                                <div className="dashboard-list-card__main">
                                    <div className="page-actions">
                                        <BidStatusBadge status={bid.status} />
                                        <span className="app-chip">
                                            {bid.projectId?.skillsRequired?.[0] || "Proposal"}
                                        </span>
                                    </div>

                                    <h2 className="dashboard-list-card__title">{bid.projectId?.title || 'Project'}</h2>

                                    <p>
                                        {bid.proposal?.length > 220
                                            ? `${bid.proposal.substring(0, 220)}...`
                                            : bid.proposal}
                                    </p>

                                    <div className="meta-row">
                                        <span><strong>Developer:</strong> {bid.developerId?.name || 'N/A'}</span>
                                        <span><strong>Email:</strong> {bid.developerId?.email || 'N/A'}</span>
                                        <span><strong>Bid Amount:</strong> ${bid.bidAmount}</span>
                                        <span><strong>Delivery Time:</strong> {bid.deliveryTime} days</span>
                                    </div>
                                </div>

                                <div className="dashboard-list-card__aside">
                                    {bid.developerId?._id ? (
                                        <Button
                                            as={Link}
                                            to={`/developers/${bid.developerId._id}/profile`}
                                            tone='light'
                                        >
                                            View Developer
                                        </Button>
                                    ) : null}
                                    <Button
                                        as={Link}
                                        to={`/projects/${bid.projectId?._id}/bids`}
                                    >
                                        Manage Bid
                                    </Button>
                                    <Button
                                        as={Link}
                                        to={`/projects/${bid.projectId?._id}`}
                                        tone='light'
                                    >
                                        View Project
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ClientBidsPage;
