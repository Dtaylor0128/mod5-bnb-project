import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user); //auth state

    return (
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


        </ul >
    );
}

export default Navigation;