import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Users, 
  EyeOff, 
  Phone, 
  Share2, 
  CalendarDays,
  ArrowRight,
  ShieldAlert,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../index.css';
import { supabase } from '../lib/supabase';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch site settings
  const [headline, setHeadline] = useState('Stop the Radical Redistricting Law in Virginia');
  const [subtitle, setSubtitle] = useState('They are trying to pick their voters. We demand fair representation. Stand with us to stop partisan gerrymandering before it\'s too late.');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (data && !error) {
          const headlineSetting = data.find(s => s.id === 'hero_headline');
          const subtitleSetting = data.find(s => s.id === 'hero_subtitle');
          if (headlineSetting) setHeadline(headlineSetting.value);
          if (subtitleSetting) setSubtitle(subtitleSetting.value);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    
    fetchSettings();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await supabase.from('signatures').insert([{ email }]);
      if (error) {
        if (error.code === '23505') setError('This email has already signed the petition.');
        else setError('There was an error saving your signature. Please try again.');
      } else {
        setSubmitted(true);
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1
    }
  };

  const itemTransition: any = { duration: 0.8, ease: "easeOut" };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-content">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="logo"
          >
            <ShieldAlert className="logo-icon logo-accent" />
            <span>StopEm<span className="logo-accent">.org</span></span>
          </motion.div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="nav-links"
          >
            <a href="#the-issue">The Issue</a>
            <Link to="/blog">News</Link>
            <a href="#petition">Petition</a>
            <a href="#take-action" className="btn btn-nav">Take Action</a>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero-content"
        >
          <motion.div variants={itemVariants} transition={itemTransition} className="hero-badge">
            <Star size={14} style={{ display: 'inline', marginRight: '0.5rem' }} fill="currentColor" /> 
            Defense of Democracy 
            <Star size={14} style={{ display: 'inline', marginLeft: '0.5rem' }} fill="currentColor" />
          </motion.div>
          <motion.h1 variants={itemVariants} transition={itemTransition} className="hero-title">
            {headline}
          </motion.h1>
          <motion.p variants={itemVariants} transition={itemTransition} className="hero-subtitle">
            {subtitle}
          </motion.p>
          <motion.div variants={itemVariants} transition={itemTransition} className="hero-cta">
            <a href="#petition" className="btn btn-primary btn-lg">
              Sign the Petition <ArrowRight className="icon-right" size={20} />
            </a>
            <a href="#the-issue" className="btn btn-secondary btn-lg">
              The Mission
            </a>
          </motion.div>
        </motion.div>
      </header>

      <div className="stripes-decor"></div>

      <main>
        {/* The Issue Section */}
        <section id="the-issue" className="section bg-light">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <h2 className="section-title">A Stand for Virginia</h2>
              <p className="section-description">
                Our commonwealth's future is at a crossroads. A radical proposal seeks to silence the voices of thousands by drawing lines that protect politicians, not people.
              </p>
            </motion.div>
            
            <div className="features-grid">
              {[
                { icon: Users, title: "Unity Over Division", text: "They seek to fracture historical communities. We stand for keeping neighborhoods together and voices strong." },
                { icon: EyeOff, title: "The Right to Know", text: "Government works best in the light. We demand an end to the closed-door deals that define this radical map." },
                { icon: AlertTriangle, title: "Fair Play", text: "Elections should be determined by voters, not by the pens of partisan mapmakers. We demand fair competition." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="feature-card"
                >
                  <div className="feature-icon-wrapper">
                    <feature.icon className="feature-icon" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Petition Section - High Gravity */}
        <section id="petition" className="section petition-section">
          <div className="container">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="petition-card"
            >
              <div className="petition-image">
                <div className="stars-overlay h-full w-full"></div>
              </div>
              <div className="petition-content">
                <h2>Join the Front Line</h2>
                <p>
                  Every signature is a message to Richmond: We are watching, and we will not be silenced. Add your name to the official petition for fair maps.
                </p>
                
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="success-banner"
                    >
                      <div className="success-icon">✓</div>
                      <div>
                        <h3>Duty Done.</h3>
                        <p>Thank you for standing with Virginia. We will notify you of the next rally.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit} 
                      className="petition-form"
                    >
                      {error && <div className="error-message" style={{marginBottom: '1rem'}}>{error}</div>}
                      <div className="input-group">
                        <input 
                          type="email" 
                          placeholder="Your Email Address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                          className="petition-input"
                          disabled={isSubmitting}
                        />
                        <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Recording...' : 'Sign Petition'}
                        </button>
                      </div>
                      <p className="privacy-note">Your information is used solely for the petition delivery.</p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Take Action Section */}
        <section id="take-action" className="section bg-light">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">The Path to Victory</h2>
              <p className="section-description">A movement is only as strong as its members. Here is how you can help secure our representation today.</p>
            </div>

            <div className="action-grid">
              {[
                { 
                  icon: Phone, 
                  title: "Legislative Pressure", 
                  text: "Call your representative directly. Tell them a 'YES' vote on this map is a 'NO' to their constituents.",
                  link: { text: "Find Your Legislator", url: "https://whomy.virginiageneralassembly.gov/" }
                },
                { 
                  icon: Share2, 
                  title: "Digital Rally", 
                  text: "Share this mission. The more Virginians who know the truth, the harder it is for them to ignore us.",
                  buttons: ["Share on X", "Share on FB"]
                },
                { 
                  icon: CalendarDays, 
                  title: "Stand in Person", 
                  text: "Join the mass rally at the Capitol. Nothing shows strength like thousands of citizens standing together.",
                  details: "Next Tuesday @ 10:00 AM | State Capitol Grounds"
                }
              ].map((action, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="action-step"
                >
                  <div className="step-number">{idx + 1}</div>
                  <div className="action-card">
                    <action.icon className="action-icon text-navy" size={32} />
                    <h3>{action.title}</h3>
                    <p>{action.text}</p>
                    {action.link && (
                      <a href={action.link.url} target="_blank" rel="noopener noreferrer" className="action-link">
                        {action.link.text} <ArrowRight size={16} />
                      </a>
                    )}
                    {action.buttons && (
                      <div className="share-buttons">
                        {action.buttons.map(b => <button key={b} className="btn-outline">{b}</button>)}
                      </div>
                    )}
                    {action.details && <div className="rally-details">{action.details}</div>}
                  </div>
                </motion.div>
              ))}
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
                <ShieldAlert className="logo-icon logo-accent" />
                <span>StopEm<span className="logo-accent">.org</span></span>
              </div>
              <p>For Virginia. For Fairness. For the Future.</p>
            </div>
            <div className="footer-links">
              <h4>Organization</h4>
              <Link to="/blog">Latest News</Link>
              <a href="#petition">Sign the Petition</a>
              <a href="#take-action">Get Involved</a>
            </div>
            <div className="footer-links">
              <h4>Contact</h4>
              <a href="mailto:info@stopem.org">info@stopem.org</a>
              <a href="#">Media Kit</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} StopEm.org. All rights reserved.</p>
            <div className="paid-for">Virginians for Fair Maps</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
