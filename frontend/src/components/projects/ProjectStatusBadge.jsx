const LABELS = {
    open: "Open",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
};

function ProjectStatusBadge({ status = "open", className = "" }) {
    const normalizedStatus = String(status || "open").toLowerCase();
    const resolvedClass = normalizedStatus.replace(/\s+/g, "-");

    return (
        <span className={["status-pill", `status-pill--${resolvedClass}`, className].filter(Boolean).join(" ")}>
            {LABELS[normalizedStatus] || status}
        </span>
    );
}

export default ProjectStatusBadge;
