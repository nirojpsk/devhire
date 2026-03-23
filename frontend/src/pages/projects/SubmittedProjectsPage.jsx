import { useState } from "react";
import { Spinner, Alert, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useGetSubmittedProjectsQuery,
    useReviewSubmittedProjectMutation,
    useReviewDeveloperForProjectMutation,
} from "../../api/projectApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";
import BidStatusBadge from "../../components/bids/BidStatusBadge";
import ProjectStatusBadge from "../../components/projects/ProjectStatusBadge";

function SubmittedProjectsPage() {
    const { data, isLoading, error } = useGetSubmittedProjectsQuery();
    const [reviewSubmittedProject, { isLoading: loadingReview }] = useReviewSubmittedProjectMutation();
    const [reviewDeveloperForProject, { isLoading: loadingDeveloperReview }] = useReviewDeveloperForProjectMutation();
    const [decisionNotes, setDecisionNotes] = useState({});
    const [reviewInputs, setReviewInputs] = useState({});

    const projects = data?.projects || [];
    const pendingDecisions = projects.filter(
        (project) => !project.submission?.clientDecision?.status || project.submission?.clientDecision?.status === "pending"
    ).length;
    const acceptedDecisions = projects.filter(
        (project) => project.submission?.clientDecision?.status === "accepted"
    ).length;
    const rejectedDecisions = projects.filter(
        (project) => project.submission?.clientDecision?.status === "rejected"
    ).length;

    const handleDecision = async (projectId, action) => {
        const note = decisionNotes[projectId]?.trim();
        if (!note) {
            toast.error("Please add a note before submitting your decision");
            return;
        }

        try {
            const res = await reviewSubmittedProject({
                projectId,
                data: { action, note },
            }).unwrap();
            toast.success(res?.message || "Decision submitted successfully");
            setDecisionNotes((prev) => ({ ...prev, [projectId]: "" }));
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to submit decision"));
        }
    };

    const handleAddReview = async (project) => {
        const projectId = project._id;
        const input = reviewInputs[projectId] || {};
        const rating = Number(input.rating);
        const comment = (input.comment || "").trim();

        if (!rating || rating < 1 || rating > 5) {
            toast.error("Please select a rating between 1 and 5");
            return;
        }

        if (!comment) {
            toast.error("Please add a review comment");
            return;
        }

        try {
            const res = await reviewDeveloperForProject({
                projectId,
                data: { rating, comment },
            }).unwrap();
            toast.success(res?.message || "Review added successfully");
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to add review"));
        }
    };

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Client review queue</span>
                    <h1 className="page-title page-title--compact">Submitted Projects</h1>
                    <p className="page-subtitle">
                        Review submitted work in a more spacious layout, with room for submission notes, client decisions, and developer ratings.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/client/dashboard" tone="light">
                        Back to Dashboard
                    </Button>
                </div>
            </section>

            <section className="metric-grid">
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Submitted Projects</div>
                    <div className="stats-card__value">{projects.length}</div>
                    <p className="metric-note">Everything waiting in or completed through review</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Pending Decision</div>
                    <div className="stats-card__value">{pendingDecisions}</div>
                    <p className="metric-note">Need your acceptance or rejection note</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Accepted</div>
                    <div className="stats-card__value">{acceptedDecisions}</div>
                    <p className="metric-note">Submitted work you have approved</p>
                </article>
                <article className="stats-card interactive-card">
                    <div className="stats-card__label">Rejected</div>
                    <div className="stats-card__value">{rejectedDecisions}</div>
                    <p className="metric-note">Projects currently sent back for changes</p>
                </article>
            </section>

            <section className="dashboard-section">
                {isLoading ? (
                    <div className="loading-state">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">
                        {error?.data?.message || error?.error || "Error fetching submitted projects"}
                    </Alert>
                ) : projects.length === 0 ? (
                    <div className="empty-state">No submitted projects yet.</div>
                ) : (
                    <div className="dashboard-stack">
                        {projects.map((project) => {
                            const decisionStatus = project.submission?.clientDecision?.status || "pending";
                            const canReview = decisionStatus === "pending";
                            const canRateDeveloper = decisionStatus === "accepted" || decisionStatus === "rejected";
                            const hasSubmittedReview = !!project.submission?.clientReview?.reviewedAt;
                            const reviewLocked = decisionStatus === "accepted" && hasSubmittedReview;

                            return (
                                <article key={project._id} className="detail-card interactive-card">
                                    <div className="detail-card__section">
                                        <div className="page-actions">
                                            <ProjectStatusBadge status={project.status} />
                                            <BidStatusBadge status={decisionStatus} />
                                            <span className="app-chip">
                                                {project.selectedDeveloper?.name || project.submission?.submittedBy?.name || "Developer"}
                                            </span>
                                        </div>

                                        <h2 className="detail-card__title">{project.title}</h2>

                                        <div className="meta-row">
                                            <span><strong>Submitted By:</strong> {project.submission?.submittedBy?.name || project.selectedDeveloper?.name || "N/A"}</span>
                                            <span><strong>Submitted On:</strong> {project.submission?.submittedAt ? new Date(project.submission.submittedAt).toLocaleDateString() : "N/A"}</span>
                                            <span>
                                                <strong>Submission Link:</strong>{" "}
                                                {project.submission?.link ? (
                                                    <a href={project.submission.link} target="_blank" rel="noreferrer">
                                                        Open Link
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </span>
                                        </div>

                                        <p>{project.submission?.note || "No developer note was provided with this submission."}</p>
                                    </div>

                                    {project.submission?.clientDecision?.note ? (
                                        <div className="detail-card__section">
                                            <h3>Your latest decision note</h3>
                                            <p>{project.submission.clientDecision.note}</p>
                                        </div>
                                    ) : null}

                                    {canRateDeveloper ? (
                                        <div className="detail-card__section">
                                            <div className="surface-card surface-card--soft">
                                                <div className="stacked-info">
                                                    <h3>Rate developer</h3>

                                                    {hasSubmittedReview ? (
                                                        <Alert variant="success" className="mb-0">
                                                            <strong>Existing review:</strong>
                                                            <br />
                                                            Rating: {project.submission.clientReview.rating}/5
                                                            <br />
                                                            Comment: {project.submission.clientReview.comment}
                                                        </Alert>
                                                    ) : null}

                                                    {reviewLocked ? (
                                                        <Alert variant="info" className="mb-0">
                                                            Review is locked because this project has been accepted.
                                                        </Alert>
                                                    ) : (
                                                        <>
                                                            <Form.Group controlId={`rating-${project._id}`}>
                                                                <Form.Label>Rating</Form.Label>
                                                                <Form.Select
                                                                    value={reviewInputs[project._id]?.rating || project.submission?.clientReview?.rating || ""}
                                                                    onChange={(e) =>
                                                                        setReviewInputs((prev) => ({
                                                                            ...prev,
                                                                            [project._id]: {
                                                                                ...(prev[project._id] || {}),
                                                                                rating: e.target.value,
                                                                            },
                                                                        }))
                                                                    }
                                                                >
                                                                    <option value="">Select rating</option>
                                                                    <option value="1">1 - Poor</option>
                                                                    <option value="2">2 - Fair</option>
                                                                    <option value="3">3 - Good</option>
                                                                    <option value="4">4 - Very Good</option>
                                                                    <option value="5">5 - Excellent</option>
                                                                </Form.Select>
                                                            </Form.Group>

                                                            <Form.Group controlId={`comment-${project._id}`}>
                                                                <Form.Label>Comment</Form.Label>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={3}
                                                                    placeholder="Write your feedback for the developer"
                                                                    value={reviewInputs[project._id]?.comment || project.submission?.clientReview?.comment || ""}
                                                                    onChange={(e) =>
                                                                        setReviewInputs((prev) => ({
                                                                            ...prev,
                                                                            [project._id]: {
                                                                                ...(prev[project._id] || {}),
                                                                                comment: e.target.value,
                                                                            },
                                                                        }))
                                                                    }
                                                                />
                                                            </Form.Group>

                                                            <div className="page-actions">
                                                                <Button
                                                                    tone="success"
                                                                    disabled={loadingDeveloperReview}
                                                                    onClick={() => handleAddReview(project)}
                                                                >
                                                                    {loadingDeveloperReview
                                                                        ? "Submitting..."
                                                                        : hasSubmittedReview
                                                                            ? "Update Review"
                                                                            : "Submit Review"}
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    {canReview ? (
                                        <div className="detail-card__section">
                                            <h3>Decision note</h3>
                                            <Form.Group controlId={`decision-note-${project._id}`}>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Write your acceptance or rejection note"
                                                    value={decisionNotes[project._id] || ""}
                                                    onChange={(e) =>
                                                        setDecisionNotes((prev) => ({
                                                            ...prev,
                                                            [project._id]: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </Form.Group>
                                        </div>
                                    ) : null}

                                    <div className="detail-card__section">
                                        <div className="page-actions">
                                            <Button as={Link} to={`/projects/${project._id}`} tone="light">
                                                View Project
                                            </Button>

                                            {canReview ? (
                                                <>
                                                    <Button
                                                        tone="success"
                                                        disabled={loadingReview}
                                                        onClick={() => handleDecision(project._id, "accept")}
                                                    >
                                                        Accept Project
                                                    </Button>
                                                    <Button
                                                        tone="danger"
                                                        disabled={loadingReview}
                                                        onClick={() => handleDecision(project._id, "reject")}
                                                    >
                                                        Reject Project
                                                    </Button>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default SubmittedProjectsPage;
