import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Users, 
  EyeOff, 
  MapMap, 
  Megaphone, 
  Phone, 
  Share2, 
  CalendarDays,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import './index.css';

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo">
            <ShieldAlert className="logo-icon" />
            <span>StopEm<span className="logo-accent">.org</span></span>
          </div>
          <div className="nav-links">
            <a href="#the-issue">The Issue</a>
            <a href="#petition">Petition</a>
            <a href="#take-action" className="btn btn-nav">Take Action</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content fade-in-up">
          <div className="hero-badge">Urgent Action Required</div>
          <h1 className="hero-title">
            Stop the Radical Redistricting Law in Virginia
          </h1>
          <p className="hero-subtitle">
            They are trying to pick their voters. We demand fair representation. Stand with us to stop partisan gerrymandering before it's too late.
          </p>
          <div className="hero-cta">
            <a href="#petition" className="btn btn-primary btn-lg">
              Sign the Petition <ArrowRight className="icon-right" size={20} />
            </a>
            <a href="#the-issue" className="btn btn-secondary btn-lg">
              Learn More
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* The Issue Section */}
        <section id="the-issue" className="section bg-light">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">What is at Stake?</h2>
              <p className="section-description">
                A new, radical redistricting law is being rushed to a vote in Virginia. This proposal threatens to manipulate district lines, ensuring certain politicians keep their seats while silencing local communities.
              </p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper red">
                  <Users className="feature-icon" />
                </div>
                <h3>Voter Dilution</h3>
                <p>The proposed map intentionally fractures historical communities, splitting neighborhoods to weaken the collective voice of local residents.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper dark">
                  <EyeOff className="feature-icon" />
                </div>
                <h3>Closed-Door Deals</h3>
                <p>The drafting process was conducted in secret, deliberately bypassing public input and violating transparency standards.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper blue">
                  <AlertTriangle className="feature-icon" />
                </div>
                <h3>Partisan Power Grab</h3>
                <p>Independent analysts confirm the new boundaries are heavily skewed to protect incumbents rather than ensuring competitive, fair elections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Petition Section */}
        <section id="petition" className="section petition-section">
          <div className="container">
            <div className="petition-card">
              <div className="petition-content">
                <h2>Add Your Name to the Fight</h2>
                <p>
                  Join thousands of Virginians demanding a fair, transparent, and non-partisan redistricting process. We will deliver this petition directly to the State Capitol.
                </p>
                
                {submitted ? (
                  <div className="success-banner">
                    <div className="success-icon">✓</div>
                    <div>
                      <h3>Thank you for standing with us!</h3>
                      <p>Your voice matters. We'll keep you updated on the latest developments.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="petition-form">
                    <div className="input-group">
                      <input 
                        type="email" 
                        placeholder="Enter your email address to sign" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="petition-input"
                      />
                      <button type="submit" className="btn btn-primary btn-submit">
                        Sign Now
                      </button>
                    </div>
                    <p className="privacy-note">We respect your privacy. No spam, ever.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Take Action Section */}
        <section id="take-action" className="section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">3 Ways to Help Today</h2>
              <p className="section-description">Signing the petition is the first step. Here is how you can maximize your impact right now.</p>
            </div>

            <div className="action-grid">
              <div className="action-step">
                <div className="step-number">1</div>
                <div className="action-card">
                  <Phone className="action-icon text-blue" />
                  <h3>Call Your Representative</h3>
                  <p>Tell them to vote NO on the proposed redistricting bill. A 2-minute phone call is the most effective way to pressure legislators.</p>
                  <a href="https://whomy.virginiageneralassembly.gov/" target="_blank" rel="noopener noreferrer" className="action-link">
                    Find your legislator <ArrowRight size={16} />
                  </a>
                </div>
              </div>

              <div className="action-step">
                <div className="step-number">2</div>
                <div className="action-card">
                  <Share2 className="action-icon text-red" />
                  <h3>Spread the Word</h3>
                  <p>Share this page with friends, family, and neighbors. Use the hashtag <strong>#StopEmVA</strong> on your social media platforms.</p>
                  <div className="share-buttons">
                    <button className="btn-outline">Share on X</button>
                    <button className="btn-outline">Share on Facebook</button>
                  </div>
                </div>
              </div>

              <div className="action-step">
                <div className="step-number">3</div>
                <div className="action-card">
                  <CalendarDays className="action-icon text-dark" />
                  <h3>Attend the Rally</h3>
                  <p>Join us at the Capitol Building to make our voices heard in person. Bring signs, bring friends, and bring your energy.</p>
                  <div className="rally-details">
                    <strong>Next Tuesday @ 10:00 AM</strong><br />
                    Virginia State Capitol Grounds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <ShieldAlert className="logo-icon" />
                <span>StopEm<span className="logo-accent">.org</span></span>
              </div>
              <p>Fighting for fair maps and true representation in Virginia.</p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <a href="#the-issue">The Issue</a>
              <a href="#petition">Sign Petition</a>
              <a href="#take-action">Take Action</a>
            </div>
            <div className="footer-links">
              <h4>Contact</h4>
              <a href="mailto:info@stopem.org">info@stopem.org</a>
              <a href="#">Press Inquiries</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} StopEm.org. All rights reserved.</p>
            <div className="paid-for">Paid for by Virginians for Fair Maps</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
