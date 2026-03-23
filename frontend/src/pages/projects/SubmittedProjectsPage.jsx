import { useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Badge, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useGetSubmittedProjectsQuery,
    useReviewSubmittedProjectMutation,
    useReviewDeveloperForProjectMutation,
} from "../../api/projectApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";

function SubmittedProjectsPage() {
    const { data, isLoading, error } = useGetSubmittedProjectsQuery();
    const [reviewSubmittedProject, { isLoading: loadingReview }] = useReviewSubmittedProjectMutation();
    const [reviewDeveloperForProject, { isLoading: loadingDeveloperReview }] = useReviewDeveloperForProjectMutation();
    const [decisionNotes, setDecisionNotes] = useState({});
    const [reviewInputs, setReviewInputs] = useState({});

    const projects = data?.projects || [];

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
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Submitted Projects</h2>
                <Button as={Link} to="/client/dashboard" variant="outline-secondary" size="sm">
                    Back to Dashboard
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">
                    {error?.data?.message || error?.error || "Error fetching submitted projects"}
                </Alert>
            ) : projects.length === 0 ? (
                <Alert variant="info">No submitted projects yet.</Alert>
            ) : (
                <Row>
                    {projects.map((project) => {
                        const decisionStatus = project.submission?.clientDecision?.status || "pending";
                        const canReview = decisionStatus === "pending";
                        const canRateDeveloper = decisionStatus === "accepted" || decisionStatus === "rejected";
                        const hasSubmittedReview = !!project.submission?.clientReview?.reviewedAt;
                        const reviewLocked = decisionStatus === "accepted" && hasSubmittedReview;
                        return (
                            <Col key={project._id} sm={12} md={6} lg={6} className="mb-4">
                                <Card className="h-100 shadow-sm">
                                    <Card.Body>
                                        <Card.Title>{project.title}</Card.Title>

                                        <Card.Text>
                                            <strong>Project Status:</strong>{" "}
                                            <Badge bg="secondary">
                                                {project.status === "in-progress" ? "in progress" : project.status}
                                            </Badge>
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Submitted By:</strong>{" "}
                                            {project.submission?.submittedBy?.name || project.selectedDeveloper?.name || "N/A"}
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Submitted On:</strong>{" "}
                                            {project.submission?.submittedAt
                                                ? new Date(project.submission.submittedAt).toLocaleDateString()
                                                : "N/A"}
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Submission Link:</strong>{" "}
                                            {project.submission?.link ? (
                                                <a href={project.submission.link} target="_blank" rel="noreferrer">
                                                    Open Link
                                                </a>
                                            ) : (
                                                "N/A"
                                            )}
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Developer Note:</strong>
                                            <br />
                                            {project.submission?.note || "No note provided."}
                                        </Card.Text>

                                        <Card.Text>
                                            <strong>Client Decision:</strong>{" "}
                                            <Badge bg={decisionStatus === "accepted" ? "success" : decisionStatus === "rejected" ? "danger" : "warning"}>
                                                {decisionStatus}
                                            </Badge>
                                        </Card.Text>

                                        {project.submission?.clientDecision?.note && (
                                            <Card.Text>
                                                <strong>Your Note:</strong>
                                                <br />
                                                {project.submission.clientDecision.note}
                                            </Card.Text>
                                        )}

                                        {canRateDeveloper && (
                                            <Card className="mb-3 border">
                                                <Card.Body>
                                                    <Card.Title className="fs-6">Rate Developer</Card.Title>

                                                    {hasSubmittedReview && (
                                                        <Alert variant="success" className="py-2">
                                                            Existing review:
                                                            <br />
                                                            <strong>Rating:</strong> {project.submission.clientReview.rating}/5
                                                            <br />
                                                            <strong>Comment:</strong> {project.submission.clientReview.comment}
                                                        </Alert>
                                                    )}

                                                    {reviewLocked && (
                                                        <Alert variant="info" className="mb-0 py-2">
                                                            Review is locked because this project has been accepted.
                                                        </Alert>
                                                    )}

                                                    {!reviewLocked && (
                                                        <>
                                                            <Form.Group controlId={`rating-${project._id}`} className="mb-2">
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

                                                            <Button
                                                                className="mt-2"
                                                                size="sm"
                                                                variant="outline-success"
                                                                disabled={loadingDeveloperReview}
                                                                onClick={() => handleAddReview(project)}
                                                            >
                                                                {loadingDeveloperReview
                                                                    ? "Submitting..."
                                                                    : hasSubmittedReview
                                                                        ? "Update Review"
                                                                        : "Submit Review"}
                                                            </Button>
                                                        </>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        )}

                                        {canReview && (
                                            <Form.Group controlId={`decision-note-${project._id}`} className="my-3">
                                                <Form.Label>Decision Note</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Write your acceptance/rejection note"
                                                    value={decisionNotes[project._id] || ""}
                                                    onChange={(e) =>
                                                        setDecisionNotes((prev) => ({
                                                            ...prev,
                                                            [project._id]: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </Form.Group>
                                        )}

                                        <div className="d-flex gap-2 flex-wrap">
                                            <Button as={Link} to={`/projects/${project._id}`} variant="dark" size="sm">
                                                View Project
                                            </Button>

                                            {canReview && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        disabled={loadingReview}
                                                        onClick={() => handleDecision(project._id, "accept")}
                                                    >
                                                        Accept Project
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        disabled={loadingReview}
                                                        onClick={() => handleDecision(project._id, "reject")}
                                                    >
                                                        Reject Project
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
}

export default SubmittedProjectsPage;
