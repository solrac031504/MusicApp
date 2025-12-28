import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<string>(sessionStorage.getItem('user')!);

    return (
        <div className="home-container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand">Music App</span>
                    <span className="navbar-brand"><a href="/genres">Genres</a></span>
                </div>
            </nav>

            <main className="container mt-4">
                <h1>Welcome, {user}!</h1>
                <p>Placeholder for rest of stuff :)</p>
            </main>
        </div>
    );
};

export default Home;