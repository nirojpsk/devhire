const LABELS = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
};

function BidStatusBadge({ status = "pending", className = "" }) {
    const normalizedStatus = String(status || "pending").toLowerCase();

    return (
        <span className={["status-pill", `status-pill--${normalizedStatus}`, className].filter(Boolean).join(" ")}>
            {LABELS[normalizedStatus] || status}
        </span>
    );
}

export default BidStatusBadge;
