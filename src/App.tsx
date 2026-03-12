import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // In a real app, this would send to an API
      setEmail('');
    }
  };

  return (
    <div className="app-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Stop the Radical Redistricting Law in Virginia</h1>
          <p className="subtitle">Protect our communities. Preserve fair representation. Stand with us to say <strong>NO</strong> to partisan gerrymandering.</p>
          <div className="cta-buttons">
            <a href="#petition" className="btn btn-primary">Sign the Petition</a>
            <a href="#take-action" className="btn btn-secondary">Take Action Now</a>
          </div>
        </div>
      </header>

      <main>
        <section className="info-section">
          <div className="content-wrapper">
            <h2>What is Happening?</h2>
            <p>
              A new, radical redistricting law is being voted on in Virginia. This proposal threatens to divide communities of interest, dilute the power of local voters, and manipulate district lines for partisan advantage. We cannot allow politicians to pick their voters.
            </p>
            
            <div className="facts-grid">
              <div className="fact-card">
                <h3>Voter Dilution</h3>
                <p>The proposed map intentionally splits historical communities, weakening the voice of local residents.</p>
              </div>
              <div className="fact-card">
                <h3>Lack of Transparency</h3>
                <p>The drafting process was conducted behind closed doors with minimal opportunity for public input.</p>
              </div>
              <div className="fact-card">
                <h3>Partisan Power Grab</h3>
                <p>Independent analysis shows the new lines are heavily skewed to favor incumbent politicians over fair representation.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="petition" className="petition-section">
          <div className="content-wrapper">
            <h2>Add Your Name</h2>
            <p>Join thousands of Virginians demanding a fair, transparent, and non-partisan redistricting process.</p>
            
            {submitted ? (
              <div className="success-message">
                <h3>Thank you for standing with us!</h3>
                <p>We'll keep you updated on the latest developments and ways to help.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="petition-form">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <button type="submit" className="btn btn-primary">Sign Now</button>
              </form>
            )}
          </div>
        </section>

        <section id="take-action" className="action-section">
          <div className="content-wrapper">
            <h2>3 Ways to Help Today</h2>
            <ol className="action-list">
              <li>
                <strong>Call Your Representative:</strong> Tell them to vote NO on the proposed redistricting bill. 
                <a href="https://whomy.virginiageneralassembly.gov/" target="_blank" rel="noopener noreferrer"> Find your legislator</a>.
              </li>
              <li>
                <strong>Spread the Word:</strong> Share this page with friends and family on social media. Use the hashtag #StopEmVA.
              </li>
              <li>
                <strong>Attend the Rally:</strong> Join us at the Capitol Building next Tuesday at 10:00 AM to make our voices heard.
              </li>
            </ol>
          </div>
        </section>
      </main>

      <footer>
        <div className="content-wrapper">
          <p>&copy; {new Date().getFullYear()} StopEm.org. All rights reserved. Paid for by Virginians for Fair Maps.</p>
          <div className="footer-links">
            <a href="mailto:info@stopem.org">Contact Us</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
