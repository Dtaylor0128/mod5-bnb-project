import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    //     const handleSubmit = (e) => {
    //         e.preventDefault();
    //         setErrors({});
    //         return dispatch(sessionActions.login({ credential, password }))
    //             .then(closeModal)
    //             .catch(async (res) => {
    //                 const data = await res.json();
    //                 if (data && data.errors) {
    //                     setErrors(data.errors);
    //                 }
    //             });
    //     };

    //     return (
    //         <>
    //             <h1>Log In</h1>
    //             <form onSubmit={handleSubmit}>
    //                 <label>
    //                     Username or Email
    //                     <input
    //                         type="text"
    //                         value={credential}
    //                         onChange={(e) => setCredential(e.target.value)}
    //                         required
    //                     />
    //                 </label>
    //                 <label>
    //                     Password
    //                     <input
    //                         type="password"
    //                         value={password}
    //                         onChange={(e) => setPassword(e.target.value)}
    //                         required
    //                     />
    //                 </label>
    //                 {errors.credential && (
    //                     <p>{errors.credential}</p>
    //                 )}
    //                 <button type="submit">Log In</button>
    //             </form>
    //         </>
    //     );
    // }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await dispatch(sessionActions.login({ credential, password }));
            closeModal();
        } catch (res) {
            const data = await res.json();
            if (data?.errors) setErrors(data.errors);
        }
    };

    const handleDemo = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await dispatch(sessionActions.login({
                credential: "Demo-lition",
                password: "password"
            }));
            closeModal();
        } catch (res) {
            const data = await res.json();
            if (data?.errors) setErrors(data.errors);
        }
    };

    const isDisabled = credential.length < 4 || password.length < 6;
    return (
        <>

            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>

                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && (
                    <p className="error">{errors.credential}</p>
                )}
                <button type="submit" disabled={isDisabled}>Log In</button>
                <button type="button"
                    onClick={handleDemo}>
                    Demo User
                </button>
            </form>
        </>
    );
}

export default LoginFormModal;