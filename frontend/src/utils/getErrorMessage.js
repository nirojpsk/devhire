const isGenericMessage = (message = "") => {
    const normalized = message.trim().toLowerCase();
    return (
        normalized === "error" ||
        normalized === "failed" ||
        normalized === "request failed" ||
        normalized === "internal server error" ||
        normalized.startsWith("error ") ||
        normalized.startsWith("error while") ||
        normalized.startsWith("failed ")
    );
};

const getFirstValidationMessage = (errors) => {
    if (Array.isArray(errors) && errors.length > 0) {
        const first = errors[0];
        if (typeof first === "string") return first;
        if (first?.msg) return first.msg;
        if (first?.message) return first.message;
    }
    return "";
};

const getErrorMessage = (err, fallbackMessage = "Something went wrong") => {
    const validationMessage = getFirstValidationMessage(err?.data?.errors);
    const dataMessage = typeof err?.data?.message === "string" ? err.data.message : "";
    const dataError = typeof err?.data?.error === "string" ? err.data.error : "";
    const baseError = typeof err?.error === "string" ? err.error : "";

    if (validationMessage) return validationMessage;

    const specificDataMessage = dataMessage && !isGenericMessage(dataMessage) ? dataMessage : "";
    const specificDataError = dataError && !isGenericMessage(dataError) ? dataError : "";
    const specificBaseError = baseError && !isGenericMessage(baseError) ? baseError : "";

    return (
        specificDataMessage ||
        specificDataError ||
        specificBaseError ||
        dataMessage ||
        dataError ||
        baseError ||
        fallbackMessage
    );
};

export default getErrorMessage;
