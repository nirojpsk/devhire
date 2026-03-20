import { Form, Button } from 'react-bootstrap';
import { useRegisterMutation } from "../../api/authApiSlice";
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Country, State, City } from 'country-state-city';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);

    const countries = useMemo(() => Country.getAllCountries(), []);

    const states = useMemo(() => {
        return countryCode ? State.getStatesOfCountry(countryCode) : [];
    }, [countryCode]);

    const cities = useMemo(() => {
        return countryCode && stateCode
            ? City.getCitiesOfState(countryCode, stateCode)
            : [];
    }, [countryCode, stateCode]);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
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

        const selectedCountry = countries.find((c) => c.isoCode === countryCode);
        const selectedState = states.find((s) => s.isoCode === stateCode);

        try {
            await register({
                name,
                email,
                password,
                role,
                address: {
                    country: selectedCountry?.name || '',
                    state: selectedState?.name || '',
                    city,
                    zipCode,
                },
            }).unwrap();

            toast.success("Registration successful. Please login");
            navigate('/login');
        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.data?.error ||
                err?.error ||
                "Registration failed"
            );
        }
    };

    return (
        <>
            <h2 className='mb-3'>Register</h2>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-3'>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='email' className='my-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='password' className='my-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='confirmPassword' className='my-3'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='role' className='my-3'>
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value=''>Select Role</option>
                        <option value='client'>Client</option>
                        <option value='developer'>Developer</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId='country' className='my-3'>
                    <Form.Label>Country</Form.Label>
                    <Form.Select
                        value={countryCode}
                        onChange={(e) => {
                            setCountryCode(e.target.value);
                            setStateCode('');
                            setCity('');
                        }}
                    >
                        <option value=''>Select Country</option>
                        {countries.map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                                {country.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId='state' className='my-3'>
                    <Form.Label>State</Form.Label>
                    <Form.Select
                        value={stateCode}
                        onChange={(e) => {
                            setStateCode(e.target.value);
                            setCity('');
                        }}
                        disabled={!countryCode}
                    >
                        <option value=''>Select State</option>
                        {states.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId='city' className='my-3'>
                    <Form.Label>City</Form.Label>
                    {cities.length > 0 ? (
                        <Form.Select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={!stateCode}
                        >
                            <option value=''>Select City</option>
                            {cities.map((cityItem, index) => (
                                <option
                                    key={`${cityItem.name}-${index}`}
                                    value={cityItem.name}
                                >
                                    {cityItem.name}
                                </option>
                            ))}
                        </Form.Select>
                    ) : (
                        <Form.Control
                            type='text'
                            placeholder='Enter city'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={!stateCode}
                        />
                    )}
                </Form.Group>

                <Form.Group controlId='zipCode' className='my-3'>
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                        type='text'
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </Form.Group>

                <Button type='submit' className='btn btn-sm' disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </Button>

                <Button
                    as={NavLink}
                    to='/login'
                    type='button'
                    variant='outline-secondary'
                    className='my-3 ms-2'
                >
                    Login
                </Button>
            </Form>
        </>
    );
}

export default RegisterPage;