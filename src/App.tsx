import { useState, useEffect, useRef } from 'react';
import type { FC, ReactNode, FormEvent } from 'react';

// --- EmailJS Declaration ---
// This makes the emailjs object available in our component
declare global {
    interface Window {
        emailjs: {
            // FIX: Replaced Promise<any> with the specific type
            sendForm: (serviceID: string, templateID: string, form: HTMLFormElement) => Promise<EmailJSResponse>;
        };
    }
}

// Define specific types for the EmailJS response
interface EmailJSResponse {
    status: number;
    text: string;
}

interface EmailJSError {
    text: string;
}


// --- CSS Styles Component ---
const AppStyles = () => (
  <style>{`
    /* --- ALL YOUR EXISTING STYLES... --- */
    :root {
      --app-height: 100vh; 
      --light-accent: #e58c97;
      --light-accent-hover: #d17a85;
      --text-dark: #3a2e2e;
      --text-mid: #6b5a5a;
      --text-light: #fdf8f5;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #0a0a0a;
      color: var(--text-dark);
      line-height: 1.6;
    }

    .app-container {
      height: var(--app-height);
      width: 100%;
      overflow: hidden;
    }
    
    .video-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
    }

    .main-content {
        height: 100%;
        overflow-y: scroll;
        scroll-behavior: smooth;
    }

    .animated-element {
      transition: opacity 0.7s ease-out, transform 0.7s ease-out;
      opacity: 0;
      transform: translateY(20px);
    }
    .animated-element.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 50;
      background-color: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 4.5rem;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-dark);
      text-decoration: none;
    }
    .nav-links {
      display: none;
      align-items: center;
      gap: 2rem;
    }
    .nav-links a {
      color: var(--text-mid);
      transition: color 0.2s ease;
      text-decoration: none;
    }
    .nav-links a:hover {
      color: var(--light-accent);
    }
    .mobile-menu-button {
      display: block;
      background: none;
      border: none;
      cursor: pointer;
    }
    .mobile-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 1rem 1.5rem;
    }
    .mobile-menu a {
        color: var(--text-mid);
        text-decoration: none;
    }
    
    .cta-button {
      background-color: var(--light-accent);
      color: white;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s ease;
      text-decoration: none;
    }
    .cta-button:hover {
      background-color: var(--light-accent-hover);
    }
    
    .section {
        width: 100%;
        min-height: 90vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5rem 1.5rem;
    }
    #hero {
        min-height: 100%;
    }
    .section-content {
        max-width: 1100px;
        width: 100%;
        text-align: center;
        color: var(--text-light);
        text-shadow: 0 2px 8px rgba(0,0,0,0.7);
    }

    .content-panel {
        background-color: rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .hero-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 800;
        line-height: 1.1;
    }
    .hero-subtitle {
        font-size: clamp(1.1rem, 2vw, 1.25rem);
        max-width: 40rem;
        margin: 1rem auto 0;
        color: rgba(255, 255, 255, 0.9);
    }
    .hero-cta {
        margin-top: 2rem;
        display: inline-block;
        font-size: 1.125rem;
        font-weight: 700;
        padding: 1rem 2rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .hero-subtext {
        margin-top: 1rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.9);
    }

    .section-header {
        margin-bottom: 3rem;
    }
    .section-title {
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 700;
    }
    .section-subtitle {
        font-size: clamp(1.1rem, 2vw, 1.25rem);
        max-width: 40rem;
        margin: 1rem auto 0;
        color: rgba(255, 255, 255, 0.9);
    }

    .features-grid {
        display: grid;
        gap: 2rem;
    }
    .feature-card {
        background-color: rgba(0,0,0,0.2);
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(255,255,255,0.1);
        text-align: center;
    }
    .feature-card h3, .feature-card p {
        text-shadow: none;
    }
    .feature-icon-wrapper {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
        border-radius: 50%;
        background-color: rgba(229, 140, 151, 0.2);
    }
    .feature-icon {
        width: 2rem;
        height: 2rem;
        color: var(--light-accent);
    }
    .feature-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    .feature-description {
        color: rgba(255,255,255,0.8);
    }

    .principles-grid {
        display: grid;
        gap: 2rem;
    }
    .principle-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    .principle-description {
        color: rgba(255,255,255,0.9);
    }

    .faq-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .faq-item {
        background-color: rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 0.5rem;
    }
    .faq-item * { text-shadow: none; }
    .faq-question {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        padding: 1rem;
        font-weight: 600;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-light);
    }
    .faq-icon {
        transition: transform 0.3s;
    }
    .faq-icon.is-open {
        transform: rotate(180deg);
    }
    .faq-answer-wrapper {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition: grid-template-rows 0.5s ease-in-out, opacity 0.5s ease-in-out;
    }
    .faq-answer-wrapper.is-open {
        grid-template-rows: 1fr;
        opacity: 1;
    }
    .faq-answer {
        overflow: hidden;
    }
    .faq-answer p {
        padding: 0 1rem 1rem;
        color: rgba(255,255,255,0.8);
    }
    
    /* --- NEW CONTACT FORM STYLES --- */
    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto;
        text-align: left;
    }
    .contact-form label {
        font-weight: 600;
        color: var(--text-light);
        text-shadow: none;
    }
    .contact-form input,
    .contact-form textarea {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background-color: rgba(0, 0, 0, 0.3);
        color: var(--text-light);
        font-family: inherit;
    }
    .contact-form input:focus,
    .contact-form textarea:focus {
        outline: none;
        border-color: var(--light-accent);
    }
    .contact-form button {
        background-color: var(--light-accent);
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    .contact-form button:hover {
        background-color: var(--light-accent-hover);
    }
    .status-message {
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
    }
    .status-message.success {
        color: #4ade80; /* A green color */
    }
    .status-message.error {
        color: #f87171; /* A red color */
    }
    
    .footer {
        width: 100%;
        color: rgba(255,255,255,0.9);
        padding: 1.5rem;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    .footer-container {
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    .footer-links {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        font-size: 0.875rem;
    }
    .footer-links-group {
        display: flex;
        gap: 1.5rem;
    }
    .footer-links a {
        color: rgba(255,255,255,0.9);
        text-decoration: none;
        transition: color 0.2s ease;
    }
    .footer-links a:hover {
        color: var(--light-accent);
    }
    .footer .logo {
        color: var(--text-light);
    }
    
    @media (min-width: 640px) {
        .content-panel {
            padding: 2.5rem;
        }
    }
    @media (min-width: 768px) {
        .nav-links { display: flex; }
        .mobile-menu-button, .mobile-menu { display: none; }
        .features-grid, .principles-grid { grid-template-columns: repeat(3, 1fr); }
        .footer-container {
            flex-direction: row;
            justify-content: space-between;
        }
        .footer-links {
            flex-direction: row;
            gap: 1.5rem;
        }
    }
  `}</style>
);


// --- Animated Element Hook ---
const useAnimatedElement = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (ref.current) observer.unobserve(ref.current);
            }
        }, { threshold: 0.1, ...options });
        const element = ref.current;
        if (element) observer.observe(element);
        return () => { if (element) observer.unobserve(element); };
    }, [options]);
    return { ref, isVisible };
};

// --- Animated Component Wrapper ---
interface AnimatedElementProps {
    children: ReactNode;
    className?: string;
}
const AnimatedElement: FC<AnimatedElementProps> = ({ children, className }) => {
    const { ref, isVisible } = useAnimatedElement();
    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`${className || ''} animated-element ${isVisible ? 'is-visible' : ''}`}
        >
            {children}
        </div>
    );
};

// --- Header Component ---
const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="header">
            <div className="header-container">
                <a href="#hero" className="logo">Solace</a>
                <nav className="nav-links">
                    <a href="#features" onClick={closeMenu}>Our Tools</a>
                    <a href="#principles" onClick={closeMenu}>Our Principles</a>
                    <a href="#faq" onClick={closeMenu}>FAQ</a>
                    <a href="#contact" onClick={closeMenu}>Contact Us</a> 
                    <a href="#download" onClick={closeMenu} className="cta-button">Download</a>
                </nav>
                <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1.5rem', height: '1.5rem', color: 'var(--text-dark)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
                </button>
            </div>
            {isMenuOpen && (
                <div className="mobile-menu">
                    <a href="#features" onClick={closeMenu}>Our Tools</a>
                    <a href="#principles" onClick={closeMenu}>Our Principles</a>
                    <a href="#faq" onClick={closeMenu}>FAQ</a>
                    <a href="#contact" onClick={closeMenu}>Contact Us</a>
                    <a href="#download" onClick={closeMenu} className="cta-button" style={{width: '100%', textAlign: 'center', display: 'block'}}>Download</a>
                </div>
            )}
        </header>
    );
};

// --- FAQ Item Component ---
interface FAQItemProps {
    question: string;
    children: ReactNode;
}
const FAQItem: FC<FAQItemProps> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <AnimatedElement className="faq-item">
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <span className={`faq-icon ${isOpen ? 'is-open' : ''}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1.5rem', height: '1.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            <div className={`faq-answer-wrapper ${isOpen ? 'is-open' : ''}`}>
                <div className="faq-answer"><p>{children}</p></div>
            </div>
        </AnimatedElement>
    );
};

// --- Contact Us Component ---
const ContactUs: FC = () => {
    const form = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState({ message: '', type: '' });

    const sendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.current) {
            setStatus({ message: 'Sending...', type: '' });
            window.emailjs.sendForm('service_oq9r7qo', 'template_hpqyfly', form.current)
                .then((result: EmailJSResponse) => {
                    console.log(result.text);
                    setStatus({ message: 'Feedback sent successfully!', type: 'success' });
                    form.current?.reset();
                }, (error: EmailJSError) => {
                    console.log(error.text);
                    setStatus({ message: 'Failed to send feedback. Please try again.', type: 'error' });
                });
        }
    };

    return (
        <section id="contact" className="section">
            <div className="section-content content-panel">
                <AnimatedElement className="section-header">
                    <h2 className="section-title">Get In Touch</h2>
                    <p className="section-subtitle">Have questions or feedback? We'd love to hear from you.</p>
                </AnimatedElement>
                <AnimatedElement>
                    <form ref={form} onSubmit={sendEmail} className="contact-form">
                        <label>Name</label>
                        <input type="text" name="from_name" required />
                        <label>Email</label>
                        <input type="email" name="from_email" required />
                        <label>Message</label>
                        <textarea name="message" rows={5} required />
                        <button type="submit">Send Message</button>
                    </form>
                    {status.message && (
                        <p className={`status-message ${status.type}`}>{status.message}</p>
                    )}
                </AnimatedElement>
            </div>
        </section>
    );
};


// --- Video Background Component ---
const VideoBackground: FC = () => (
    <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
    >
        <source src="https://motionbgs.com/media/36/under-the-cherry-tree.960x540.mp4" type="video/mp4" />
        Your browser does not support the video tag.
    </video>
);

// --- Main App Component ---
const App: FC = () => {
    useEffect(() => {
        const setAppHeight = () => {
            document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
        };
        window.addEventListener('resize', setAppHeight);
        setAppHeight();
        return () => window.removeEventListener('resize', setAppHeight);
    }, []);

    return (
        <>
            <AppStyles />
            <div className="app-container">
                <VideoBackground />
                <Header />
                <main className="main-content">

                    <section id="hero" className="section">
                        <div className="section-content">
                            <AnimatedElement>
                                <h1 className="hero-title">A private first-aid kit for difficult feelings.</h1>
                            </AnimatedElement>
                            <AnimatedElement>
                                <p className="hero-subtitle">Solace is a safe sanctuary on your phone for quiet, tough moments. The friend you can turn to at 3 AM, without judgment.</p>
                            </AnimatedElement>
                            <AnimatedElement>
                                <p className="hero-subtext">Available for Android.</p>
                            </AnimatedElement>
                        </div>
                    </section>

                    <section id="features" className="section">
                        <div className="section-content content-panel">
                            <AnimatedElement className="section-header">
                                <h2 className="section-title">Gentle Tools for When You Need Them Most</h2>
                                <p className="section-subtitle">When you feel alone with sleeplessness, insecurity, or heartbreak, Solace is here.</p>
                            </AnimatedElement>
                            <div className="features-grid">
                                <AnimatedElement className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                    </div>
                                    <h3 className="feature-title">If you can't sleep</h3>
                                    <p className="feature-description">Calm a busy, anxious mind with guided breathing, soothing soundscapes, and a "Mind Unloader" journal.</p>
                                </AnimatedElement>
                                <AnimatedElement className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 className="feature-title">If you're feeling insecure</h3>
                                    <p className="feature-description">Challenge nagging feelings of not being good enough. Remember daily wins and reframe negative thoughts.</p>
                                </AnimatedElement>
                                <AnimatedElement className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </div>
                                    <h3 className="feature-title">If you're healing heartbreak</h3>
                                    <p className="feature-description">Navigate pain with the secure "Vent Vault" and find gentle prompts to reconnect with yourself.</p>
                                </AnimatedElement>
                            </div>
                        </div>
                    </section>

                    <section id="principles" className="section">
                        <div className="section-content">
                            <AnimatedElement className="section-header">
                                <h2 className="section-title">Our Core Principles</h2>
                                <p className="section-subtitle">Your safe space is built on these promises.</p>
                            </AnimatedElement>
                            <div className="principles-grid">
                                <AnimatedElement>
                                    <h3 className="principle-title">100% Private</h3>
                                    <p className="principle-description">All your data stays on your phone. We don't collect it, see it, or share it. Ever. Your sanctuary is truly yours.</p>
                                </AnimatedElement>
                                <AnimatedElement>
                                    <h3 className="principle-title">You Are In Control</h3>
                                    <p className="principle-description">The app never guesses how you feel or tells you what to do. You choose your path. You choose your tools.</p>
                                </AnimatedElement>
                                <AnimatedElement>
                                    <h3 className="principle-title">Gentle & Compassionate</h3>
                                    <p className="principle-description">Every word, design choice, and notification is crafted to be calm, supportive, and kind.</p>
                                </AnimatedElement>
                            </div>
                        </div>
                    </section>

                    <section id="faq" className="section">
                        <div className="section-content content-panel">
                            <AnimatedElement className="section-header">
                                <h2 className="section-title">Your Questions, Answered</h2>
                                <p className="section-subtitle">Everything you need to know about Solace.</p>
                            </AnimatedElement>
                            <div className="faq-list">
                                <FAQItem question="Is my data and journal information really private?">
                                    Yes, 100%. We built Solace so that all your personal entries and data are stored only on your device. We have no access to it, and we do not collect any personal information. Your privacy is the foundation of this app.
                                </FAQItem>
                                <FAQItem question="Is Solace a replacement for therapy?">
                                    Solace is designed to be a compassionate first-aid kit, not a substitute for professional mental health care. It can be a wonderful companion for managing difficult moments, but we always encourage seeking help from a qualified therapist for ongoing support.
                                </FAQItem>
                                <FAQItem question="Is the app free to use?">
                                    Yes, the core features of Solace are completely free. We believe everyone deserves access to these tools. We may offer optional premium features in the future to support the project, but our main goal is to provide a helpful, accessible resource.
                                </FAQItem>
                            </div>
                        </div>
                    </section>

                    <ContactUs /> 

                    <section id="download" className="section">
                        <div className="section-content">
                            <AnimatedElement>
                                <h2 className="section-title">Find a little solace.</h2>
                            </AnimatedElement>
                            <AnimatedElement>
                                <p className="section-subtitle">Your personal, private companion is ready when you are. Download the app to create your own safe space.</p>
                            </AnimatedElement>
                            <AnimatedElement>
                                <a href="https://github.com/Aerodia/Solace-App-Release/releases/download/v1.0.1/Solace-v1.0.apk" className="cta-button hero-cta">Download for Free</a>
                            </AnimatedElement>
                            <AnimatedElement>
                                <p className="hero-subtext">For Android devices.</p>
                            </AnimatedElement>
                        </div>
                    </section>
                    
                    <footer className="footer">
                        <div className="footer-container">
                            <a href="#hero" className="logo">Solace</a>
                            <div className="footer-links">
                                <p>&copy; 2025 Solace. All rights reserved.</p>
                                <div className="footer-links-group">
                                   <a href="#">Privacy Policy</a>
                                   <a href="#">Terms of Service</a>
                                </div>
                            </div>
                        </div>
                    </footer>

                </main>
            </div>
        </>
    );
};

export default App;