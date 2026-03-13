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
  Star,
  ExternalLink
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
  const [headline, setHeadline] = useState('Stop the Illegal Redistricting Power Grab');
  const [subtitle, setSubtitle] = useState('Politicians are trying to bypass the law and overturn the will of the people. Stand with Virginia families to demand fair maps and protect the sanctity of our vote.');

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
            <a href="#register">Register to Vote</a>
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
        {/* Vote Registration Section */}
        <section id="register" className="section bg-white" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <div className="petition-card" style={{ background: 'var(--c-navy)', color: 'white', display: 'block', boxShadow: '20px 20px 0 var(--c-gold)' }}>
              <div className="petition-content" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 style={{ color: 'white', fontSize: '3rem', fontFamily: 'var(--font-serif)' }}>Make Your Voice Count</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', marginBottom: '3rem' }}>
                    Signing the petition is powerful, but voting is the ultimate check on radical legislation. 
                    Ensure you are registered and ready for the 2026 Virginia elections.
                  </p>

                  <div className="features-grid" style={{ marginBottom: '4rem' }}>
                    <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '2rem' }}>
                      <h3 style={{ color: 'var(--c-gold)', fontSize: '1.25rem' }}>Primary Election</h3>
                      <p style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0' }}>August 4, 2026</p>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Registration Deadline: July 24</p>
                    </div>
                    <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '2rem' }}>
                      <h3 style={{ color: 'var(--c-gold)', fontSize: '1.25rem' }}>General Election</h3>
                      <p style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0' }}>Nov 3, 2026</p>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Registration Deadline: Oct 23</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a 
                      href="https://vote.elections.virginia.gov/VoterInformation" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary btn-lg"
                      style={{ background: 'var(--c-gold)', color: 'var(--c-navy)', boxShadow: '0 4px 0 #8a6d3b' }}
                    >
                      Register Online Now <ExternalLink size={20} />
                    </a>
                    <a 
                      href="https://vote.elections.virginia.gov/VoterInformation/Lookup/status" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary btn-lg"
                      style={{ border: '2px solid var(--c-gold)', color: 'var(--c-gold)', background: 'transparent' }}
                    >
                      Check Registration Status
                    </a>
                  </div>

                  <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.95rem', margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                      <strong>Pro-Tip:</strong> Virginia now offers <strong>Same-Day Registration</strong>. If you miss the deadline, you can still register and vote a provisional ballot in person at your registrar's office or polling place!
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* The Issue Section */}
        <section id="the-issue" className="section bg-light">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <h2 className="section-title">A Breach of Trust</h2>
              <p className="section-description">
                In 2020, 65% of Virginians voted for fair, bipartisan redistricting. Now, a radical effort seeks to trash that independent process and go back to smoky backrooms where politicians pick their voters.
              </p>
            </motion.div>
            
            <div className="features-grid">
              {[
                { icon: Users, title: "Protecting Our Families", text: "Good representation means having a representative who understands your specific community. We stand against carving up our neighborhoods for partisan math." },
                { icon: EyeOff, title: "Ending Secret Deals", text: "This amendment was rushed through a budget session without the required public notice. We demand transparency and the rule of law." },
                { icon: AlertTriangle, title: "The Will of the People", text: "We already settled this. We want politicians out of the room. We demand that the government respects the constitutional amendment we already passed." }
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
                  Every signature is a message to Richmond: We are watching, and we will not allow our voices to be deleted from the map. Add your name to the official petition.
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
              <h2 className="section-title">A Path to Victory</h2>
              <p className="section-description">This isn't about red vs. blue—it's about right vs. wrong. Join thousands of Virginians standing up for the rule of law.</p>
            </div>

            <div className="action-grid">
              {[
                { 
                  icon: Phone, 
                  title: "Hold Them Accountable", 
                  text: "Call your representative directly. Tell them a 'YES' vote on this map is a betrayal of their constituents' trust.",
                  link: { text: "Find Your Legislator", url: "https://whosmy.virginiageneralassembly.gov/" }                },
                { 
                  icon: Share2, 
                  title: "Rally the Neighbors", 
                  text: "Share this mission. The more families who know the truth about these illegal tactics, the harder it is for them to ignore us.",
                  buttons: ["Share on X", "Share on FB"]
                },
                { 
                  icon: CalendarDays, 
                  title: "Stand Together", 
                  text: "Join the mass rally at the Capitol. Let them see the faces of the people they are trying to silence.",
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
              <p>For our families. For the rule of law. For the future of Virginia.</p>
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
