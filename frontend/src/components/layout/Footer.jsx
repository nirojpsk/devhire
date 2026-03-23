function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="site-footer__panel">
                    <div className="footer-bottom">
                        <span>&copy; {year} DevHire. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
