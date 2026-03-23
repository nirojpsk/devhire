import { Form, Button } from "react-bootstrap";
import { useLoginMutation } from "../../api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setCredentials } from "../../slices/authSlice";
import apiSlice from "../../api/apiSlice";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function LoginPage() {
    const { userInfo } = useSelector(state => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const sp = new URLSearchParams(location.search);
    const redirect = sp.get("redirect");

    useEffect(() => {
        if (userInfo) {
            if (redirect) {
                navigate(redirect);
            } else if (userInfo.role === "client") {
                navigate("/client/dashboard");
            }
            else if (userInfo.role === "developer") {
                navigate("/developer/dashboard");
            }
            else if (userInfo.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [userInfo, navigate, redirect])

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(apiSlice.util.resetApiState());
            dispatch(setCredentials(res.user));
            toast.success('Login successful');
            if (res.user.role === "client") {
                navigate("/client/dashboard");
            }
            else if (res.user.role === "developer") {
                navigate("/developer/dashboard");
            }
            else if (res.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            toast.error(err?.data?.error || err?.error || "Login Failed");
        }
    }
    return (
        <>
            <h2 className="mb-3">Sign In</h2>
            <Form onSubmit={loginHandler}>
                <Form.Group controlId="email" className="my-3">
                    <Form.Label >
                        Email
                    </Form.Label>
                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="password" className="my-3">
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Button type="submit" className="btn btn-sm" disabled={isLoading}>
                    {isLoading ? 'Logging in....' : 'Login'}
                </Button>
                <Button as={NavLink} to='/register' type="button" variant="outline-secondary" className="my-3 ms-2">Register</Button>
            </Form>
        </>
    );
}

export default LoginPage;
