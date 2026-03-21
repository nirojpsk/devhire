function Footer() {
    const today = new Date();
    const year = today.getFullYear();
    return (
        <footer className="mt-4 pt-3 pb-2 text-center text-muted small">
            <div>
                &copy; {year} DevHire
            </div>
        </footer>
    );
};

export default Footer;