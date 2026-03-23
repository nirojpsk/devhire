import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetMyBidsQuery } from '../../api/bidApiSlice';
import Button from '../../components/ui/Button';
import BidStatusBadge from '../../components/bids/BidStatusBadge';

function AcceptedProjectsPage() {
    const { data, isLoading, error } = useGetMyBidsQuery();
    const bids = data?.bids || [];

    const acceptedProjectBids = bids.filter(
        (bid) => bid.status === 'accepted' && bid.projectId?._id
    );

    const submittedCount = acceptedProjectBids.filter((bid) => bid.projectId?.submission?.submittedAt).length;
    const pendingClientDecisionCount = acceptedProjectBids.filter(
        (bid) => bid.projectId?.submission?.submittedAt && !bid.projectId?.submission?.clientDecision?.status
    ).length;

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Delivery queue</span>
                    <h1 className="page-title page-title--compact">Accepted Projects</h1>
                    <p className="page-subtitle">
                        Track accepted work in a wider, calmer layout with room for submission history, client feedback, and next actions.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/developer/dashboard" tone="light">
                        Back to Dashboard
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Accepted Projects</div>
                    <div className="stats-card__value">{acceptedProjectBids.length}</div>
                    <p className="metric-note">Projects you are currently responsible for delivering</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Submitted</div>
                    <div className="stats-card__value">{submittedCount}</div>
                    <p className="metric-note">Work already sent back to the client</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Awaiting Decision</div>
                    <div className="stats-card__value">{pendingClientDecisionCount}</div>
                    <p className="metric-note">Submitted projects still waiting for client review</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Ready to Submit</div>
                    <div className="stats-card__value">{acceptedProjectBids.length - submittedCount}</div>
                    <p className="metric-note">Accepted projects with no submission yet</p>
                </article>
            </section>

            <section className="dashboard-section">
                {isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant='danger'>
                        {error?.data?.message || error?.error || 'Error fetching accepted projects'}
                    </Alert>
                ) : acceptedProjectBids.length === 0 ? (
                    <div className="empty-state">No accepted projects yet.</div>
                ) : (
                    <div className="dashboard-stack">
                        {acceptedProjectBids.map((bid) => (
                            <article key={bid._id} className="dashboard-card dashboard-list-card interactive-card">
                                <div className="dashboard-list-card__main">
                                    <div className="page-actions">
                                        <BidStatusBadge status="accepted" />
                                        <span className="app-chip">
                                            {bid.projectId?.skillsRequired?.[0] || "Delivery"}
                                        </span>
                                    </div>

                                    <h2 className="dashboard-list-card__title">{bid.projectId?.title || 'Project'}</h2>

                                    <div className="meta-row">
                                        <span><strong>Your Bid:</strong> ${bid.bidAmount}</span>
                                        <span><strong>Delivery Time:</strong> {bid.deliveryTime} days</span>
                                        <span><strong>Project Budget:</strong> ${bid.projectId?.budget?.min} - ${bid.projectId?.budget?.max}</span>
                                        <span><strong>Deadline:</strong> {bid.projectId?.deadline ? new Date(bid.projectId.deadline).toLocaleDateString() : 'N/A'}</span>
                                    </div>

                                    {bid.projectId?.submission?.submittedAt ? (
                                        <Alert variant='success' className='mb-0'>
                                            <strong>Project submitted:</strong>{' '}
                                            {new Date(bid.projectId.submission.submittedAt).toLocaleDateString()}
                                            {bid.projectId.submission.link ? (
                                                <>
                                                    {' '}|{' '}
                                                    <a href={bid.projectId.submission.link} target='_blank' rel='noreferrer'>
                                                        Open submission
                                                    </a>
                                                </>
                                            ) : null}
                                        </Alert>
                                    ) : (
                                        <p className="proposal-summary">
                                            This project has been accepted and is ready for your delivery workflow.
                                        </p>
                                    )}

                                    {bid.projectId?.submission?.clientDecision?.status ? (
                                        <Alert
                                            variant={
                                                bid.projectId.submission.clientDecision.status === 'accepted'
                                                    ? 'success'
                                                    : bid.projectId.submission.clientDecision.status === 'rejected'
                                                        ? 'danger'
                                                        : 'warning'
                                            }
                                            className='mb-0'
                                        >
                                            <strong>Client Decision:</strong>{' '}
                                            {bid.projectId.submission.clientDecision.status}
                                            {bid.projectId.submission.clientDecision.note ? (
                                                <>
                                                    <br />
                                                    <strong>Client Note:</strong>{' '}
                                                    {bid.projectId.submission.clientDecision.note}
                                                </>
                                            ) : null}
                                        </Alert>
                                    ) : null}
                                </div>

                                <div className="dashboard-list-card__aside">
                                    {!bid.projectId?.submission?.submittedAt ? (
                                        <Button
                                            as={Link}
                                            to={`/projects/${bid.projectId?._id}/submit`}
                                            tone='success'
                                        >
                                            Submit Project
                                        </Button>
                                    ) : null}

                                    {bid.projectId?.submission?.clientDecision?.status === 'rejected' ? (
                                        <Button
                                            as={Link}
                                            to={`/projects/${bid.projectId?._id}/submit`}
                                            tone='light'
                                        >
                                            Resubmit Project
                                        </Button>
                                    ) : null}

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

export default AcceptedProjectsPage;
