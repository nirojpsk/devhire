import RBButton from "react-bootstrap/Button";

function Button({
    children,
    className = "",
    tone,
    variant,
    disabled,
    loading = false,
    ...props
}) {
    const resolvedVariant = tone || variant || "primary";
    const classes = ["app-button", className].filter(Boolean).join(" ");

    return (
        <RBButton
            {...props}
            variant={resolvedVariant}
            disabled={disabled || loading}
            className={classes}
        >
            {children}
        </RBButton>
    );
}

export default Button;
