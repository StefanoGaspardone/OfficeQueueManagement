import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Welcome to the Office Queue Management System</h1>
            <div className="columns">
                <div className="column customer">
                    <p>If you're a customer, click the button below to choose a service and get a ticket</p>
                    <button className="homepage-button" onClick={() => navigate('/customer')}>
                        Customer
                    </button>
                </div>
                <div className="column officer">
                    <p>If you're an officer, click the button below to select your desk and see its informations</p>
                    <button className="homepage-button" onClick={() => navigate('/officer')}>
                        Officer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
