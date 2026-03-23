import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBriefcase,
    FaGavel,
    FaShieldAlt,
    FaUsers,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGetProjectsQuery } from "../api/projectApiSlice";
import Button from "../components/ui/Button";
import ProjectStatusBadge from "../components/projects/ProjectStatusBadge";

const platformFeatures = [
    {
        icon: <FaBriefcase />,
        title: "Project-first workflows",
        description:
            "Create projects, define budgets, and manage developer interest from a clean single workspace.",
    },
    {
        icon: <FaGavel />,
        title: "Structured bidding",
        description:
            "Developers can pitch with clear pricing, delivery timelines, and proposal context clients can compare quickly.",
    },
    {
        icon: <FaShieldAlt />,
        title: "Trust built in",
        description:
            "Profiles, review flows, submission tracking, and clear status states help teams move with confidence.",
    },
];

function HomePage() {
    const { userInfo } = useSelector((state) => state.auth);
    const { data } = useGetProjectsQuery();

    const projects = data?.projects ?? [];
    const featuredProjects = projects.slice(0, 3);
    const dashboardLink = userInfo?.role === "client"
        ? "/client/dashboard"
        : userInfo?.role === "developer"
            ? "/developer/dashboard"
            : userInfo?.role === "admin"
                ? "/admin/dashboard"
                : "/register";

    return (
        <div className="public-page">
            <section className="public-section">
                <Container>
                    <div className="hero-panel animate-in">
                        <div className="hero-copy">
                            <span className="eyebrow">Premium software hiring marketplace</span>
                            <h1 className="page-title">
                                Find trusted developers for ambitious software projects.
                            </h1>
                            <p className="page-subtitle">
                                DevHire helps clients post real project opportunities, compare thoughtful bids,
                                and keep delivery workflows organized from kickoff to submission.
                            </p>

                            <div className="hero-actions">
                                <Button as={Link} to="/projects" size="lg">
                                    Browse Projects
                                    <FaArrowRight />
                                </Button>
                                <Button as={Link} to={dashboardLink} tone="light" size="lg">
                                    {userInfo ? "Open Dashboard" : "Create Account"}
                                </Button>
                            </div>

                            <div className="hero-trust">
                                <span>Clients can post, review, hire, and track delivery.</span>
                                <span>Developers can build profiles, bid, and grow reputation.</span>
                            </div>
                        </div>

                        <div className="hero-spotlight animate-in-delay">
                            <div className="hero-spotlight__screen">
                                <span className="hero-spotlight__chip">Live workflow snapshot</span>

                                <div className="hero-spotlight__card">
                                    <h3>From project brief to shipped work</h3>
                                    <p>
                                        Stronger project detail pages, polished proposal review, and clean role-based
                                        dashboards keep the marketplace easy to trust and easy to use.
                                    </p>
                                </div>

                                <div className="floating-note">
                                    <strong>Three roles, one cohesive product.</strong>
                                    <p>Clients, developers, and admins all work inside the same visual system.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="public-section">
                <Container>
                    <div className="section-header">
                        <div className="page-intro__copy">
                            <span className="eyebrow">Platform foundations</span>
                            <h2 className="section-title">Designed for real hiring workflows</h2>
                        </div>
                    </div>

                    <div className="feature-grid">
                        {platformFeatures.map(({ icon, title, description }) => (
                            <article key={title} className="feature-card interactive-card">
                                <div className="feature-card__icon">
                                    {icon}
                                </div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        ))}
                    </div>
                </Container>
            </section>

            <section className="public-section">
                <Container>
                    <div className="section-header">
                        <div className="page-intro__copy">
                            <span className="eyebrow">Featured opportunities</span>
                            <h2 className="section-title">Current projects on DevHire</h2>
                            <p className="page-subtitle">
                                A preview of the kind of projects clients can publish and developers can pursue.
                            </p>
                        </div>
                        <Link to="/projects" className="section-link">
                            View all projects
                        </Link>
                    </div>

                    <div className="showcase-grid">
                        {featuredProjects.length > 0 ? (
                            featuredProjects.map((project) => (
                                <article key={project._id} className="surface-card showcase-card interactive-card">
                                    <div className="page-actions">
                                        <ProjectStatusBadge status={project.status} />
                                        <span className="app-chip">
                                            {project.skillsRequired?.[0] || "Software"}
                                        </span>
                                    </div>
                                    <h3 className="mt-3">{project.title}</h3>
                                    <p className="mt-3">
                                        {project.description?.length > 150
                                            ? `${project.description.slice(0, 150)}...`
                                            : project.description}
                                    </p>
                                    <div className="chip-list mt-3">
                                        {project.skillsRequired?.slice(0, 4).map((skill) => (
                                            <span key={skill} className="app-chip">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="showcase-card__meta">
                                        <span>${project.budget?.min} - ${project.budget?.max}</span>
                                        <Link to={`/projects/${project._id}`} className="section-link">
                                            View details
                                        </Link>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="surface-card showcase-card">
                                <h3>No live projects yet</h3>
                                <p className="mt-3">
                                    Once clients start publishing work, featured opportunities will appear here
                                    automatically.
                                </p>
                            </div>
                        )}
                    </div>
                </Container>
            </section>

            <section className="public-section">
                <Container>
                    <div className="audience-grid">
                        <article className="audience-card">
                            <span className="eyebrow">For clients</span>
                            <h3 className="mt-3">Hire with structure, not guesswork.</h3>
                            <ul className="audience-list">
                                <li>
                                    <strong>Post projects clearly</strong>
                                    <span>Set budgets, skills, and deadlines without changing your existing workflow.</span>
                                </li>
                                <li>
                                    <strong>Review proposals quickly</strong>
                                    <span>Compare bid amount, timeline, and developer profile details in one place.</span>
                                </li>
                                <li>
                                    <strong>Track delivery</strong>
                                    <span>Move from accepted bid to submission review inside the same product.</span>
                                </li>
                            </ul>
                        </article>

                        <article className="audience-card audience-card--dark">
                            <span className="eyebrow">For developers</span>
                            <h3 className="mt-3">Put your best work in front of serious clients.</h3>
                            <ul className="audience-list">
                                <li>
                                    <strong>Build a professional profile</strong>
                                    <span>Showcase skills, links, reviews, and availability with clarity.</span>
                                </li>
                                <li>
                                    <strong>Submit better bids</strong>
                                    <span>Pitch with budget, delivery time, and proposal context that is easy to trust.</span>
                                </li>
                                <li>
                                    <strong>Grow reputation</strong>
                                    <span>Use ratings and accepted work history to stand out over time.</span>
                                </li>
                            </ul>
                        </article>

                        <article className="audience-card">
                            <span className="eyebrow">For operations</span>
                            <h3 className="mt-3">Keep the marketplace healthy.</h3>
                            <ul className="audience-list">
                                <li>
                                    <strong>Admin visibility</strong>
                                    <span>Monitor users and projects with a clearer, role-aware control surface.</span>
                                </li>
                                <li>
                                    <strong>Consistent states</strong>
                                    <span>Status pills, cards, and form patterns stay coherent across the product.</span>
                                </li>
                                <li>
                                    <strong>Simple motion</strong>
                                    <span>Subtle transitions add polish without distracting from the task at hand.</span>
                                </li>
                            </ul>
                        </article>
                    </div>
                </Container>
            </section>

            <section className="public-section">
                <Container>
                    <div className="cta-band">
                        <span className="eyebrow">Ready to get started?</span>
                        <h2 className="mt-3">Ship your next project with a cleaner hiring experience.</h2>
                        <p className="mt-3">
                            Join DevHire to post software projects, evaluate bids, and move faster with a more polished workflow.
                        </p>
                        <div className="page-actions justify-content-center mt-4">
                            <Button as={Link} to={userInfo ? dashboardLink : "/register"}>
                                {userInfo ? "Go to Dashboard" : "Create Account"}
                            </Button>
                            <Button as={Link} to="/projects" tone="light">
                                <FaArrowRight />
                                Explore Projects
                            </Button>
                            <Button as={Link} to="/login" tone="light">
                                <FaUsers />
                                Sign In
                            </Button>
                        </div>
                        <div className="hero-trust justify-content-center mt-4">
                            <span>Structured hiring workflows for clients and developers.</span>
                            <span>Clear project coordination from posting to delivery.</span>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}

export default HomePage;
