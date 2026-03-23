import { Form } from "react-bootstrap";
import Button from "../ui/Button";

function ProjectForm({
    values,
    onFieldChange,
    onSubmit,
    isLoading = false,
    submitLabel = "Save Project",
    minDate,
}) {
    return (
        <Form onSubmit={onSubmit} className="project-editor-form">
            <div className="project-editor-form__section">
                <div className="page-intro__copy">
                    <span className="eyebrow">Project brief</span>
                    <h2 className="section-title">Core details</h2>
                    <p className="page-subtitle">
                        Describe the work clearly so developers can price and plan with confidence.
                    </p>
                </div>

                <Form.Group controlId="title">
                    <Form.Label>Project Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={values.title}
                        onChange={(event) => onFieldChange("title", event.target.value)}
                        placeholder="Enter project title"
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={7}
                        value={values.description}
                        onChange={(event) => onFieldChange("description", event.target.value)}
                        placeholder="Describe the goals, scope, deliverables, and anything developers should know."
                    />
                </Form.Group>
            </div>

            <div className="project-editor-form__section">
                <div className="page-intro__copy">
                    <span className="eyebrow">Budget and timing</span>
                    <h3 className="section-title">Project constraints</h3>
                </div>

                <div className="project-editor-form__grid">
                    <Form.Group controlId="budgetMin">
                        <Form.Label>Minimum Budget</Form.Label>
                        <Form.Control
                            type="number"
                            value={values.budgetMin}
                            onChange={(event) => onFieldChange("budgetMin", event.target.value)}
                            placeholder="Enter minimum budget"
                        />
                    </Form.Group>

                    <Form.Group controlId="budgetMax">
                        <Form.Label>Maximum Budget</Form.Label>
                        <Form.Control
                            type="number"
                            value={values.budgetMax}
                            onChange={(event) => onFieldChange("budgetMax", event.target.value)}
                            placeholder="Enter maximum budget"
                        />
                    </Form.Group>
                </div>

                <Form.Group controlId="deadline">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                        type="date"
                        value={values.deadline}
                        min={minDate}
                        onChange={(event) => onFieldChange("deadline", event.target.value)}
                    />
                </Form.Group>
            </div>

            <div className="project-editor-form__section">
                <div className="page-intro__copy">
                    <span className="eyebrow">Skills</span>
                    <h3 className="section-title">Delivery needs</h3>
                </div>

                <Form.Group controlId="skillsRequired">
                    <Form.Label>Skills Required</Form.Label>
                    <Form.Control
                        type="text"
                        value={values.skillsRequired}
                        onChange={(event) => onFieldChange("skillsRequired", event.target.value)}
                        placeholder="Example: React, Node.js, MongoDB"
                    />
                    <Form.Text>
                        Separate each skill with a comma so the marketplace can index the project correctly.
                    </Form.Text>
                </Form.Group>
            </div>

            <div className="form-actions">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : submitLabel}
                </Button>
            </div>
        </Form>
    );
}

export default ProjectForm;
