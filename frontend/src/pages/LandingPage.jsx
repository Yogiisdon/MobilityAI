import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { useEffect, useState, useRef } from "react";
import { Activity, Zap, Map, BarChart3, ArrowRight } from "lucide-react";

// Animated background canvas
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#00d4aa' : '#7c6ef5',
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,170,${0.12 * (1 - dist/160)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        const glow = Math.sin(n.pulse) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = n.color + Math.floor(glow * 200).toString(16).padStart(2,'0');
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }} />;
}

// Live ticker
function LiveTicker() {
  const [val, setVal] = useState(1247);
  useEffect(() => {
    const id = setInterval(() => setVal(v => v + Math.floor(Math.random() * 5 - 1)), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="font-mono text-xs" style={{ color: '#00d4aa' }}>
      <span style={{ color: '#5a6080' }}>LIVE RIDES </span>
      <motion.span key={val} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
        {val.toLocaleString()}
      </motion.span>
    </div>
  );
}

// Mini demand chart
function DemandSparkline() {
  const [data, setData] = useState(() => Array.from({ length: 24 }, (_, i) => 30 + Math.sin(i/3) * 20 + Math.random() * 10));
  useEffect(() => {
    const id = setInterval(() => {
      setData(d => [...d.slice(1), 30 + Math.random() * 40]);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const W = 320, H = 80;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${(i/(data.length-1))*W},${H - ((v-min)/(max-min||1))*H}`).join(' ');

  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#00d4aa" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#sg)"/>
    </svg>
  );
}

const FEATURES = [
  { icon: Map, label: 'Zone Heatmaps', desc: 'Color-coded demand across 30 zones per city, updated every 5 seconds.' },
  { icon: BarChart3, label: 'GNN Forecasting', desc: 'Graph Neural Networks predict demand 30–240 min ahead with <10% MAPE.' },
  { icon: Zap, label: 'Live Alerts', desc: 'Threshold-based alerts fire instantly when zones spike or crash.' },
];

const CITIES = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];

export default function LandingPage() {
  const goToApp = useStore((state) => state.goToApp);
  const setActiveTab = useStore((state) => state.setActiveTab);
  const [cityIdx, setCityIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCityIdx(i => (i + 1) % CITIES.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080b12', color: '#d8dce8', fontFamily: "'IBM Plex Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>

      <div className="absolute inset-0"><ParticleCanvas /></div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0,212,170,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(124,110,245,0.07) 0%, transparent 70%)'
      }}/>

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }}/>

      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', height: 52, borderBottom: '1px solid #1e2540', background: 'rgba(8,11,18,0.7)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(124,110,245,0.2))', border: '1px solid rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={14} color="#00d4aa" />
            </div>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>MobilityAI</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: '#3a4060', letterSpacing: '0.15em', lineHeight: 1, marginTop: 2 }}>DEMAND FORECAST</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LiveTicker />
            <button onClick={() => setActiveTab('login')} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8890a8', background: 'none', border: '1px solid #1e2540', borderRadius: 6, padding: '5px 14px', cursor: 'pointer' }}>
              Login
            </button>
            <button onClick={goToApp} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#080b12', background: 'linear-gradient(135deg, #00d4aa, #7c6ef5)', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 600 }}>
              Open App →
            </button>
          </div>
        </header>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 99, padding: '4px 12px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', display: 'inline-block', animation: 'pulse 2s infinite' }}/>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#00d4aa', letterSpacing: '0.1em' }}>LIVE ACROSS INDIA</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 300, lineHeight: 1.1, margin: '0 0 8px', color: '#d8dce8', letterSpacing: '-0.03em' }}>
              Urban Demand
            </h1>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 24px', background: 'linear-gradient(135deg, #00d4aa 0%, #7c6ef5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
              Intelligence Platform
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 15, color: '#5a6080', maxWidth: 480, margin: '0 auto 12px', lineHeight: 1.7 }}>
            Graph Neural Networks forecast ride demand across
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ height: 28, overflow: 'hidden', marginBottom: 36 }}>
            <AnimatePresence mode="wait">
              <motion.div key={cityIdx}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: '#00d4aa', fontWeight: 600 }}>
                {CITIES[cityIdx]}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button onClick={goToApp} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: '#080b12', background: 'linear-gradient(135deg, #00d4aa, #7c6ef5)', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', letterSpacing: '0.05em' }}>
              OPEN DASHBOARD <ArrowRight size={13} />
            </button>
            <button style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8890a8', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e2540', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', letterSpacing: '0.05em' }}>
              BOOK DEMO
            </button>
          </motion.div>
        </section>

        {/* Live chart strip */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', paddingBottom: 60 }}>
          <div style={{ background: 'rgba(14,18,30,0.8)', border: '1px solid #1e2540', borderRadius: 16, padding: '16px 24px', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#3a4060', letterSpacing: '0.15em', marginBottom: 10 }}>LIVE DEMAND · DELHI NCR · 5s INTERVAL</div>
            <DemandSparkline />
          </div>
        </motion.section>

        {/* Features */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ borderColor: 'rgba(0,212,170,0.3)', background: 'rgba(0,212,170,0.04)' }}
              style={{ padding: '20px 22px', background: 'rgba(14,18,30,0.6)', border: '1px solid #1e2540', borderRadius: 12, transition: 'all 0.2s', cursor: 'default' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <f.icon size={14} color="#00d4aa" />
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, color: '#d8dce8', marginBottom: 6, letterSpacing: '0.05em' }}>{f.label}</div>
              <div style={{ fontSize: 12, color: '#5a6080', lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </section>

        {/* Stats bar */}
        <section style={{ borderTop: '1px solid #1e2540', borderBottom: '1px solid #1e2540', background: 'rgba(14,18,30,0.4)', padding: '24px 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
            {[['22', 'Cities'], ['30', 'Zones/City'], ['<10%', 'MAPE Error'], ['5s', 'Update Interval']].map(([val, label], i) => (
              <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid #1e2540' : 'none', padding: '8px 0' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 700, color: '#00d4aa', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#3a4060', letterSpacing: '0.12em', marginTop: 4 }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#3a4060', letterSpacing: '0.15em', marginBottom: 16 }}>READY TO DEPLOY</div>
          <h2 style={{ fontSize: 32, fontWeight: 300, color: '#d8dce8', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Start forecasting in</h2>
          <h2 style={{ fontSize: 32, fontWeight: 700, background: 'linear-gradient(135deg, #00d4aa, #7c6ef5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 32px', letterSpacing: '-0.02em' }}>minutes, not months.</h2>
          <button onClick={goToApp} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: '#080b12', background: 'linear-gradient(135deg, #00d4aa, #7c6ef5)', border: 'none', borderRadius: 8, padding: '12px 32px', cursor: 'pointer', letterSpacing: '0.05em' }}>
            OPEN DASHBOARD →
          </button>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #1e2540', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={11} color="#00d4aa" />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#3a4060', letterSpacing: '0.1em' }}>MOBILITYAI · DEMAND FORECAST</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#3a4060', letterSpacing: '0.1em' }}>
            BUILT WITH GNN + LSTM · PYTORCH GEOMETRIC
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}