import { useEffect } from "react";

function useReveal(){
    useEffect(() => {
        const els = Array.from(document.querySelectorAll(".reveal"));
        const io = new IntersectionObserver((entries)=>{
            entries.forEach(e=>{
                if(e.isIntersecting){ (e.target as HTMLElement).classList.add("show"); io.unobserve(e.target); }
            })
        }, {threshold: .18});
        els.forEach(el=>io.observe(el));
        return ()=> io.disconnect();
    }, []);
}

export default function Dashboard(){
    useReveal();

    return (
        <>
            {/* HERO */}
            <section className="section full bg-dark">
                <div className="container center">
                    <span className="badge badge-yellow reveal">PREMIUM • SECURE • FAST</span>
                    <h1 className="h1 reveal delay-1" style={{marginTop:16}}>
                        Your Futures, <span style={{color:"var(--yellow)"}}>Crystal-Clear</span>.
                    </h1>
                    <p className="lead reveal delay-2" style={{maxWidth:780, margin:"18px auto 28px"}}>
                        Un panel minimalista con datos en tiempo real de Binance Futures. Métricas poderosas,
                        visuales limpias y una experiencia que inspira confianza.
                    </p>
                    <div className="row center reveal delay-3" style={{justifyContent:"center"}}>
                        <a href="/src/pages/binancePortal/Trades" className="btn btn-primary">Ver mis Trades</a>
                        <a href="/src/pages/binancePortal/Positions" className="btn btn-outline">Posiciones Abiertas</a>
                    </div>

                    {/* Mockup simple */}
                    <div className="reveal delay-3" style={{marginTop:40}}>
                        <div className="card" style={{borderRadius:24, padding:0, overflow:"hidden"}}>
                            <div style={{
                                display:"grid",
                                gridTemplateColumns:"1fr 1fr",
                                background:"linear-gradient(120deg, #171726, #101018)"
                            }}>
                                <div style={{padding:28}}>
                                    <h3 className="h3" style={{margin:"0 0 8px"}}>Mobile Mockup</h3>
                                    <p className="lead">Vista previa de tu balance, PnL y órdenes.</p>
                                </div>
                                <div style={{padding:10, display:"grid", placeItems:"center"}}>
                                    {/* Icono 3D-ish simple */}
                                    <svg width="140" height="140" viewBox="0 0 200 200">
                                        <defs>
                                            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0" stopColor="#ffd400"/>
                                                <stop offset="1" stopColor="#ff7a2a"/>
                                            </linearGradient>
                                        </defs>
                                        <circle cx="100" cy="100" r="60" fill="url(#g1)"/>
                                        <rect x="84" y="55" width="32" height="90" rx="16" fill="#0d0d15" />
                                        <circle cx="100" cy="140" r="6" fill="#ffd400"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MÉTRICAS */}
            <section className="section container reveal">
                <div className="metrics">
                    {[
                        ["4.9★","App Rating"],
                        ["$2.4B+","Total Volume"],
                        ["120k","Usuarios"],
                        ["<120ms","Latency"],
                    ].map(([num,label],i)=>(
                        <div key={i} className="metric">
                            <div className="num">{num}</div>
                            <div className="label">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* BLOQUES alternando imagen/texto */}
            <section className="section container grid grid-2 reveal delay-1">
                <div className="card">
                    <span className="badge badge-yellow">Seguridad</span>
                    <h2 className="h2" style={{marginTop:10}}>Confianza y Control</h2>
                    <p className="lead">Tus claves se gestionan del lado del servidor. El frontend solo consume una capa segura.</p>
                    <div className="row" style={{marginTop:12}}>
                        <a href="/src/pages/binancePortal/Income" className="btn btn-outline">Ver Ingresos</a>
                        <a href="/docs" className="btn btn-primary">API Docs</a>
                    </div>
                </div>
                <div className="card card-contrast" style={{display:"grid", placeItems:"center"}}>
                    {/* ícono moneda */}
                    <svg width="120" height="120" viewBox="0 0 200 200">
                        <defs>
                            <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#7a5cff"/>
                                <stop offset="1" stopColor="#2aa7ff"/>
                            </linearGradient>
                        </defs>
                        <circle cx="100" cy="100" r="70" fill="url(#g2)"/>
                        <path d="M70 105h60M100 80v50" stroke="#0e0e14" strokeWidth="10" strokeLinecap="round"/>
                    </svg>
                </div>
            </section>

            {/* FEATURES en tarjetas */}
            <section className="section bg-yellow">
                <div className="container">
                    <h2 className="h2 reveal">Características Clave</h2>
                    <p className="lead reveal delay-1" style={{maxWidth:760}}>
                        Datos en tiempo real, UI clara y animaciones suaves. Todo listo para que decidas mejor.
                    </p>
                    <div className="grid grid-3" style={{marginTop:22}}>
                        {[
                            ["Realtime Positions","Actualización rápida con auto-refresh de posiciones.", "var(--blue)"],
                            ["Trades History","Filtros por símbolo y rango de fechas.", "var(--purple)"],
                            ["Income & PnL","Funding, comisiones y PnL unificados.", "var(--pink)"]
                        ].map(([title,desc,color],i)=>(
                            <div key={i} className="card reveal" style={{borderTop:`3px solid ${color}`}}>
                                <div className="h3" style={{marginBottom:6}}>{title}</div>
                                <p className="lead">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIOS / Mensajes motivacionales */}
            <section className="section container reveal">
                <div className="grid grid-3">
                    {[
                        ["“Simple y poderoso.”","Trader Pro"],
                        ["“Por fin una UI limpia.”","Desk Quant"],
                        ["“Me ayudó a enfocarme.”","Swing Specialist"],
                    ].map(([q,by],i)=>(
                        <div key={i} className="card" style={{background:"#181818", borderColor:"#2a2a2a"}}>
                            <div style={{background:"#ffd400", color:"#111119", borderRadius:12, padding:14, fontWeight:700}}>{q}</div>
                            <div className="lead" style={{marginTop:10}}>{by}</div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}