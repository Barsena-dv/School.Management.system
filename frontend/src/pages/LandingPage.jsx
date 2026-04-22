import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
    GraduationCap, BookOpen, ClipboardCheck, BarChart3,
    Shield, Zap, Users, Bell, ArrowRight, ChevronRight,
    Star, CheckCircle2, Globe, Layers, Sparkles, Play
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════
   Animated Counter Hook
═══════════════════════════════════════════════════════════════ */
const useCounter = (end, duration = 2000, startOnView = true) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const started = useRef(false)

    useEffect(() => {
        if (!startOnView) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true
                    let start = 0
                    const increment = end / (duration / 16)
                    const timer = setInterval(() => {
                        start += increment
                        if (start >= end) {
                            setCount(end)
                            clearInterval(timer)
                        } else {
                            setCount(Math.floor(start))
                        }
                    }, 16)
                }
            },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [end, duration, startOnView])

    return [count, ref]
}

/* ═══════════════════════════════════════════════════════════════
   Scroll-triggered fade-in hook
═══════════════════════════════════════════════════════════════ */
const useFadeIn = (delay = 0) => {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setVisible(true), delay)
                }
            },
            { threshold: 0.15 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [delay])

    return [ref, visible]
}

/* ═══════════════════════════════════════════════════════════════
   Landing Page Component
═══════════════════════════════════════════════════════════════ */
const LandingPage = () => {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const features = [
        { icon: BookOpen, title: 'Smart Assignments', desc: 'Create, distribute, and grade assignments with an intelligent tracking pipeline.', color: '#4F46E5' },
        { icon: ClipboardCheck, title: 'Attendance Engine', desc: 'Real-time attendance marking with subject-wise analytics and trend detection.', color: '#06B6D4' },
        { icon: BarChart3, title: 'Performance Analytics', desc: 'Visual dashboards with score distributions, pass rates, and progress tracking.', color: '#10B981' },
        { icon: Shield, title: 'Role-Based Access', desc: 'Separate portals for Admin, Teacher, and Student with granular permissions.', color: '#F59E0B' },
        { icon: Bell, title: 'Push Notifications', desc: 'Instant alerts for grades, events, deadlines, and administrative announcements.', color: '#EF4444' },
        { icon: Layers, title: 'Modular Architecture', desc: 'Scalable MERN stack with service-oriented backend and interceptor-based auth.', color: '#8B5CF6' },
    ]

    const stats = [
        { label: 'Active Students', value: 2500, suffix: '+' },
        { label: 'Courses Managed', value: 120, suffix: '+' },
        { label: 'Uptime', value: 99.9, suffix: '%', decimals: 1 },
        { label: 'API Endpoints', value: 45, suffix: '+' },
    ]

    const testimonials = [
        { name: 'Dr. Priya Sharma', role: 'Principal, DPS International', text: 'EduPortal transformed how we manage our institution. The analytics alone saved us hundreds of hours per semester.', rating: 5 },
        { name: 'Rajesh Kumar', role: 'HOD Computer Science', text: 'The assignment pipeline is brilliant. I can track submissions, grade in-system, and students get instant feedback.', rating: 5 },
        { name: 'Ananya Verma', role: 'Student, Class XII', text: 'Finally a student portal that actually works! The attendance tracker and marks dashboard keep me on top of everything.', rating: 5 },
    ]

    return (
        <div style={{ background: '#090A0F', color: '#FFFFFF', overflowX: 'hidden' }}>

            {/* ── Inline Keyframes ──────────────────────────────────── */}
            <style>{`
                @keyframes heroFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                }
                @keyframes heroPulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                @keyframes gridPan {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 60px); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideLeft {
                    from { opacity: 0; transform: translateX(60px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes orbit {
                    0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
                }
                @keyframes typeCursor {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .fade-in-up {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .fade-in-up.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .feature-card:hover .feature-icon {
                    transform: scale(1.1) rotate(-5deg);
                    box-shadow: 0 0 24px var(--glow-color);
                }
                .feature-card:hover {
                    border-color: rgba(79, 70, 229, 0.3);
                    transform: translateY(-4px);
                }
                .cta-glow {
                    position: relative;
                    overflow: hidden;
                }
                .cta-glow::after {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    background: linear-gradient(135deg, #4F46E5, #06B6D4, #4F46E5);
                    background-size: 300% 300%;
                    animation: gradientShift 3s ease-in-out infinite;
                    border-radius: inherit;
                    z-index: -1;
                    filter: blur(8px);
                    opacity: 0.5;
                }
            `}</style>

            {/* ═══════════════════════════════════════════════════════
                NAVIGATION
            ═══════════════════════════════════════════════════════ */}
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: '0 2rem',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                    background: scrolled ? 'rgba(9, 10, 15, 0.85)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(79, 70, 229, 0.4)',
                        }}
                    >
                        <GraduationCap size={18} color="white" strokeWidth={2.5} />
                    </div>
                    <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        letterSpacing: '-0.02em',
                    }}>EduPortal</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'transparent',
                            color: '#D1D5DB',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            fontFamily: "'Outfit', sans-serif",
                            cursor: 'pointer',
                            transition: 'all 200ms',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#D1D5DB' }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                            color: 'white',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            fontFamily: "'Outfit', sans-serif",
                            cursor: 'pointer',
                            transition: 'all 200ms',
                            boxShadow: '0 0 12px rgba(79, 70, 229, 0.3)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(79, 70, 229, 0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 12px rgba(79, 70, 229, 0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* ═══════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════ */}
            <section
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6rem 2rem 4rem',
                    overflow: 'hidden',
                }}
            >
                {/* Animated grid background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(79, 70, 229, 0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(79, 70, 229, 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    animation: 'gridPan 20s linear infinite',
                    pointerEvents: 'none',
                }} />

                {/* Glow orbs */}
                <div style={{
                    position: 'absolute',
                    width: '600px', height: '600px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
                    top: '-200px', left: '-200px',
                    animation: 'heroPulse 6s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    width: '500px', height: '500px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
                    bottom: '-150px', right: '-150px',
                    animation: 'heroPulse 8s ease-in-out infinite 1s',
                    pointerEvents: 'none',
                }} />

                {/* Content */}
                <div style={{
                    position: 'relative', zIndex: 2,
                    maxWidth: '900px', textAlign: 'center',
                    animation: 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}>
                    {/* Pill badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.375rem 1rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(79, 70, 229, 0.3)',
                        background: 'rgba(79, 70, 229, 0.08)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: "'Outfit', sans-serif",
                        color: '#A5B4FC',
                        marginBottom: '1.5rem',
                        letterSpacing: '0.02em',
                    }}>
                        <Sparkles size={13} />
                        Next-Gen Student Management
                    </div>

                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: 800,
                        lineHeight: 1.08,
                        letterSpacing: '-0.04em',
                        marginBottom: '1.5rem',
                    }}>
                        The Operating System{' '}
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #A5B4FC, #06B6D4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            for Modern Education
                        </span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        color: '#9CA3AF',
                        maxWidth: '600px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.7,
                        fontWeight: 400,
                    }}>
                        Streamline assignments, attendance, marks, and institutional
                        workflows — all from one unified, intelligent platform.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/register')}
                            className="cta-glow"
                            style={{
                                padding: '0.875rem 2rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                                color: 'white',
                                fontSize: '0.9375rem',
                                fontWeight: 700,
                                fontFamily: "'Outfit', sans-serif",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 300ms',
                                position: 'relative',
                                zIndex: 1,
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                        >
                            Start Free Trial <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '0.875rem 2rem',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.03)',
                                color: '#D1D5DB',
                                fontSize: '0.9375rem',
                                fontWeight: 600,
                                fontFamily: "'Outfit', sans-serif",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 300ms',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#D1D5DB' }}
                        >
                            <Play size={14} /> Watch Demo
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div style={{
                        marginTop: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        opacity: 0.5,
                    }}>
                        {['256-bit SSL', 'GDPR Ready', 'SOC 2 Compliant', '99.9% Uptime'].map(badge => (
                            <div key={badge} style={{
                                display: 'flex', alignItems: 'center', gap: '0.375rem',
                                fontSize: '0.6875rem', fontWeight: 600, color: '#6B7280',
                                letterSpacing: '0.05em', textTransform: 'uppercase',
                                fontFamily: "'Outfit', sans-serif",
                            }}>
                                <CheckCircle2 size={11} /> {badge}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating orbital elements */}
                <div style={{
                    position: 'absolute',
                    width: '280px', height: '280px',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            width: '8px', height: '8px',
                            borderRadius: '50%',
                            background: i === 0 ? '#4F46E5' : i === 1 ? '#06B6D4' : '#A5B4FC',
                            boxShadow: `0 0 12px ${i === 0 ? 'rgba(79,70,229,0.6)' : i === 1 ? 'rgba(6,182,212,0.6)' : 'rgba(165,180,252,0.4)'}`,
                            animation: `orbit ${8 + i * 4}s linear infinite`,
                            animationDelay: `${i * 2}s`,
                        }} />
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                STATS SECTION
            ═══════════════════════════════════════════════════════ */}
            <section style={{
                padding: '4rem 2rem',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: 'rgba(255,255,255,0.01)',
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
                    {stats.map(({ label, value, suffix, decimals }) => {
                        const [count, ref] = useCounter(value)
                        return (
                            <div key={label} ref={ref} style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontSize: '2.75rem',
                                    fontWeight: 800,
                                    letterSpacing: '-0.04em',
                                    background: 'linear-gradient(135deg, #FFFFFF, #A5B4FC)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    lineHeight: 1,
                                }}>
                                    {decimals ? count.toFixed(decimals) : count}{suffix}
                                </div>
                                <p style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#6B7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginTop: '0.5rem',
                                    fontFamily: "'Outfit', sans-serif",
                                }}>{label}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                FEATURES SECTION
            ═══════════════════════════════════════════════════════ */}
            <section style={{ padding: '6rem 2rem', position: 'relative' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <FeatureSectionHeader />

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.25rem',
                        marginTop: '3rem',
                    }}>
                        {features.map((feat, idx) => (
                            <FeatureCard key={idx} {...feat} delay={idx * 100} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                DASHBOARD PREVIEW
            ═══════════════════════════════════════════════════════ */}
            <section style={{
                padding: '6rem 2rem',
                position: 'relative',
                background: 'linear-gradient(180deg, transparent 0%, rgba(79,70,229,0.03) 50%, transparent 100%)',
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <DashboardPreview />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════════════════════════════ */}
            <section style={{ padding: '6rem 2rem' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <TestimonialSectionHeader />
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.25rem',
                        marginTop: '3rem',
                    }}>
                        {testimonials.map((t, idx) => (
                            <TestimonialCard key={idx} {...t} delay={idx * 120} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                CTA SECTION
            ═══════════════════════════════════════════════════════ */}
            <section style={{ padding: '6rem 2rem' }}>
                <CTASection navigate={navigate} />
            </section>

            {/* ═══════════════════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════════════════ */}
            <footer style={{
                padding: '3rem 2rem',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                textAlign: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <GraduationCap size={14} color="white" />
                    </div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9375rem' }}>EduPortal</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 500 }}>
                    © {new Date().getFullYear()} EduPortal. Built with precision for modern institutions.
                </p>
            </footer>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   Sub-Components
═══════════════════════════════════════════════════════════════ */

const FeatureSectionHeader = () => {
    const [ref, visible] = useFadeIn()
    return (
        <div ref={ref} className={`fade-in-up ${visible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <p style={{
                fontSize: '0.6875rem', fontWeight: 700, color: '#4F46E5',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                fontFamily: "'Outfit', sans-serif", marginBottom: '0.75rem',
            }}>Platform Capabilities</p>
            <h2 style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
            }}>Everything You Need,<br/>Nothing You Don't</h2>
            <p style={{ fontSize: '1rem', color: '#6B7280', marginTop: '1rem', maxWidth: '550px', margin: '1rem auto 0', lineHeight: 1.6 }}>
                A complete academic operations suite designed for speed, clarity, and institutional scale.
            </p>
        </div>
    )
}

const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => {
    const [ref, visible] = useFadeIn(delay)
    return (
        <div
            ref={ref}
            className={`fade-in-up feature-card ${visible ? 'visible' : ''}`}
            style={{
                padding: '1.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
                '--glow-color': `${color}40`,
            }}
        >
            <div
                className="feature-icon"
                style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: `${color}15`,
                    border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                    transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <Icon size={20} color={color} strokeWidth={2} />
            </div>
            <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.0625rem', fontWeight: 700,
                letterSpacing: '-0.01em', marginBottom: '0.5rem',
            }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: 1.6 }}>{desc}</p>
        </div>
    )
}

const DashboardPreview = () => {
    const [ref, visible] = useFadeIn()
    return (
        <div ref={ref} className={`fade-in-up ${visible ? 'visible' : ''}`}>
            <p style={{
                fontSize: '0.6875rem', fontWeight: 700, color: '#06B6D4',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                fontFamily: "'Outfit', sans-serif", marginBottom: '0.75rem',
            }}>Interface Preview</p>
            <h2 style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem',
            }}>Designed for Clarity</h2>
            <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                Every pixel engineered for fast navigation, zero friction, and delightful daily use.
            </p>

            {/* Mock dashboard */}
            <div style={{
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                padding: '1.5rem',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Mock top bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                    <div style={{
                        marginLeft: 'auto',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        fontSize: '0.6875rem', color: '#6B7280',
                        fontFamily: "'Outfit', sans-serif",
                    }}>
                        eduportal.app/student
                    </div>
                </div>

                {/* Mock stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                    {[
                        { label: 'Attendance', value: '94%', color: '#10B981' },
                        { label: 'Avg. Score', value: '87%', color: '#4F46E5' },
                        { label: 'Assignments', value: '12/15', color: '#06B6D4' },
                    ].map(c => (
                        <div key={c.label} style={{
                            padding: '1rem',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <p style={{ fontSize: '0.625rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>{c.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: c.color, marginTop: '0.25rem', letterSpacing: '-0.03em' }}>{c.value}</p>
                        </div>
                    ))}
                </div>

                {/* Mock rows */}
                {[70, 55, 85].map((w, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem',
                        background: i === 0 ? 'rgba(79,70,229,0.06)' : 'transparent',
                        border: '1px solid rgba(255,255,255,0.03)',
                    }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(79,70,229,0.1)' }} />
                        <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', width: `${w}%` }} />
                        <div style={{ marginLeft: 'auto', height: '6px', width: '40px', borderRadius: '3px', background: i === 0 ? '#4F46E5' : 'rgba(255,255,255,0.04)' }} />
                    </div>
                ))}

                {/* Shimmer overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 4s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
            </div>
        </div>
    )
}

const TestimonialSectionHeader = () => {
    const [ref, visible] = useFadeIn()
    return (
        <div ref={ref} className={`fade-in-up ${visible ? 'visible' : ''}`} style={{ textAlign: 'center' }}>
            <p style={{
                fontSize: '0.6875rem', fontWeight: 700, color: '#F59E0B',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                fontFamily: "'Outfit', sans-serif", marginBottom: '0.75rem',
            }}>Trusted by Educators</p>
            <h2 style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800, letterSpacing: '-0.03em',
            }}>What People Are Saying</h2>
        </div>
    )
}

const TestimonialCard = ({ name, role, text, rating, delay }) => {
    const [ref, visible] = useFadeIn(delay)
    return (
        <div
            ref={ref}
            className={`fade-in-up ${visible ? 'visible' : ''}`}
            style={{
                padding: '1.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 300ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
            <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
            </div>
            <p style={{ fontSize: '0.9375rem', color: '#D1D5DB', lineHeight: 1.7, marginBottom: '1.5rem' }}>"{text}"</p>
            <div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.875rem' }}>{name}</p>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.125rem' }}>{role}</p>
            </div>
        </div>
    )
}

const CTASection = ({ navigate }) => {
    const [ref, visible] = useFadeIn()
    return (
        <div
            ref={ref}
            className={`fade-in-up ${visible ? 'visible' : ''}`}
            style={{
                maxWidth: '700px',
                margin: '0 auto',
                textAlign: 'center',
                padding: '4rem 2rem',
                borderRadius: '20px',
                border: '1px solid rgba(79,70,229,0.15)',
                background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(6,182,212,0.04) 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div style={{
                position: 'absolute', width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)',
                top: '-100px', right: '-100px', borderRadius: '50%', pointerEvents: 'none',
            }} />
            <Globe size={40} color="#4F46E5" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
            <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
            }}>Ready to Modernize Your Institution?</h2>
            <p style={{ fontSize: '1rem', color: '#9CA3AF', maxWidth: '450px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                Join hundreds of schools already using EduPortal to deliver world-class academic operations.
            </p>
            <button
                onClick={() => navigate('/register')}
                className="cta-glow"
                style={{
                    padding: '0.875rem 2.5rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
                    color: 'white',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    fontFamily: "'Outfit', sans-serif",
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 300ms',
                    position: 'relative',
                    zIndex: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            >
                Get Started Free <ChevronRight size={16} />
            </button>
        </div>
    )
}

export default LandingPage
