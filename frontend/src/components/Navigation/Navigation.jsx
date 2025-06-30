import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user); //auth state

    return (
        <nav className="main-header">
            <div className="header-left">
                <NavLink to="/" className="logo-link">
                    <img src="/logo-only-no-background.png"
                        alt="RanchBnB Logo"
                        className="logo"
                        style={{ height: "100px", cursor: "pointer" }}
                    />
                </NavLink>
            </div>

            {/* Center Logo Text */}
            <div className="header-center">
                <NavLink to="/" className="brand-text">
                    <h1> RanchBnB </h1>
                </NavLink>
            </div>

            <div className="header-right">
                <ul className="nav-container">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    {isLoaded && sessionUser && (
                        <li>
                            <button
                                onClick={() => navigate('/spots/new')}
                                className="create-spot-button"
                            >
                                Create a Spot
                            </button>
                        </li>
                    )}
                    <li>
                        <ProfileButton user={sessionUser} />
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;