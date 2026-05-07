import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Package, Bell, Users, Target, Settings,
  LayoutDashboard, ArrowRight, ChevronDown, Heart,
  Shield, Zap, Globe, Phone, Mail
} from 'lucide-react';

/* ─── animated counter ─── */
function Counter({ end, duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setVal(Math.floor(p * end));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}

/* ─── floating particle ─── */
function Particle({ style }) {
  return <div className="novaid-particle" style={style} />;
}

const NAV_PAGES = [
  { key: 'dashboard',  to: '/dashboard',  label: 'Tableau de bord', icon: LayoutDashboard, color: '#4d7cfe', desc: 'Vue d\'ensemble & statistiques' },
  { key: 'alerts',     to: '/alerts',     label: 'Alertes',          icon: Bell,            color: '#ff4d6a', desc: 'Familles en situation critique' },
  { key: 'map',        to: '/map',        label: 'Carte',            icon: Globe,           color: '#2dd4bf', desc: 'Géolocalisation des familles' },
  { key: 'inventory',  to: '/inventory',  label: 'Stocks',           icon: Package,         color: '#ffb020', desc: 'Gestion de l\'inventaire' },
  { key: 'users',      to: '/users',      label: 'Utilisateurs',     icon: Users,           color: '#a78bfa', desc: 'Créer & gérer les bénévoles' },
  { key: 'missions',   to: '/missions',   label: 'Mes Missions',     icon: Target,          color: '#00e5a0', desc: 'Missions de terrain assignées' },
  { key: 'settings',   to: '/settings',   label: 'Paramètres',       icon: Settings,        color: '#8892a8', desc: 'Préférences d\'affichage' },
];

const FEATURES = [
  { icon: MapPin,  color: '#4d7cfe', title: 'Géolocalisation précise',  body: 'Visualisez la répartition des familles sur une carte interactive avec heatmap et marqueurs d\'urgence.' },
  { icon: Bell,    color: '#ff4d6a', title: 'Alertes en temps réel',    body: 'Recevez immédiatement les alertes pour les familles en situation critique ou les stocks à recompléter.' },
  { icon: Package, color: '#ffb020', title: 'Gestion des stocks',       body: 'Suivez les inventaires alimentaires, médicaux et vestimentaires avec des indicateurs visuels clairs.' },
  { icon: Target,  color: '#00e5a0', title: 'Missions optimisées',      body: 'Proposez des missions proches du bénévole pour maximiser l\'impact et réduire les déplacements inutiles.' },
  { icon: Shield,  color: '#a78bfa', title: 'Sécurité & Rôles',        body: 'Contrôle d\'accès par rôle — Bénévole, Coordinateur, Administrateur — avec validation GPS sur le terrain.' },
  { icon: Zap,     color: '#2dd4bf', title: 'Histoires d\'impact',      body: 'Génération automatique de rapports narratifs pour chaque famille grâce à Omnia, l\'IA embarquée.' },
];

export default function Home({ toggleTheme, isDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    width:  `${4 + Math.random() * 8}px`,
    height: `${4 + Math.random() * 8}px`,
    left:   `${Math.random() * 100}%`,
    top:    `${Math.random() * 100}%`,
    animationDelay:    `${Math.random() * 6}s`,
    animationDuration: `${6 + Math.random() * 8}s`,
    opacity: 0.08 + Math.random() * 0.14,
    background: ['#4d7cfe','#00e5a0','#ff4d6a','#ffb020','#a78bfa'][i % 5],
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .novaid-home { font-family:'DM Sans',sans-serif; background:#07090f; color:#eef0f8; min-height:100vh; overflow-x:hidden; }

        /* NAV */
        .novaid-nav {
          position:fixed; top:0; left:0; right:0; z-index:200;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 40px; height:64px;
          transition:all .35s ease;
        }
        .novaid-nav.scrolled {
          background:rgba(7,9,15,.88); backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(255,255,255,.06);
        }
        .novaid-nav-logo { font-family:'Syne',sans-serif; font-weight:900; font-size:20px; color:#fff; display:flex; align-items:center; gap:10px; text-decoration:none; }
        .novaid-nav-dot { width:8px; height:8px; border-radius:50%; background:#4d7cfe; box-shadow:0 0 14px #4d7cfe; animation:glow 2.5s infinite; }
        @keyframes glow { 0%,100%{box-shadow:0 0 10px #4d7cfe,0 0 22px rgba(77,124,254,.45)} 50%{box-shadow:0 0 16px #4d7cfe,0 0 35px rgba(77,124,254,.25)} }
        .novaid-nav-right { display:flex; align-items:center; gap:12px; }
        .novaid-nav-login { padding:8px 20px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:transparent; color:#c8cdd8; font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; text-decoration:none; }
        .novaid-nav-login:hover { border-color:rgba(77,124,254,.6); color:#fff; }
        .novaid-nav-cta { padding:9px 22px; border-radius:10px; background:#4d7cfe; color:#fff; font-size:13px; font-weight:600; cursor:pointer; border:none; text-decoration:none; box-shadow:0 0 20px rgba(77,124,254,.35); transition:all .2s; }
        .novaid-nav-cta:hover { filter:brightness(1.12); transform:translateY(-1px); }

        /* HERO */
        .novaid-hero {
          min-height:100vh; display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
          background:radial-gradient(ellipse 90% 70% at 50% 0%, rgba(77,124,254,.12) 0%, transparent 70%);
        }
        .novaid-hero-grid {
          position:absolute; inset:0; opacity:.035;
          background-image:linear-gradient(rgba(77,124,254,1) 1px,transparent 1px),linear-gradient(90deg,rgba(77,124,254,1) 1px,transparent 1px);
          background-size:60px 60px;
        }
        .novaid-hero-glow1 { position:absolute; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(77,124,254,.18) 0%,transparent 70%); top:-160px; left:-100px; animation:driftA 14s ease-in-out infinite; pointer-events:none; }
        .novaid-hero-glow2 { position:absolute; width:480px; height:480px; border-radius:50%; background:radial-gradient(circle,rgba(0,229,160,.12) 0%,transparent 70%); bottom:-120px; right:-60px; animation:driftB 18s ease-in-out infinite; pointer-events:none; }
        @keyframes driftA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
        @keyframes driftB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-20px)} }

        .novaid-particle { position:absolute; border-radius:50%; animation:float linear infinite; }
        @keyframes float { 0%{transform:translateY(0) rotate(0deg); opacity:.12} 50%{opacity:.2} 100%{transform:translateY(-80px) rotate(360deg); opacity:0} }

        .novaid-hero-content { position:relative; z-index:10; text-align:center; max-width:780px; padding:0 24px; }
        .novaid-hero-badge { display:inline-flex; align-items:center; gap:8px; padding:7px 18px; border-radius:40px; border:1px solid rgba(77,124,254,.35); background:rgba(77,124,254,.08); font-size:12px; font-weight:600; color:#4d7cfe; letter-spacing:.07em; text-transform:uppercase; margin-bottom:32px; animation:fadeUp .6s ease both; }
        .novaid-hero-badge-dot { width:6px; height:6px; border-radius:50%; background:#4d7cfe; animation:glow 2s infinite; }
        .novaid-hero-title { font-family:'Syne',sans-serif; font-size:clamp(48px,8vw,88px); font-weight:900; line-height:1.0; color:#fff; margin:0 0 24px; animation:fadeUp .7s .1s ease both; }
        .novaid-hero-title span { background:linear-gradient(135deg,#4d7cfe 0%,#00e5a0 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .novaid-hero-sub { font-size:18px; color:#8892a8; line-height:1.7; max-width:560px; margin:0 auto 44px; animation:fadeUp .7s .2s ease both; }
        .novaid-hero-actions { display:flex; align-items:center; justify-content:center; gap:14px; flex-wrap:wrap; animation:fadeUp .7s .3s ease both; }
        .novaid-btn-primary { display:inline-flex; align-items:center; gap:8px; padding:14px 32px; border-radius:12px; background:#4d7cfe; color:#fff; font-size:15px; font-weight:600; text-decoration:none; border:none; cursor:pointer; box-shadow:0 0 32px rgba(77,124,254,.4); transition:all .2s; }
        .novaid-btn-primary:hover { filter:brightness(1.12); transform:translateY(-2px); box-shadow:0 8px 36px rgba(77,124,254,.5); }
        .novaid-btn-outline { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:12px; background:transparent; color:#c8cdd8; font-size:15px; font-weight:500; text-decoration:none; border:1px solid rgba(255,255,255,.12); cursor:pointer; transition:all .2s; }
        .novaid-btn-outline:hover { border-color:rgba(255,255,255,.3); color:#fff; background:rgba(255,255,255,.04); }

        .novaid-scroll-hint { position:absolute; bottom:36px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; color:#3d4560; font-size:12px; letter-spacing:.08em; animation:fadeIn 1.2s .8s ease both; }
        .novaid-scroll-arrow { animation:bounce 2s infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }

        /* STATS */
        .novaid-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1px; background:rgba(255,255,255,.06); border-top:1px solid rgba(255,255,255,.06); border-bottom:1px solid rgba(255,255,255,.06); }
        .novaid-stat { background:#07090f; padding:40px 24px; text-align:center; }
        .novaid-stat-val { font-family:'Syne',sans-serif; font-size:48px; font-weight:900; color:#fff; line-height:1; }
        .novaid-stat-plus { color:#4d7cfe; }
        .novaid-stat-label { font-size:13px; color:#3d4560; margin-top:8px; font-weight:500; }

        /* PAGES GRID */
        .novaid-section { padding:100px 40px; max-width:1200px; margin:0 auto; }
        .novaid-section-label { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#3d4560; margin-bottom:16px; }
        .novaid-section-label::before { content:''; display:block; width:24px; height:1px; background:#3d4560; }
        .novaid-section-title { font-family:'Syne',sans-serif; font-size:clamp(32px,4vw,48px); font-weight:800; color:#fff; margin:0 0 14px; }
        .novaid-section-sub { font-size:16px; color:#8892a8; max-width:500px; line-height:1.7; }

        .novaid-pages-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; margin-top:56px; }
        .novaid-page-card {
          position:relative; padding:28px; border-radius:16px;
          border:1px solid rgba(255,255,255,.06); background:#0e1220;
          text-decoration:none; color:inherit; overflow:hidden;
          transition:all .25s ease; cursor:pointer;
          display:flex; flex-direction:column; gap:16px;
        }
        .novaid-page-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:var(--card-color); opacity:0; transition:opacity .25s;
        }
        .novaid-page-card:hover { transform:translateY(-4px); border-color:rgba(255,255,255,.12); background:#141929; }
        .novaid-page-card:hover::before { opacity:1; }
        .novaid-page-card-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:var(--card-soft); color:var(--card-color); transition:transform .25s; }
        .novaid-page-card:hover .novaid-page-card-icon { transform:scale(1.1) rotate(-4deg); }
        .novaid-page-card-name { font-family:'Syne',sans-serif; font-weight:700; font-size:17px; color:#fff; }
        .novaid-page-card-desc { font-size:13px; color:#8892a8; line-height:1.6; flex:1; }
        .novaid-page-card-arrow { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:var(--card-color); opacity:0; transform:translateX(-8px); transition:all .2s; }
        .novaid-page-card:hover .novaid-page-card-arrow { opacity:1; transform:translateX(0); }

        /* FEATURES */
        .novaid-features-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; margin-top:56px; }
        .novaid-feature { padding:32px; border-radius:16px; border:1px solid rgba(255,255,255,.06); background:#0e1220; transition:all .25s; }
        .novaid-feature:hover { border-color:rgba(255,255,255,.1); transform:translateY(-3px); }
        .novaid-feature-icon { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
        .novaid-feature-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#fff; margin-bottom:10px; }
        .novaid-feature-body { font-size:14px; color:#8892a8; line-height:1.7; }

        /* CONTACT US */
        .novaid-contact { padding:100px 40px; border-top:1px solid rgba(255,255,255,.06); max-width:800px; margin:0 auto; text-align:center; }
        .novaid-contact-form { background:#0e1220; border:1px solid rgba(255,255,255,.06); padding:40px; border-radius:16px; display:flex; flex-direction:column; gap:20px; text-align:left; margin-top:40px; }
        .novaid-contact-input, .novaid-contact-textarea { width:100%; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); color:#eef0f8; padding:14px 18px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:15px; transition:all .2s; }
        .novaid-contact-textarea { resize:vertical; min-height:120px; }
        .novaid-contact-input:focus, .novaid-contact-textarea:focus { outline:none; border-color:#4d7cfe; background:rgba(77,124,254,.05); box-shadow:0 0 0 4px rgba(77,124,254,.15); }

        /* FOOTER PRO */
        .novaid-footer { position:relative; padding:80px 40px 40px; background:#07090f; display:flex; flex-direction:column; align-items:center; gap:60px; border-top:1px solid rgba(255,255,255,.06); }
        .novaid-footer-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:50px; width:100%; max-width:1000px; margin:0 auto; }
        .novaid-footer-col { display:flex; flex-direction:column; gap:16px; }
        .novaid-footer-col h4 { font-family:'Syne',sans-serif; font-size:16px; color:#fff; margin:0; display:flex; align-items:center; gap:10px; }
        .novaid-footer-col p { font-size:14px; color:#8892a8; margin:0; line-height:1.7; display:flex; align-items:center; gap:8px; }
        .novaid-footer-bottom { border-top:1px solid rgba(255,255,255,.06); width:100%; max-width:1200px; padding-top:24px; display:flex; justify-content:center; align-items:center; }
        .novaid-footer-text { font-size:14px; color:#64748b; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        @media(max-width:992px) {
          .novaid-contact-form { padding:30px 20px; }
        }
        @media(max-width:640px) {
          .novaid-section,.novaid-contact { padding:60px 20px; }
          .novaid-nav { padding:0 20px; }
          .novaid-footer { padding:60px 20px 30px; gap:40px; }
        }
      `}</style>

      <div className="novaid-home">

        {/* ── NAV ── */}
        <nav className={`novaid-nav${scrolled ? ' scrolled' : ''}`}>
          <Link to="/" className="novaid-nav-logo">
            <span className="novaid-nav-dot" />
            NOVAID
          </Link>
          <div className="novaid-nav-right">
            <Link to="/login" className="novaid-nav-cta">Se connecter</Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="novaid-hero">
          <div className="novaid-hero-grid" />
          <div className="novaid-hero-glow1" />
          <div className="novaid-hero-glow2" />
          {particles.map((p, i) => <Particle key={i} style={p} />)}

          <div className="novaid-hero-content">
            <div className="novaid-hero-badge">
              <span className="novaid-hero-badge-dot" />
              Plateforme de gestion humanitaire
            </div>
            <h1 className="novaid-hero-title">
              Aidez mieux,<br /><span>coordinez plus.</span>
            </h1>
            <p className="novaid-hero-sub">
              NOVAID centralise le suivi des familles vulnérables, la gestion des stocks
              et la coordination des bénévoles sur le terrain — en temps réel.
            </p>
            <div className="novaid-hero-actions">
            </div>
          </div>

          <div className="novaid-scroll-hint">
            <span>Découvrir</span>
            <div className="novaid-scroll-arrow"><ChevronDown size={18} /></div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="novaid-stats">
          {[
            { end: 1240, suffix: '+', label: 'Familles suivies' },
            { end: 380,  suffix: '+', label: 'Bénévoles actifs' },
            { end: 5800, suffix: '+', label: 'Visites réalisées' },
            { end: 97,   suffix: '%', label: 'Taux de satisfaction' },
          ].map((s, i) => (
            <div key={i} className="novaid-stat">
              <div className="novaid-stat-val">
                <Counter end={s.end} duration={1600} />
                <span className="novaid-stat-plus">{s.suffix}</span>
              </div>
              <div className="novaid-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── PAGES ACCESS ── */}
        <section className="novaid-section">
          <div className="novaid-section-label">Navigation</div>
          <h2 className="novaid-section-title">Toutes les sections</h2>
          <p className="novaid-section-sub">
            Accédez directement à chaque module de la plateforme depuis cette page.
          </p>

          <div className="novaid-pages-grid">
            {NAV_PAGES.map((page) => {
              const Icon = page.icon;
              return (
                <div
                  key={page.key}
                  className="novaid-page-card"
                  style={{ '--card-color': page.color, '--card-soft': `${page.color}18`, cursor: 'default' }}
                  onMouseEnter={() => setHoveredCard(page.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="novaid-page-card-icon">
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="novaid-page-card-name">{page.label}</div>
                    <div className="novaid-page-card-desc">{page.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="novaid-section" style={{ paddingTop: 0 }}>
          <div className="novaid-section-label">Fonctionnalités</div>
          <h2 className="novaid-section-title">Tout ce dont vous avez besoin</h2>
          <p className="novaid-section-sub">
            Une boîte à outils complète pour les associations humanitaires, du terrain à la coordination.
          </p>

          <div className="novaid-features-grid">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="novaid-feature">
                  <div className="novaid-feature-icon" style={{ background: `${f.color}18`, color: f.color }}>
                    <Icon size={26} />
                  </div>
                  <div className="novaid-feature-title">{f.title}</div>
                  <div className="novaid-feature-body">{f.body}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CONTACT US ── */}
        <section className="novaid-contact" id="contact">
          <div className="novaid-section-label" style={{ margin: '0 auto 16px' }}>Contact</div>
          <h2 className="novaid-section-title">Contactez-nous</h2>
          <p className="novaid-section-sub" style={{ margin: '0 auto' }}>
            Vous avez des questions ou vous souhaitez en savoir plus sur notre plateforme ?
            Envoyez-nous un message, notre équipe vous répondra rapidement.
          </p>

          <div className="novaid-contact-form">
            <input type="text" className="novaid-contact-input" placeholder="Votre nom complet" />
            <input type="email" className="novaid-contact-input" placeholder="Votre adresse e-mail" />
            <textarea className="novaid-contact-textarea" placeholder="Comment pouvons-nous vous aider ?"></textarea>
            <button type="button" className="novaid-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Envoyer le message <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* ── FOOTER PRO ── */}
        <footer className="novaid-footer">
          <div className="novaid-footer-grid">
            <div className="novaid-footer-col">
              <h4><MapPin size={18} color="#4d7cfe" /> Notre Adresse</h4>
              <p>Technopark El Ghazela<br/>2088 Ariana, Tunisie</p>
            </div>

            <div className="novaid-footer-col">
              <h4><Globe size={18} color="#00e5a0" /> Contact Direct</h4>
              <p><Phone size={14} color="#64748b" /> +216 71 000 000</p>
              <p><Mail size={14} color="#64748b" /> contact@plateforme.tn</p>
            </div>

            <div className="novaid-footer-col">
              <h4><Bell size={18} color="#ffb020" /> Heures d'ouverture</h4>
              <p>Du Lundi au Vendredi<br/>09:00 - 18:00</p>
            </div>
          </div>

          <div className="novaid-footer-bottom">
            <div className="novaid-footer-text">
              © 2026 Plateforme de coordination humanitaire · Tous droits réservés
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
