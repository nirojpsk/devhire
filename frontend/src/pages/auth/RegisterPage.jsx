import { Form } from "react-bootstrap";
import { useRegisterMutation } from "../../api/authApiSlice";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { FaBriefcase, FaCode, FaGlobe } from "react-icons/fa";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../../components/ui/Button";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [stateCode, setStateCode] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");

    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const countries = useMemo(() => Country.getAllCountries(), []);

    const states = useMemo(() => {
        return countryCode ? State.getStatesOfCountry(countryCode) : [];
    }, [countryCode]);

    const cities = useMemo(() => {
        return countryCode && stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];
    }, [countryCode, stateCode]);

    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordRegex.test(password)) {
            toast.error(
                "Password must be at least 8 characters and include uppercase, lowercase, and a special character"
            );
            return;
        }

        if (!role) {
            toast.error("Please select a role");
            return;
        }

        if (!countryCode || !stateCode || !city || !zipCode) {
            toast.error("Please complete address information");
            return;
        }

        if (!/^\d+$/.test(zipCode)) {
            toast.error("Zip code must contain only numbers");
            return;
        }

        const selectedCountry = countries.find((countryItem) => countryItem.isoCode === countryCode);
        const selectedState = states.find((stateItem) => stateItem.isoCode === stateCode);

        try {
            await register({
                name,
                email,
                password,
                role,
                address: {
                    country: selectedCountry?.name || "",
                    state: selectedState?.name || "",
                    city,
                    zipCode,
                },
            }).unwrap();

            toast.success("Registration successful. Please login");
            navigate("/login");
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to register"));
        }
    };

    return (
        <div className="public-page">
            <div className="container">
                <div className="auth-shell">
                    <div className="auth-panel animate-in">
                        <div className="auth-highlight">
                            <div className="stacked-info">
                                <span className="eyebrow">Join DevHire</span>
                                <h1 className="page-title page-title--compact">
                                    Create an account for cleaner project hiring.
                                </h1>
                                <p className="page-subtitle">
                                    Choose the role that fits how you work today. You keep the same core product,
                                    but the interface adapts to your workflow.
                                </p>
                            </div>

                            <div className="auth-signal-row">
                                <div className="auth-signal">
                                    <strong>Client mode</strong>
                                    <span>Post, review, hire, and track delivery clearly</span>
                                </div>
                                <div className="auth-signal">
                                    <strong>Developer mode</strong>
                                    <span>Bid, deliver, and build a stronger public profile</span>
                                </div>
                            </div>

                            <ul className="auth-checklist">
                                <li>Create a role-specific workspace without changing the core platform.</li>
                                <li>Keep location, skills, and account details organized from the start.</li>
                                <li>Use the same product language across public pages and dashboards.</li>
                            </ul>

                            <div className="auth-highlight__footer">
                                <div className="auth-mini-card">
                                    <FaBriefcase className="mb-3" />
                                    <h3>For clients</h3>
                                    <p>Post software projects, review bids, and manage delivery from one dashboard.</p>
                                </div>
                                <div className="auth-mini-card">
                                    <FaCode className="mb-3" />
                                    <h3>For developers</h3>
                                    <p>Build a profile, pitch projects, and grow your reputation through completed work.</p>
                                </div>
                            </div>
                        </div>

                        <div className="auth-form-panel">
                            <div className="auth-form-panel__header">
                                <span className="eyebrow">Account setup</span>
                                <h2 className="section-title">Create Account</h2>
                                <p className="page-subtitle">
                                    Fill in the required details below. Your existing validation rules are unchanged.
                                </p>
                            </div>

                            <Form onSubmit={submitHandler} className="auth-form">
                                <div>
                                    <Form.Label>Choose Role</Form.Label>
                                    <div className="role-toggle">
                                        <button
                                            type="button"
                                            className={`role-toggle__button ${role === "developer" ? "is-active" : ""}`}
                                            onClick={() => setRole("developer")}
                                        >
                                            Developer
                                        </button>
                                        <button
                                            type="button"
                                            className={`role-toggle__button ${role === "client" ? "is-active" : ""}`}
                                            onClick={() => setRole("client")}
                                        >
                                            Client
                                        </button>
                                    </div>
                                </div>

                                <div className="auth-form__grid">
                                    <Form.Group controlId="name">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                        />
                                    </Form.Group>
                                </div>

                                <div className="auth-form__grid">
                                    <Form.Group controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Create a strong password"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="confirmPassword">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat your password"
                                        />
                                    </Form.Group>
                                </div>

                                <div className="page-intro__copy">
                                    <span className="eyebrow">
                                        <FaGlobe />
                                        Address information
                                    </span>
                                </div>

                                <div className="auth-form__grid">
                                    <Form.Group controlId="country">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Select
                                            value={countryCode}
                                            onChange={(e) => {
                                                setCountryCode(e.target.value);
                                                setStateCode("");
                                                setCity("");
                                            }}
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.isoCode} value={country.isoCode}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="state">
                                        <Form.Label>State</Form.Label>
                                        <Form.Select
                                            value={stateCode}
                                            onChange={(e) => {
                                                setStateCode(e.target.value);
                                                setCity("");
                                            }}
                                            disabled={!countryCode}
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state.isoCode} value={state.isoCode}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="auth-form__grid">
                                    <Form.Group controlId="city">
                                        <Form.Label>City</Form.Label>
                                        {cities.length > 0 ? (
                                            <Form.Select
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                disabled={!stateCode}
                                            >
                                                <option value="">Select City</option>
                                                {cities.map((cityItem, index) => (
                                                    <option key={`${cityItem.name}-${index}`} value={cityItem.name}>
                                                        {cityItem.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        ) : (
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                disabled={!stateCode}
                                            />
                                        )}
                                    </Form.Group>

                                    <Form.Group controlId="zipCode">
                                        <Form.Label>Zip Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                            placeholder="Enter zip code"
                                        />
                                    </Form.Group>
                                </div>

                                <Form.Text>
                                    Password must be at least 8 characters and include uppercase, lowercase, and a special character.
                                </Form.Text>

                                <div className="form-actions">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Registering..." : "Create Account"}
                                    </Button>
                                    <Button as={NavLink} to="/login" tone="light" type="button">
                                        Already have an account?
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
