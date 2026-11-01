import React, { useState } from "react";
import { ArrowLeft, LogIn, ShieldPlus, UserPlus } from "lucide-react";
import { api } from "../api";

const demoAccounts = [
  ["Pharmacy owner", "owner@aster.demo", "AsterDemo!2026"],
  ["Inventory manager", "manager@lakeside.demo", "LakesideDemo!2026"],
  ["Read-only user", "viewer@aster.demo", "ViewerDemo!2026"],
];

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("owner@aster.demo");
  const [password, setPassword] = useState("AsterDemo!2026");
  const [displayName, setDisplayName] = useState("");
  const [hospitalId, setHospitalId] = useState("ASTR");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (mode === "register") {
        await api.register({ email, password, display_name: displayName, hospital_id: hospitalId });
        setMode("login"); setPassword(""); setSuccess("Account created. Sign in with your new details.");
      } else {
        const result = await api.login({ email, password }); api.setSession(result.token); onLogin(result.user);
      }
    }
    catch (err) { setError(err.message || "Unable to sign in."); }
    finally { setBusy(false); }
  }
  function switchMode(nextMode) { setMode(nextMode); setError(""); setSuccess(""); }
  return <main className="login-shell"><section className="login-card">
    <div className="login-brand"><span><ShieldPlus size={25}/></span><div><strong>MedGuard AI</strong><small>PHARMACY SUPPLY RESILIENCE</small></div></div>
    <div className="login-intro"><span>LOCAL DEMO ACCESS</span><h1>{mode === "login" ? "Sign in to the pharmacy workspace" : "Create a pharmacy account"}</h1><p>{mode === "login" ? "Use a seeded demo account or create a local pharmacy staff account." : "Create a local Pharmacy Staff account for one demo hospital."}</p></div>
    <form onSubmit={submit} className="login-form">
      {mode === "register" && <label>Display name<input value={displayName} onChange={e=>setDisplayName(e.target.value)} required minLength={2} /></label>}
      <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} /></label>
      {mode === "register" && <label>Pharmacy<select value={hospitalId} onChange={e=>setHospitalId(e.target.value)}><option value="ASTR">Aster General</option><option value="LAKE">Lakeside Care</option><option value="NORTH">Northstar Medical</option><option value="COAST">Coastal District</option><option value="WEST">Westline Hospital</option></select></label>}
      {error && <div className="login-error">{error}</div>}
      {success && <div className="login-success">{success}</div>}
      <button className="button button-primary" disabled={busy}>{busy ? (mode === "login" ? "Signing in…" : "Creating account…") : mode === "login" ? <><LogIn size={16}/>Sign in</> : <><UserPlus size={16}/>Create account</>}</button>
    </form>
    {mode === "login" ? <><div className="demo-account-list"><strong>Demo accounts</strong>{demoAccounts.map(([role, address, secret])=><button key={address} type="button" onClick={()=>{setEmail(address);setPassword(secret)}}><span>{role}</span><small>{address}</small></button>)}</div><button type="button" className="login-link-button" onClick={()=>switchMode("register")}><UserPlus size={15}/>Create an account</button></> : <button type="button" className="login-link-button" onClick={()=>switchMode("login")}><ArrowLeft size={15}/>Back to sign in</button>}
    <p className="login-note">New accounts are local Pharmacy Staff accounts for demo data. Password recovery and production identity management are not configured.</p>
  </section></main>;
}
