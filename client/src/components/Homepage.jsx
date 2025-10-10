import { useNavigate } from 'react-router-dom';

function Homepage() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Welcome to the Office Queue System</h1>
            <div style={{ marginTop: '50px' }}>
                <button
                    style={{ fontSize: '24px', padding: '20px 40px', margin: '20px' }}
                    onClick={() => navigate('/customer')}
                >
                    Customer
                </button>
                <button
                    style={{ fontSize: '24px', padding: '20px 40px', margin: '20px' }}
                    onClick={() => navigate('/officer')}
                >
                    Officer
                </button>
            </div>
        </div>
    );
}

export default Homepage;
