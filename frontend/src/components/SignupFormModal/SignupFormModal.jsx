import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupFormModal.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    // disable the submit button if any field is not validated
    const isDisabled =
        !email ||
        !username ||
        !firstName ||
        !lastName ||
        !password ||
        !confirmPassword
    username.length < 4 ||
        password.length < 6 ||
        password !== confirmPassword;


    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };
    return (
        <>
            <div className="signup-modal">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="text"
                            placeholder="johndoe@aol.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    {errors.email && <p className="error">{errors.email}</p>}
                    <label>
                        Username
                        <input
                            type="text"
                            placeholder="johndoe123"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    {username && username.length < 4 && (
                        <p className="error">Username must be at least 4 characters</p>
                    )}
                    {errors.username && <p className="error">{errors.username}</p>}
                    <label>
                        First Name
                        <input
                            type="text"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                    <label>
                        Last Name
                        <input
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                    <label>
                        Password
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {password && password.length < 6 && (
                        <p className="error">Password must be at least 6 characters</p>
                    )}
                    {errors.password && <p className="error">{errors.password}</p>}
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            placeholder="confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                    {confirmPassword && password !== confirmPassword && (
                        <p className="error">Passwords must match</p>
                    )}
                    {errors.confirmPassword && (
                        <p className="error">{errors.confirmPassword}</p>
                    )}
                    <button type="submit" disabled={isDisabled}>Sign Up</button>
                </form>
            </div>
        </>
    );

}


export default SignupFormModal;