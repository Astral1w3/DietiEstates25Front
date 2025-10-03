// File: Home.js
import SearchBar from '../../components/SearchBar/SearchBar'; // 1. IMPORTA IL COMPONENTE
import './Home.css'; 

const Home = () => {
    return (
        <div className="hero-container">
            <div className="hero-overlay"></div>

            <main className="hero-content">
                <h1>Discover a place<br />you'll love to live</h1>
                
                {/* 2. USA IL COMPONENTE SEARCHBAR QUI */}
                <div className="search-container">
                    <SearchBar />
                </div>
                
            </main>
        </div>
    );
};

export default Home;