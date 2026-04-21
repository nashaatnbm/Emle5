"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const PLANS = [
  { dur:"30 Days",  price:499,  ai:"50 AI Generations",   popular:false, features:["Full QBank (4,000+ Qs)","ReadyDecks (2,000+ cards)","SmartCards","Medical Library","Performance Analytics"], missing:["Mock Exams","Smart Study Planner"] },
  { dur:"90 Days",  price:999,  ai:"150 AI Generations",  popular:true,  features:["Full QBank (4,000+ Qs)","ReadyDecks (2,000+ cards)","SmartCards + AI Coach","Medical Library","Performance Analytics","1 Full Mock Exam","AI Study Coach"], missing:[] },
  { dur:"180 Days", price:1499, ai:"300 AI Generations",  popular:false, features:["Full QBank (4,000+ Qs)","ReadyDecks (2,000+ cards)","SmartCards + AI Coach","Medical Library","Performance Analytics","2 Full Mock Exams","Smart Study Planner"], missing:[] },
  { dur:"360 Days", price:2299, ai:"Unlimited AI ♾️",     popular:false, features:["Full QBank (4,000+ Qs)","ReadyDecks (2,000+ cards)","Unlimited AI Coach ♾️","Medical Library","Advanced Analytics","3 Full Mock Exams","Everything included"], missing:[] },
];
const PROMOS: Record<string,number> = { EMLE2025:20, WELCOME:10, DOCTOR:15, SAVE30:30 };

export default function PricingPage() {
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState<typeof PLANS[0]|null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoMsg, setPromoMsg] = useState<{text:string;ok:boolean}|null>(null);
  const [discount, setDiscount] = useState(0);
  const [payMethod, setPayMethod] = useState("card");
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<string|null>(null);

  useEffect(() => {
    const t = localStorage.getItem("emle_theme") || "light";
    if (t==="dark") { setDark(true); document.documentElement.classList.add("dark"); }
    const saved = localStorage.getItem("emle_cart");
    if (saved) { try { const p = JSON.parse(saved); const match = PLANS.find(pl=>pl.price===p.price); if(match) setCart(match); } catch {} }
  }, []);

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),2800); };
  const addToCart = (plan:typeof PLANS[0]) => { setCart(plan); localStorage.setItem("emle_cart",JSON.stringify(plan)); showToast(`✅ "${plan.dur} Plan" added to cart!`); document.getElementById("cart-section")?.scrollIntoView({behavior:"smooth"}); };
  const removeCart = () => { setCart(null); localStorage.removeItem("emle_cart"); setDiscount(0); setPromoMsg(null); };
  const applyPromo = () => { const c=promoCode.trim().toUpperCase(); const d=PROMOS[c]; if(d){setDiscount(d);setPromoMsg({text:`✅ ${d}% discount applied!`,ok:true});showToast(`🎉 ${d}% discount activated!`);}else setPromoMsg({text:"❌ Invalid promo code.",ok:false}); };
  const checkout = async () => {
    const user = localStorage.getItem("emle_user");
    if(!user){showToast("⚠️ Please log in first!");setTimeout(()=>window.location.href="/login",1000);return;}
    setCheckingOut(true);
    await new Promise(r=>setTimeout(r,2200));
    localStorage.removeItem("emle_cart");
    setSuccess(true);
  };

  const total = cart ? Math.round(cart.price*(1-discount/100)) : 0;

  return (
    <div className="min-h-screen" style={{ background:"var(--bg)", color:"var(--text)" }}>
      <nav className="navbar">
        <div className="max-w-[1180px] mx-auto px-6 h-full flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[17px]" style={{ color:"var(--text)" }}>
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center" style={{ background:"var(--blue)", boxShadow:"0 4px 12px rgba(0,87,255,.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE <span style={{ color:"var(--blue)" }}>QBank</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[["Home","/"],["QBank","/qbank"],["AI Generator","/ai-generator"],["Pricing","/pricing"],["Dashboard","/dashboard"]].map(([l,h])=>(
              <Link key={h} href={h} className="px-3 py-[7px] rounded-lg text-sm font-semibold" style={{ color:h==="/pricing"?"var(--blue)":"var(--text-mid)", background:h==="/pricing"?"var(--blue-glow)":"transparent" }}>{l}</Link>
            ))}
          </div>
          <button onClick={()=>{const n=!dark;setDark(n);document.documentElement.classList.toggle("dark",n);localStorage.setItem("emle_theme",n?"dark":"light");}} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border:"1px solid var(--border)", background:"var(--bg-card)", cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-6 pt-[100px] pb-20">
        <div className="text-center mb-14">
          <span className="text-xs font-black uppercase tracking-[1.8px] block mb-3" style={{ color:"var(--blue-light)" }}>Pricing</span>
          <h1 className="font-extrabold mb-3" style={{ fontSize:"clamp(28px,3.5vw,44px)", letterSpacing:"-.02em" }}>Choose Your Plan</h1>
          <p className="text-sm" style={{ color:"var(--text-muted)" }}>All plans include a 7-day free trial. No credit card required. Prices in Egyptian Pounds (EGP).</p>
        </div>

        {/* PLANS */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-14">
          {PLANS.map((plan,i)=>(
            <div key={i} className={`rounded-2xl border-2 p-6 flex flex-col transition-all relative overflow-hidden ${plan.popular?"shadow-2xl scale-[1.03]":"hover:-translate-y-1 hover:shadow-lg"} ${cart?.dur===plan.dur?"ring-2 ring-green-400":""}`}
              style={{ background:plan.popular?"var(--blue)":"var(--bg)", borderColor:plan.popular?"var(--blue)":"var(--border)" }}>
              {plan.popular && <div className="absolute top-3 right-3 text-[10px] font-black px-3 py-1 rounded-full" style={{ background:"#FFD166", color:"#000" }}>⭐ Most Popular</div>}
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color:plan.popular?"rgba(255,255,255,.65)":"var(--text-muted)" }}>{plan.dur}</div>
              <div className="font-black mb-1 leading-none" style={{ fontSize:"38px", color:plan.popular?"#fff":"var(--text)", letterSpacing:"-.02em" }}>
                <span className="text-sm font-bold align-top inline-block mt-2">EGP </span>{plan.price.toLocaleString()}
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold mb-4 w-fit mt-3" style={{ background:plan.popular?"rgba(255,255,255,.15)":"var(--blue-soft)", color:plan.popular?"#fff":"var(--blue)" }}>🤖 {plan.ai}</div>
              <div className="h-px mb-4" style={{ background:plan.popular?"rgba(255,255,255,.2)":"var(--border)" }}/>
              <div className="flex flex-col gap-2 flex-1 mb-5">
                {plan.features.map((f,j)=><div key={j} className="flex items-start gap-2 text-[13px]" style={{ color:plan.popular?"rgba(255,255,255,.85)":"var(--text-mid)" }}><span className="flex-shrink-0 font-black" style={{ color:plan.popular?"#4ADE80":"var(--green)" }}>✓</span>{f}</div>)}
                {plan.missing.map((f,j)=><div key={j} className="flex items-start gap-2 text-[13px] opacity-40" style={{ color:"var(--text-muted)" }}><span>✗</span>{f}</div>)}
              </div>
              <button onClick={()=>addToCart(plan)} className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer transition-all" style={{ background:plan.popular?"#fff":"var(--blue)", color:plan.popular?"var(--blue)":"#fff", border:"none", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                {cart?.dur===plan.dur?"✓ In Cart":"Subscribe Now"}
              </button>
              <div className="text-center mt-2 text-[11px]" style={{ color:plan.popular?"rgba(255,255,255,.5)":"var(--text-muted)" }}>7-day free trial ✓</div>
            </div>
          ))}
        </div>

        {/* CART */}
        <div id="cart-section" className="card p-7 max-w-2xl mx-auto">
          <h2 className="text-lg font-extrabold mb-5">🛒 Shopping Cart</h2>
          {!cart ? (
            <div className="text-center py-10" style={{ color:"var(--text-muted)" }}>
              <div className="text-5xl mb-4">🛒</div>
              <div className="font-bold text-base mb-2">Your cart is empty</div>
              <p className="text-sm">Choose a plan above to get started</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 rounded-2xl mb-5" style={{ background:"var(--bg)", border:"1px solid var(--border)" }}>
                <span className="text-3xl">📚</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">EMLE QBank – {cart.dur} Plan</div>
                  <div className="text-xs mt-1" style={{ color:"var(--text-muted)" }}>🤖 {cart.ai} · Full access to all content</div>
                </div>
                <div className="text-xl font-extrabold" style={{ color:"var(--blue)" }}>{cart.price.toLocaleString()} EGP</div>
                <button onClick={removeCart} className="text-lg" style={{ background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)" }}>✕</button>
              </div>

              {/* Promo */}
              <div className="mb-5">
                <div className="text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>🏷️ Promo Code</div>
                <div className="flex gap-2">
                  <input value={promoCode} onChange={e=>setPromoCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&applyPromo()} placeholder="Enter promo code" className="input-field flex-1" style={{ padding:"10px 14px" }}/>
                  <button onClick={applyPromo} className="px-5 py-2 rounded-lg text-sm font-bold text-white" style={{ background:"var(--blue)",border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Apply</button>
                </div>
                {promoMsg && <p className="mt-2 text-xs font-bold" style={{ color:promoMsg.ok?"var(--green)":"var(--red)" }}>{promoMsg.text}</p>}
              </div>

              {/* Summary */}
              <div className="pt-4 border-t mb-5" style={{ borderColor:"var(--border)" }}>
                <div className="flex justify-between text-sm mb-2" style={{ color:"var(--text-mid)" }}><span>Subtotal</span><span>{cart.price.toLocaleString()} EGP</span></div>
                {discount>0 && <div className="flex justify-between text-sm mb-2" style={{ color:"var(--green)" }}><span>Discount ({discount}%)</span><span>- {(cart.price*discount/100).toLocaleString()} EGP</span></div>}
                <div className="flex justify-between font-extrabold text-base mt-3 pt-3" style={{ borderTop:"1px solid var(--border)" }}><span>Total</span><span style={{ color:"var(--blue)" }}>{total.toLocaleString()} EGP</span></div>
              </div>

              {/* Payment methods */}
              <div className="mb-5">
                <div className="text-xs font-bold mb-3" style={{ color:"var(--text-muted)" }}>Payment Method</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[["card","💳 Visa/Mastercard"],["fawry","🏧 Fawry"],["vodafone","📱 Vodafone Cash"],["instapay","🏦 InstaPay"]].map(([id,label])=>(
                    <button key={id} onClick={()=>setPayMethod(id)} className="py-2 px-3 rounded-xl text-xs font-bold transition-all" style={{ border:`2px solid ${payMethod===id?"var(--blue)":"var(--border)"}`, background:payMethod===id?"var(--blue-glow)":"var(--bg-card)", color:payMethod===id?"var(--blue)":"var(--text-muted)", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{label}</button>
                  ))}
                </div>
              </div>

              <button onClick={checkout} disabled={checkingOut} className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2" style={{ background:"var(--green)",border:"none",cursor:checkingOut?"not-allowed":"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:"0 6px 18px rgba(16,185,129,.35)",opacity:checkingOut?.7:1 }}>
                {checkingOut?"Processing payment...":"🔒 Complete Subscription"}
              </button>
              <div className="flex gap-4 justify-center mt-4 flex-wrap">
                {[["🔒","100% SSL Secure"],["↩️","7-Day Refund"],["⚡","Instant Access"],["📞","24/7 Support"]].map(([i,l])=>(<div key={l} className="flex items-center gap-1 text-xs" style={{ color:"var(--text-muted)" }}><span>{i}</span>{l}</div>))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background:"rgba(0,0,0,.6)" }}>
          <div className="card p-10 text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-extrabold mb-3">Subscription Activated!</h2>
            <p className="text-sm mb-6" style={{ color:"var(--text-muted)" }}>Congratulations! Your {cart?.dur} plan is now active. Start studying and ace the EMLE!</p>
            <Link href="/dashboard" className="btn btn-primary btn-xl">🚀 Start Studying Now</Link>
          </div>
        </div>
      )}

      {toast && <div className="toast" style={{ opacity:1, transform:"translateY(0)" }}>{toast}</div>}
    </div>
  );
}
