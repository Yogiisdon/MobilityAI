import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useStore } from "../store/useStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const goToApp = useStore((s) => s.goToApp);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); goToApp(); }, 1000);
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(14,18,30,0.8)",
    border: "1px solid #1e2540",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#d8dce8",
    fontFamily: "'IBM Plex Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "#080b12", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'IBM Plex Sans', sans-serif",
      position: "relative", overflow: "hidden",
    }}>

      {/* Background glows */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 50% 40% at 30% 40%, rgba(0,212,170,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 70% 60%, rgba(124,110,245,0.06) 0%, transparent 70%)"
      }}/>

      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "48px 48px"
      }}/>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: 380,
          background: "rgba(14,18,30,0.85)",
          border: "1px solid #1e2540",
          borderRadius: 16, padding: "32px 28px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
          margin: "0 16px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, rgba(0,212,170,0.2), rgba(124,110,245,0.2))",
            border: "1px solid rgba(0,212,170,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity size={14} color="#00d4aa" />
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 13, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>MobilityAI</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: "#3a4060", letterSpacing: "0.15em", lineHeight: 1, marginTop: 2 }}>DEMAND FORECAST</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#3a4060", letterSpacing: "0.15em", marginBottom: 6 }}>SECURE ACCESS</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#d8dce8", margin: 0, letterSpacing: "-0.02em" }}>Sign in to dashboard</h2>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#5a6080", letterSpacing: "0.12em", display: "block", marginBottom: 6 }}>EMAIL ADDRESS</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={e => e.target.style.borderColor = "rgba(0,212,170,0.4)"}
            onBlur={e => e.target.style.borderColor = "#1e2540"}
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#5a6080", letterSpacing: "0.12em", display: "block", marginBottom: 6 }}>PASSWORD</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={e => e.target.style.borderColor = "rgba(0,212,170,0.4)"}
              onBlur={e => e.target.style.borderColor = "#1e2540"}
              style={{ ...inputStyle, paddingRight: 40 }}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#5a6080", padding: 0, display: "flex" }}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#00d4aa", cursor: "pointer", letterSpacing: "0.08em" }}>FORGOT PASSWORD?</span>
          </div>
        </div>

        {/* Login button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          style={{
            width: "100%", padding: "11px 0",
            background: loading ? "rgba(0,212,170,0.3)" : "linear-gradient(135deg, #00d4aa, #7c6ef5)",
            border: "none", borderRadius: 8, cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            fontWeight: 700, color: loading ? "#00d4aa" : "#080b12",
            letterSpacing: "0.1em", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <>
              <span style={{ width: 10, height: 10, border: "2px solid #00d4aa", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              AUTHENTICATING
            </>
          ) : (
            <>SIGN IN <ArrowRight size={12} /></>
          )}
        </motion.button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#1e2540" }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#3a4060", letterSpacing: "0.1em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#1e2540" }} />
        </div>

        {/* Back to landing */}
        <button
          onClick={() => setActiveTab("landing")}
          style={{
            width: "100%", padding: "10px 0",
            background: "rgba(255,255,255,0.03)", border: "1px solid #1e2540",
            borderRadius: 8, cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            color: "#8890a8", letterSpacing: "0.08em",
          }}
        >
          ← BACK TO HOME
        </button>

        {/* Footer note */}
        <div style={{ marginTop: 20, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#3a4060", letterSpacing: "0.08em" }}>
          SECURED · MOBILITYAI PLATFORM
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}