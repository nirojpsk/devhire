import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCalendarDay, FaClipboardCheck, FaRocket } from 'react-icons/fa6';
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
        <div className="dashboard-screen">
            <section className="dashboard-hero">
                <div>
                    <span className="eyebrow">Delivery queue</span>
                    <h1 className="dashboard-hero__title">Accepted Projects</h1>
                    <p className="dashboard-hero__subtitle">
                        Track accepted work in a calmer layout with room for submission history, client feedback, and next actions.
                    </p>
                </div>
                <div className="dashboard-hero__actions">
                    <Button as={Link} to="/developer/dashboard" tone="light">
                        Back to Dashboard
                    </Button>
                </div>
            </section>

            <section className="dashboard-metrics dashboard-metrics--developer">
                <article className="dashboard-panel dashboard-stat dashboard-stat--wide">
                    <div className="dashboard-stat__eyebrow">Accepted Projects</div>
                    <div className="dashboard-stat__value">{acceptedProjectBids.length}</div>
                    <div className="dashboard-progress-row">
                        <div>
                            <span className="dashboard-progress-row__label">Submitted ({submittedCount})</span>
                            <div className="dashboard-progress"><span style={{ width: `${acceptedProjectBids.length ? (submittedCount / acceptedProjectBids.length) * 100 : 0}%` }} /></div>
                        </div>
                        <div>
                            <span className="dashboard-progress-row__label">Awaiting Decision ({pendingClientDecisionCount})</span>
                            <div className="dashboard-progress dashboard-progress--green"><span style={{ width: `${acceptedProjectBids.length ? (pendingClientDecisionCount / acceptedProjectBids.length) * 100 : 0}%` }} /></div>
                        </div>
                    </div>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Submitted</div>
                    <div className="dashboard-stat__value">{submittedCount}</div>
                    <p className="dashboard-stat__note">
                        <FaClipboardCheck /> Delivery sent
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat">
                    <div className="dashboard-stat__eyebrow">Awaiting Decision</div>
                    <div className="dashboard-stat__value">{pendingClientDecisionCount}</div>
                    <p className="dashboard-stat__note">
                        <FaCalendarDay /> Client response pending
                    </p>
                </article>
                <article className="dashboard-panel dashboard-stat dashboard-stat--accent">
                    <div className="dashboard-stat__eyebrow">Ready to Submit</div>
                    <div className="dashboard-stat__value">{acceptedProjectBids.length - submittedCount}</div>
                    <p className="dashboard-stat__note">
                        <FaRocket /> Delivery work in motion
                    </p>
                </article>
            </section>

            <section className="dashboard-grid-layout">
                <article className="dashboard-panel dashboard-panel--main">
                    <div className="dashboard-panel__header">
                        <div>
                            <h2>Accepted Work Queue</h2>
                            <p>Everything you are currently responsible for delivering.</p>
                        </div>
                    </div>

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
                    <div className="dashboard-activity-list">
                        {acceptedProjectBids.map((bid) => (
                            <article key={bid._id} className="dashboard-activity-item">
                                <div className="dashboard-activity-item__main">
                                    <div className="dashboard-activity-item__title-row">
                                        <h3>{bid.projectId?.title || 'Project'}</h3>
                                        <BidStatusBadge status="accepted" />
                                    </div>

                                    <div className="dashboard-activity-item__meta">
                                        <span>Your Bid: ${bid.bidAmount}</span>
                                        <span>Delivery: {bid.deliveryTime} days</span>
                                        <span>Budget: ${bid.projectId?.budget?.min} - ${bid.projectId?.budget?.max}</span>
                                        <span>Deadline: {bid.projectId?.deadline ? new Date(bid.projectId.deadline).toLocaleDateString() : 'N/A'}</span>
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

                                <div className="dashboard-activity-item__actions">
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

                </article>

                <div className="dashboard-side-column">
                    <article className="dashboard-panel dashboard-panel--dark">
                        <div className="dashboard-panel__header">
                            <div>
                                <h2>Delivery Notes</h2>
                                <p>Keep accepted work moving steadily through review.</p>
                            </div>
                        </div>
                        <ul className="dashboard-mini-list">
                            <li>{acceptedProjectBids.length} projects are currently in your queue</li>
                            <li>{submittedCount} have already been submitted to clients</li>
                            <li>{acceptedProjectBids.length - submittedCount} are still ready for first delivery</li>
                        </ul>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default AcceptedProjectsPage;
