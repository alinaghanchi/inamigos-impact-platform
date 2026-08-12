'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  type Variants,
} from 'framer-motion';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  FileText,
  Globe2,
  HeartHandshake,
  Leaf,
  LineChart,
  Menu,
  MessageCircle,
  MoveUpRight,
  Network,
  PawPrint,
  Send,
  Sparkles,
  Sprout,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const projects = [
  {
    title: "Udaan",
    image: "/images/udaan.jpg",
    category: "Women Empowerment",
    description: "Women empowerment through skill development, financial independence and awareness.",
    impact: "3.8k women"
  },

  {
    title: "Bachpan Shala",
    image: "/images/bachpanshala.jpg",
    category: "Education",
    description: "Quality education and learning support for underprivileged children.",
    impact: "5k children"
  },

  {
    title: "Jeev",
    image: "/images/jeev.jpg",
    category: "Animal Welfare",
    description: "Rescue, care and feeding initiatives for animals in need.",
    impact: "1.5k animals"
  },

  {
    title: "Prakriti",
    image: "/images/prakriti.jpg",
    category: "Environment",
    description: "Environmental sustainability through plantation drives and conservation initiatives.",
    impact: "20k trees"
  },

  {
    title: "Vikas",
    image: "/images/vikas.jpg",
    category: "Youth & Careers",
    description: "Skill development and employability programs for youth.",
    impact: "250+ youth"
  }
];

const gallery = [
  {
    title: "Bachpan Shala",
    image: "/images/bachpanshala.jpg",
    label: "Education",
    tall: true,
  },
  {
    title: "Udaan",
    image: "/images/udaan.jpg",
    label: "Women Empowerment",
    tall: false,
  },
  {
    title: "Jeev",
    image: "/images/jeev.jpg",
    label: "Animal Welfare",
    tall: true,
  },
  {
    title: "Prakriti",
    image: "/images/prakriti.jpg",
    label: "Environment",
    tall: false,
  },
  {
    title: "Vikas",
    image: "/images/vikas.jpg",
    label: "Skill Development",
    tall: false,
  },
];
const impactData = [
  { name: 'Bachpanshala', value: 32 },
  { name: 'Vikas', value: 24 },
  { name: 'Prakriti', value: 18 },
  { name: 'Udaan', value: 15 },
  { name: 'Jeev', value: 11 },
];

const growthData = [
  { month: 'Jan', volunteers: 420 }, { month: 'Feb', volunteers: 560 }, { month: 'Mar', volunteers: 740 },
  { month: 'Apr', volunteers: 680 }, { month: 'May', volunteers: 920 }, { month: 'Jun', volunteers: 1120 },
  { month: 'Jul', volunteers: 1380 }, { month: 'Aug', volunteers: 1620 },
];

const radarData = [
  { metric: 'Reach', value: 88 },
  { metric: 'Efficiency', value: 92 },
  { metric: 'Retention', value: 78 },
  { metric: 'Growth', value: 85 },
  { metric: 'Impact', value: 90 },
];

const testimonials = [
  { quote: 'The platform helped me find a project where my design skills could create visible change. I came for a weekend and stayed for a year.', name: 'Ananya Mehta', role: 'Design volunteer · Vikas', initials: 'AM' },
  { quote: 'Bachpanshala gave my daughter the confidence to ask questions. The mentors see her potential before she can see it herself.', name: 'Sunita Verma', role: 'Parent · Bilaspur', initials: 'SV' },
  { quote: 'Data makes our work sharper. We now know where every hour and rupee can unlock the greatest impact for a community.', name: 'Rohan Singh', role: 'Program lead · InAmigos', initials: 'RS' },
];

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: (i: number = 0) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease, delay: i * 0.08 } }),
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const animate = (time: number) => {
      const progress = Math.min((time - start) / 1400, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function MagneticButton({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };
  const handleLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      className={`magnetic-btn ${primary ? 'btn-primary' : 'btn-ghost'}`}
    >
      {children}
    </motion.a>
  );
}

/* 3D tilt project card */
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {

  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 10);

    setGlow({
      x: px * 100,
      y: py * 100,
    });
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
    setGlow({ x: 50, y: 50 });
  };

  return (
    <Reveal delay={index % 3}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.03, z: 30 }}
        className="project-card glass-card"
      >
        <div
          className="spotlight"
          style={{
            background: `radial-gradient(
              400px circle at ${glow.x}% ${glow.y}%,
              rgba(45,212,191,0.15),
              transparent 40%
            )`,
          }}
        />

        <div className="project-image">
          <img src={project.image} alt={project.title} />
          <div className="project-image-overlay" />

          <span className="project-index">
            0{index + 1}
          </span>
        </div>

        <div className="project-content">
          <div className="project-meta">
            <span>{project.category}</span>
            <span className="status-dot" />
            <span>Active</span>
          </div>

          <h3>{project.title}</h3>

          <p>{project.description}</p>

          <div className="project-bottom">
            <strong>{project.impact}</strong>

            <span className="round-arrow">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [project, setProject] = useState("udaan");


  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
const [projectType, setProjectType] = useState('Women Empowerment (Udaan)');
  const [budget, setBudget] = useState('₹50k – ₹2L');
  const [volunteers, setVolunteers] = useState('10–25');
  const [urgency, setUrgency] = useState('This month');
  const [recGenerated, setRecGenerated] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [interest, setInterest] = useState('');

  /* loading */
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1600); return () => clearTimeout(t); }, []);

  /* mouse glow */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const glowX = useTransform(smx, (v) => `${v}px`);
  const glowY = useTransform(smy, (v) => `${v}px`);

  /* hero parallax */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const recommendation = useMemo(() => ({

  "Women Empowerment (Udaan)": {
    score: 94,
    resources: "Skill Development Kits, Entrepreneurship Workshops",
    volunteers: "20 Mentors",
    impact: "300+ Women Beneficiaries",
    action: "Conduct vocational training and self-employment support."
  },

  "Education (Bachpan Shala)": {
    score: 96,
    resources: "Teaching Kits, Books, Digital Learning Material",
    volunteers: "10 Mentors",
    impact: "500+ Children Reached",
    action: "Expand educational support and learning access."
  },

  "Animal Welfare (Jeev)": {
    score: 89,
    resources: "Animal Feed, Medical Kits, Shelter Support",
    volunteers: "15 Volunteers",
    impact: "1000+ Animals Supported",
    action: "Strengthen rescue and feeding programs."
  },

  "Environment (Prakriti)": {
    score: 91,
    resources: "Saplings, Gardening Tools, Awareness Material",
    volunteers: "25 Volunteers",
    impact: "2000+ Trees Planted",
    action: "Organize plantation and sustainability drives."
  },

  "Skill Development (Vikas)": {
    score: 92,
    resources: "Training Material, Career Guidance Kits",
    volunteers: "12 Trainers",
    impact: "250+ Youth Trained",
    action: "Launch employability and skill-building workshops."
  }

}[projectType]), [projectType]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mx.set(e.clientX - 200);
    my.set(e.clientY - 200);
  };
 const generateRecommendation = () => {
  setRecGenerated(true);
};

  return (
    <main onMouseMove={handleMouseMove} className="min-h-screen overflow-hidden bg-[#05080d] text-white selection:bg-[#2dd4bf] selection:text-[#051015]">
      <div className="noise" />
      <motion.div style={{ x: glowX, y: glowY }} className="mouse-glow" />

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <motion.div className="loader-ring" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="loader-text">INAMIGOS</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="nav-shell">
        <a href="#top" className="brand" aria-label="InAmigos Foundation home">
          <span className="brand-mark"><img src="/images/logo.png" alt="InAmigos Foundation logo" /></span>
          <span><strong>InAmigos</strong><small>FOUNDATION</small></span>
        </a>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#impact" onClick={() => setMenuOpen(false)}>Impact</a>
          <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="#intelligence" onClick={() => setMenuOpen(false)}>Intelligence</a>
          <a href="#volunteer" onClick={() => setMenuOpen(false)}>Volunteer</a>
        </div>
        <div className="nav-actions">
          <a href="#contact" className="nav-contact">Get involved <ArrowUpRight size={15} /></a>
          <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>

      {/* Hero */}
      <section id="top" ref={heroRef} className="hero-shell section-pad">
        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="hero-glow glow-cyan" />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="hero-glow glow-emerald" />
        <Particles />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="hero-copy">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="eyebrow"><Sparkles size={14} strokeWidth={2.5} /> <span>The operating system for social impact</span></motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}>
            Turn good intentions<br /><span>into measurable change.</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2} className="hero-description">InAmigos unites people, programs and data to move communities forward — faster, further and with more intention.</motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="hero-actions">
            <MagneticButton href="#projects" primary>Explore projects <ArrowUpRight size={17} /></MagneticButton>
            <MagneticButton href="#volunteer">Become a volunteer <ChevronRight size={17} /></MagneticButton>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="hero-trust">
            <div className="avatar-stack"><span>AM</span><span>RS</span><span>SV</span><span>+2k</span></div>
            <p><strong>2,000+ changemakers</strong><br /><span>are building better futures</span></p>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="hero-visual">
          <motion.div className="hero-image-wrap" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease, delay: 0.3 }}>
            <img
  src="/images/hero.jpg"
  alt="InAmigos volunteers and children creating change together"
/>
            <div className="image-shade" />
          </motion.div>
          <motion.div className="floating-card impact-float" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease, delay: 0.6 }}>
            <span className="mini-label"><span className="live-dot" /> LIVE IMPACT</span><strong>+24.8%</strong><small>communities reached this year</small><div className="spark-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </motion.div>
          <motion.div className="floating-card location-float" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease, delay: 0.8 }}>
            <Globe2 size={18} /><div><strong>Bilaspur, IN</strong><small>Operating across 7 states</small></div>
          </motion.div>
          <motion.div className="floating-card orbit-float" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <Target size={18} /><span>1 goal<br /><strong>∞ possibilities</strong></span>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="scroll-hint"><span>SCROLL TO EXPLORE</span><i /></motion.div>
      </section>

      {/* Impact counters */}
      <section id="impact" className="stats-section section-pad">
        <Reveal><div className="section-heading"><div><div className="eyebrow"><BarChart3 size={14} strokeWidth={2.5} /> <span>The numbers behind the movement</span></div><h2>Impact, in <em>motion.</em></h2></div><p>Every number represents a person, a story and a future with more possibility.</p></div></Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="stats-grid">
          {[[50000, '+', 'Lives impacted', 'Across education, care & community'], [30000, '+', 'Interns trained', 'Skills for a stronger tomorrow'], [2000, '+', 'Active volunteers', 'One network, many ways to help'], [20000, '+', 'Trees planted', 'Restoring our shared home'], [50, '+', 'Animals fed daily', 'Compassion in action'], [6, '', 'Flagship projects', 'Built for lasting change']].map(([value, suffix, label, sub]) => (
            <motion.div variants={fadeUp} className="stat-item" key={label as string}>
              <strong><CountUp value={value as number} suffix={suffix as string} /></strong>
              <span>{label as string}</span>
              <small>{sub as string}</small>
            </motion.div>
          ))}
        </motion.div>
        <Reveal delay={0.2} className="foundation-note">
          <div><span className="card-kicker">The foundation</span><strong>Founded 23 September 2020 by Govind Shukla.</strong></div>
          <div className="cert-list"><span>Section 8 NGO</span><span>CSR-1</span><span>NITI Aayog</span><span>80G</span><span>12A</span><span>ISO 9001:2015</span></div>
        </Reveal>
      </section>

      {/* Projects bento */}
      <section id="projects" className="projects-section section-pad">
        <Reveal><div className="section-heading"><div><div className="eyebrow"><Network size={14} strokeWidth={2.5} /> <span>Programs with a pulse</span></div><h2>Six ways to move<br /><em>the needle.</em></h2></div><a className="text-link" href="#contact">View all programs <ArrowUpRight size={16} /></a></div></Reveal>
        <div className="projects-grid">{projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}</div>
      </section>

      {/* Command Center */}
      <section id="intelligence" className="command-section section-pad">
        <Reveal><div className="section-heading"><div><div className="eyebrow"><Zap size={14} strokeWidth={2.5} /> <span>One view. Every signal.</span></div><h2>Your impact<br /><em>command center.</em></h2></div><p>See what is happening across your network and make the next move with confidence.</p></div></Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="command-grid">
          <motion.div variants={fadeUp} className="command-main glass-card">
            <div className="card-topline"><div><span className="card-kicker">Impact overview</span><h3>Network health</h3></div><span className="date-pill">Last 30 days <ChevronRight size={13} /></span></div>
            <div className="health-score"><div className="score-ring"><span>86</span><small>/100</small></div><div><strong>Strong momentum</strong><p>Up 12.6% from last month</p><div className="progress-line"><i /></div></div></div>
            <div className="mini-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={growthData}><defs><linearGradient id="impactFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.45} /><stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="volunteers" stroke="#2dd4bf" strokeWidth={2} fill="url(#impactFill)" /><Tooltip contentStyle={{ background: '#111923', border: '1px solid #2a3747', borderRadius: 8, color: '#fff' }} /></AreaChart></ResponsiveContainer></div>
            <div className="chart-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div>
          </motion.div>

          <motion.div variants={fadeUp} className="command-tile reach-tile glass-card">
            <div className="tile-icon green-icon"><Globe2 size={19} /></div>
            <span className="card-kicker">Community reach</span><strong>18,492</strong><p>people reached this quarter</p><span className="trend"><MoveUpRight size={13} /> 18.4%</span>
            <div className="tiny-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </motion.div>

          <motion.div variants={fadeUp} className="command-tile glass-card project-health">
            <div className="tile-head"><span className="card-kicker">Project performance</span><span className="dots">•••</span></div>
            <div className="health-list"><div><span className="health-dot green" /> Bachpanshala <b>92%</b></div><div><span className="health-dot orange" /> Jeev <b>87%</b></div><div><span className="health-dot blue" /> Udaan <b>81%</b></div><div><span className="health-dot yellow" /> Prakriti <b>78%</b></div></div>
          </motion.div>

          <motion.div variants={fadeUp} className="command-tile glass-card campaign-tile">
            <span className="card-kicker">Campaign success</span><h3>Winter of Warmth</h3><p>Clothing & essentials for 500 families</p>
            <div className="campaign-progress"><div><span>₹1.42L raised</span><span>71%</span></div><div className="progress-track"><i /></div></div>
            <button className="tile-button">Open campaign <ArrowUpRight size={14} /></button>
          </motion.div>

          <motion.div variants={fadeUp} className="command-tile glass-card activity-tile">
            <div className="tile-head"><span className="card-kicker">Resource utilization</span><span className="live-pill"><span className="live-dot" /> Live</span></div>
            <div className="radar-wrap"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData}><PolarGrid stroke="#1c2835" /><PolarAngleAxis dataKey="metric" tick={{ fill: '#667589', fontSize: 9 }} /><Radar dataKey="value" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.25} strokeWidth={2} /></RadarChart></ResponsiveContainer></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Resource Recommendation Engine */}
      <section className="engine-section section-pad">
        <div className="engine-orb" />
        <Reveal className="engine-copy">
          <div className="eyebrow"><BrainCircuit size={14} strokeWidth={2.5} /> <span>Powered by collective intelligence</span></div>
          <h2>Meet your new<br /><em>impact co-pilot.</em></h2>
          <p>The NGO Resource Recommendation Engine turns a project brief into a practical plan — the right people, materials and next best action.</p>
          <div className="engine-points"><span><Check size={15} /> Faster project planning</span><span><Check size={15} /> Better resource allocation</span><span><Check size={15} /> More measurable outcomes</span></div>
        </Reveal>

        <Reveal delay={0.15} className="recommendation-card glass-card">

  <div className="recommendation-header">
    <div>
      <span className="card-kicker">Resource Intelligence</span>
      <h3>Build a Recommendation</h3>
    </div>

    <span className="ai-badge">
      <Sparkles size={13} />
      AI-assisted
    </span>
  </div>

  {/* Project */}
  <label>
    Project
    <select
  value={projectType}
  onChange={(e) => {
    setProjectType(e.target.value);
    setRecGenerated(false);
  }}
>
  <option>Women Empowerment (Udaan)</option>
  <option>Education (Bachpan Shala)</option>
  <option>Animal Welfare (Jeev)</option>
  <option>Environment (Prakriti)</option>
  <option>Skill Development (Vikas)</option>
</select>
  </label>

  <div className="input-row">

    {/* Budget */}
    <label>
      Available Budget
      <select
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      >
        <option>Under ₹50,000</option>
        <option>₹50,000 – ₹2,00,000</option>
        <option>₹2,00,000 – ₹5,00,000</option>
        <option>Above ₹5,00,000</option>
      </select>
    </label>

    {/* Volunteers */}
    <label>
      Volunteers Available
      <select
        value={volunteers}
        onChange={(e) => setVolunteers(e.target.value)}
      >
        <option>1 – 10 Volunteers</option>
        <option>10 – 25 Volunteers</option>
        <option>25 – 50 Volunteers</option>
        <option>50+ Volunteers</option>
      </select>
    </label>

  </div>

  {/* Priority */}
  <label>
    Priority Level
    <select
      value={urgency}
      onChange={(e) => setUrgency(e.target.value)}
    >
      <option>High Priority</option>
      <option>Medium Priority</option>
      <option>Low Priority</option>
    </select>
  </label>

  <AnimatePresence mode="wait">
    {recGenerated && recommendation && (
  <div className="recommendation-result">
    <h3>AI Recommendation Result</h3>

    <p><strong>Priority Score:</strong> {recommendation.score}/100</p>

    <p><strong>Suggested Resources:</strong> {recommendation.resources}</p>

    <p><strong>Volunteers Needed:</strong> {recommendation.volunteers}</p>

    <p><strong>Expected Impact:</strong> {recommendation.impact}</p>

    <p><strong>Recommended Action:</strong> {recommendation.action}</p>
  </div>
)}
  </AnimatePresence>

 <motion.button
  whileTap={{ scale: 0.97 }}
  className="btn-primary full-button"
  onClick={() => setRecGenerated(true)}
>
  ✨ Generate Recommendation
</motion.button>

</Reveal>
      </section>

      {/* Analytics */}
      <section className="analytics-section section-pad">
        <Reveal><div className="section-heading"><div><div className="eyebrow"><LineChart size={14} strokeWidth={2.5} /> <span>The signal behind the story</span></div><h2>Decisions made<br /><em>with clarity.</em></h2></div><div className="analytics-tabs"><button className="active">Overview</button><button>Projects</button><button>Volunteers</button></div></div></Reveal>
        <Reveal className="analytics-panel glass-card">
          <div className="analytics-stat-row">
            <div><span>Total impact score</span><strong>8.7 <small>/ 10</small></strong><em><MoveUpRight size={13} /> 14.2%</em></div>
            <div><span>Volunteer retention</span><strong>78.4%</strong><em><MoveUpRight size={13} /> 8.6%</em></div>
            <div><span>Resource efficiency</span><strong>92%</strong><em><MoveUpRight size={13} /> 11.8%</em></div>
          </div>
          <div className="analytics-charts">
            <div className="chart-block"><div className="chart-block-head"><span>Volunteer growth</span><small>Jan — Aug 2024</small></div><ResponsiveContainer width="100%" height={220}><AreaChart data={growthData}><CartesianGrid stroke="#1c2835" vertical={false} /><XAxis dataKey="month" stroke="#667589" tickLine={false} axisLine={false} /><YAxis stroke="#667589" tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} /><Tooltip contentStyle={{ background: '#111923', border: '1px solid #2a3747', borderRadius: 8 }} /><Area type="monotone" dataKey="volunteers" stroke="#2dd4bf" strokeWidth={2.5} fill="none" /></AreaChart></ResponsiveContainer></div>
            <div className="chart-block distribution"><div className="chart-block-head"><span>Impact by project</span><small>Share of total</small></div><div className="donut-wrap"><ResponsiveContainer width="55%" height={190}><PieChart><Pie data={impactData} dataKey="value" innerRadius={52} outerRadius={75} paddingAngle={4} stroke="none"><Cell fill="#2dd4bf" /><Cell fill="#54b4ec" /><Cell fill="#6cc783" /><Cell fill="#f18dba" /><Cell fill="#edbd60" /></Pie></PieChart></ResponsiveContainer><div className="donut-center"><strong>100%</strong><span>tracked</span></div><div className="legend">{impactData.map((item, index) => <span key={item.name}><i style={{ background: ['#2dd4bf', '#54b4ec', '#6cc783', '#f18dba', '#edbd60'][index] }} />{item.name}<b>{item.value}%</b></span>)}</div></div></div>
          </div>
        </Reveal>
      </section>

  

      {/* Volunteer journey */}
      <section id="volunteer" className="volunteer-section section-pad">
        <Reveal><div className="volunteer-top"><div><div className="eyebrow"><HeartHandshake size={14} strokeWidth={2.5} /> <span>Your time, amplified</span></div><h2>There is a place<br />for <em>your kind of good.</em></h2></div><div><p>Whether you have two hours or two decades, your skills can become momentum for someone else.</p><MagneticButton href="#contact" primary>Start your journey <ArrowUpRight size={17} /></MagneticButton></div></div></Reveal>
        <div className="timeline">
          {[['01', 'Register', 'Tell us what moves you.', FileText], ['02', 'Train', 'Get context, tools & support.', BookOpen], ['03', 'Participate', 'Show up with your strengths.', Users], ['04', 'Create impact', 'See the change you helped make.', Sparkles]].map(([num, title, desc, Icon], index) => {
            const I = Icon as typeof FileText;
            return (
              <Reveal key={title as string} delay={index * 0.1} className="timeline-item">
                <span className="timeline-number">{num as string}</span>
                <div className="timeline-line" />
                <motion.div className="timeline-icon" whileHover={{ scale: 1.15, borderColor: '#2dd4bf' }}><I size={18} /></motion.div>
                <h3>{title as string}</h3><p>{desc as string}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section section-pad">
        <Reveal><div className="section-heading"><div><div className="eyebrow"><MessageCircle size={14} strokeWidth={2.5} /> <span>Field notes</span></div><h2>Small moments.<br /><em>Real momentum.</em></h2></div><p>Snapshots from a network that believes change is built together, one day at a time.</p></div></Reveal>
        <div className="gallery-grid">{gallery.map((item, index) => (
          <Reveal key={`${item.label}-${index}`} delay={index * 0.06} className={`gallery-item ${item.tall ? 'tall' : ''}`}>
            <img src={item.image} alt={item.label} />
            <div className="gallery-gradient" />
            <span>{item.label}</span>
          </Reveal>
        ))}</div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section section-pad">
        <Reveal><div className="section-heading"><div><div className="eyebrow"><MessageCircle size={14} strokeWidth={2.5} /> <span>From the network</span></div><h2>Good work is<br /><em>better together.</em></h2></div></div></Reveal>
        <div className="testimonials-grid">{testimonials.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.1} className="testimonial-card glass-card">
            <div className="quote-mark">&ldquo;</div><p>{item.quote}</p>
            <div className="testimonial-person"><span>{item.initials}</span><div><strong>{item.name}</strong><small>{item.role}</small></div></div>
          </Reveal>
        ))}</div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section section-pad">
        <Reveal className="contact-panel">
          <div className="contact-copy">
            <div className="eyebrow"><Send size={14} strokeWidth={2.5} /> <span>Let&rsquo;s build what&rsquo;s next</span></div>
            <h2>Bring your<br /><em>energy.</em></h2>
            <p>Volunteer, partner, fund, or simply start a conversation. The next chapter can start here.</p>
            <div className="contact-details"><span><Globe2 size={16} /> Bilaspur, Chhattisgarh · India</span><span><Clock3 size={16} /> Mon–Sat · 10:00 — 18:00 IST</span></div>
          </div>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}>
            <AnimatePresence mode="wait">
              {contactSent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="form-success">
                  <span><Check size={22} /></span><h3>Message received.</h3><p>Thank you for reaching out. Our team will be in touch soon.</p>
                  <button type="button" className="btn-ghost" onClick={() => setContactSent(false)}>Send another message</button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="form-inner">
                  <div className="form-row"><label>Your name<input required placeholder="e.g. Priya Sharma" /></label><label>Email address<input required type="email" placeholder="you@example.com" /></label></div>
                  <div className="form-row"><label>Phone number<input placeholder="+91 00000 00000" /></label><label>I&rsquo;m interested in<select value={interest} onChange={(e) => setInterest(e.target.value)}><option value="">Choose an option</option><option>Volunteering</option><option>Partnerships</option><option>CSR support</option><option>Donating</option></select></label></div>
                  <label>Your message<textarea required rows={4} placeholder="Tell us what you have in mind..." /></label>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary">Send message <Send size={16} /></motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="footer-shell">
        <div className="footer-main">
          <div className="brand footer-brand"><span className="brand-mark"><img src="/images/logo.png" alt="" /></span><span><strong>InAmigos</strong><small>FOUNDATION</small></span></div>
          <p>Uniting minds for change.<br />A more equitable future, built together.</p>
          <div className="footer-links"><div><span>Explore</span><a href="#impact">Our impact</a><a href="#projects">Projects</a><a href="#intelligence">Intelligence</a></div><div><span>Connect</span><a href="#volunteer">Volunteer</a><a href="#contact">Partner with us</a><a href="#contact">Contact</a></div><div><span>Follow along</span><a href="#top">Instagram <ArrowUpRight size={13} /></a><a href="#top">LinkedIn <ArrowUpRight size={13} /></a><a href="#top">X / Twitter <ArrowUpRight size={13} /></a></div></div>
        </div>
        <div className="footer-bottom"><span>© 2024 InAmigos Foundation</span><span>Section 8 Registered NGO · Bilaspur, India</span><span>Built for impact <HeartHandshake size={13} /></span></div>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Particles                                                          */
/* ------------------------------------------------------------------ */

function Particles() {
  const dots = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 13) % 100,
  y: (i * 17) % 100,
  s: (i % 3) + 1,
  d: (i % 4) + 3,
  delay: i * 0.2,
})); [];
  return (
    <div className="particles">
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className="particle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
