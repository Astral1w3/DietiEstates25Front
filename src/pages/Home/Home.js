import React from 'react';
import './Home.css'; // Importiamo il file CSS per lo stile

const Home = () => {


    return (
        
        <div className="hero-container">
            {/* Overlay scuro per migliorare la leggibilità del testo */}
            <div className="hero-overlay"></div>

            <main className="hero-content">
                <h1>Discover a place<br />you'll love to live</h1>
                <div className="search-container">
                    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                        <input className="search-form" type="text" placeholder="Naples, NA" />
                        <button type="submit" aria-label="Search">
                            {/* Icona SVG per la lente di ingrandimento */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </form>
                </div>
            </main>
        </div>

    );
};

export default Home;