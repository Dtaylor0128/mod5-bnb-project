import { useState } from 'react';
import { thunkLogin } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import './LoginFormPage.css';

const LoginFormPage = () => {
    // hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // state
    const sessionUser = useSelector(state => state.session.user);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    // if user is logged in, redirect to home page
    if (sessionUser) return <Navigate to='/' replace={true} />;

    // handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const serverResponse = await dispatch(thunkLogin(email, password));

        if (serverResponse) {
            setErrors(serverResponse);
        } else {
            navigate('/');
        }
    };

    return (
        <div className='login-form-container'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    Email
                    <input
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default LoginFormPage;
