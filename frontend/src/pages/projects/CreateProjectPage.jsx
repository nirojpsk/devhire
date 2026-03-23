import { useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateProjectMutation } from "../../api/projectApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";
import ProjectForm from "../../components/projects/ProjectForm";

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
        <div className="public-page">
            <Container>
                <section className="project-editor-layout">
                    <div className="project-editor-main">
                        <section className="page-intro">
                            <div className="page-intro__copy">
                                <span className="eyebrow">Client workflow</span>
                                <h1 className="page-title page-title--compact">Create Project</h1>
                                <p className="page-subtitle">
                                    Publish a new opportunity with a clearer brief, cleaner structure, and the same validation rules you already had.
                                </p>
                            </div>
                            <div className="page-actions">
                                <Button as={Link} to="/client/dashboard" tone="light">
                                    Back to Dashboard
                                </Button>
                            </div>
                        </section>

                        <article className="detail-card project-editor-card">
                            <ProjectForm
                                values={{ title, description, budgetMin, budgetMax, skillsRequired, deadline }}
                                onFieldChange={(field, value) => {
                                    if (field === "title") setTitle(value);
                                    if (field === "description") setDescription(value);
                                    if (field === "budgetMin") setBudgetMin(value);
                                    if (field === "budgetMax") setBudgetMax(value);
                                    if (field === "skillsRequired") setSkillsRequired(value);
                                    if (field === "deadline") setDeadline(value);
                                }}
                                onSubmit={submitHandler}
                                isLoading={isLoading}
                                submitLabel="Create Project"
                                minDate={getTomorrowDateString()}
                            />
                        </article>
                    </div>

                    <aside className="project-editor-side">
                        <article className="surface-card project-note-card">
                            <span className="eyebrow">What strong briefs include</span>
                            <h2 className="section-title mt-3">Set the project up for better bids</h2>
                            <ul className="project-step-list">
                                <li>Write the scope in plain language and mention the final deliverable.</li>
                                <li>Keep the budget realistic so serious developers self-select faster.</li>
                                <li>List the core technologies only, not every possible tool.</li>
                                <li>Choose a deadline that reflects review time as well as build time.</li>
                            </ul>
                        </article>

                        <article className="surface-card surface-card--soft project-note-card">
                            <span className="eyebrow">Next step</span>
                            <p className="page-subtitle mt-3 mb-0">
                                After publishing, developers will see the project on the marketplace and can begin sending proposals immediately.
                            </p>
                        </article>
                    </aside>
                </section>
            </Container>
        </div>
    );
}

export default CreateProjectPage;
