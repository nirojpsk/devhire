import RBModal from "react-bootstrap/Modal";

function Modal({
    title,
    children,
    footer,
    className = "",
    ...props
}) {
    return (
        <RBModal
            {...props}
            dialogClassName={["app-modal", className].filter(Boolean).join(" ")}
            centered
        >
            {title ? (
                <RBModal.Header closeButton>
                    <RBModal.Title>{title}</RBModal.Title>
                </RBModal.Header>
            ) : null}
            <RBModal.Body>{children}</RBModal.Body>
            {footer ? <RBModal.Footer>{footer}</RBModal.Footer> : null}
        </RBModal>
    );
}

export default Modal;
