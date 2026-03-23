import { Form } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateProjectMutation } from "../../api/projectApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";

const isFutureDate = (dateValue) => {
    const selectedDate = new Date(dateValue);
    if (Number.isNaN(selectedDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate > today;
};

const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
};

function CreateProjectPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budgetMin, setBudgetMin] = useState("");
    const [budgetMax, setBudgetMax] = useState("");
    const [skillsRequired, setSkillsRequired] = useState("");
    const [deadline, setDeadline] = useState("");

    const [createProject, { isLoading }] = useCreateProjectMutation();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!title || !description || !budgetMin || !budgetMax || !skillsRequired || !deadline) {
            toast.error("Please fill all required fields");
            return;
        }

        if (Number(budgetMin) > Number(budgetMax)) {
            toast.error("Minimum budget cannot be greater than Maximum budget");
            return;
        }

        const skillsArray = skillsRequired
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        if (skillsArray.length === 0) {
            toast.error("Please enter at least one skill");
            return;
        }

        if (!isFutureDate(deadline)) {
            toast.error("Deadline must be a future date");
            return;
        }

        try {
            const res = await createProject({
                title,
                description,
                budget: {
                    min: Number(budgetMin),
                    max: Number(budgetMax),
                },
                skillsRequired: skillsArray,
                deadline,
            }).unwrap();
            toast.success(res?.message || "Project created successfully");
            navigate("/client/dashboard");
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to create project"));
        }
    };

    return (
        <div>
            <section className="page-intro">
                <div className="page-intro__copy">
                    <span className="eyebrow">Client workflow</span>
                    <h1 className="page-title page-title--compact">Create Project</h1>
                    <p className="page-subtitle">
                        Publish a new opportunity without changing your existing validation or submit behavior.
                    </p>
                </div>
                <div className="page-actions">
                    <Button as={Link} to="/client/dashboard" tone="light">
                        Back to Dashboard
                    </Button>
                </div>
            </section>

            <article className="detail-card">
                <Form onSubmit={submitHandler} className="auth-form">
                    <Form.Group controlId="title">
                        <Form.Label>Project Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter project title"
                        />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your project clearly"
                        />
                    </Form.Group>

                    <div className="auth-form__grid">
                        <Form.Group controlId="budgetMin">
                            <Form.Label>Minimum Budget</Form.Label>
                            <Form.Control
                                type="number"
                                value={budgetMin}
                                onChange={(e) => setBudgetMin(e.target.value)}
                                placeholder="Enter minimum budget"
                            />
                        </Form.Group>

                        <Form.Group controlId="budgetMax">
                            <Form.Label>Maximum Budget</Form.Label>
                            <Form.Control
                                type="number"
                                value={budgetMax}
                                onChange={(e) => setBudgetMax(e.target.value)}
                                placeholder="Enter maximum budget"
                            />
                        </Form.Group>
                    </div>

                    <Form.Group controlId="skillsRequired">
                        <Form.Label>Skills Required</Form.Label>
                        <Form.Control
                            type="text"
                            value={skillsRequired}
                            onChange={(e) => setSkillsRequired(e.target.value)}
                            placeholder="Example: React, Node.js, MongoDB"
                        />
                        <Form.Text>Enter skills separated by commas.</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="deadline">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                            type="date"
                            value={deadline}
                            min={getTomorrowDateString()}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </Form.Group>

                    <div className="form-actions">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Project"}
                        </Button>
                    </div>
                </Form>
            </article>
        </div>
    );
}

export default CreateProjectPage;
