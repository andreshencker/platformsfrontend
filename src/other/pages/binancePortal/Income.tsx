import { useState } from "react";
import { getIncome } from "@/other/api/binance";

export default function Income(){
    const [symbol, setSymbol] = useState<string>("");
    const [type, setType] = useState<string>("REALIZED_PNL");
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = async ()=>{
        setLoading(true);
        try{
            const data = await getIncome({ symbol: symbol || undefined, incomeType: type, limit: 100 });
            setRows(data || []);
        } finally{ setLoading(false); }
    };

    return (
        <section className="section">
            <div className="row" style={{justifyContent:"space-between"}}>
                <div>
                    <h2 className="h2">Income</h2>
                    <p className="lead">Funding, comisiones y PnL realizados.</p>
                </div>
                <div className="row">
                    <input
                        placeholder="Símbolo (opcional)"
                        value={symbol}
                        onChange={e=>setSymbol(e.target.value.toUpperCase())}
                        className="btn btn-outline"
                        style={{padding:"10px 14px"}}
                    />
                    <select value={type} onChange={e=>setType(e.target.value)} className="btn btn-outline">
                        {["REALIZED_PNL","COMMISSION","FUNDING_FEE","REFERRAL_KICKBACK","INSURANCE_CLEAR","TRANSFER"].map(t=>(
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={fetch} disabled={loading}>
                        {loading ? "Cargando..." : "Consultar"}
                    </button>
                </div>
            </div>

            <hr className="sep" />

            <div className="card">
                <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%", borderCollapse:"collapse"}}>
                        <thead>
                        <tr style={{color:"#a7a7b3", textAlign:"left"}}>
                            <th>Time</th><th>Type</th><th>Symbol</th><th>Income</th><th>Info</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((r:any,i)=>(
                            <tr key={i} style={{borderTop:"1px solid #23233a"}}>
                                <td>{new Date(r.time).toLocaleString()}</td>
                                <td>{r.incomeType}</td>
                                <td>{r.symbol || "-"}</td>
                                <td style={{color: Number(r.income)>=0 ? "#77e08c" : "#ff7a7a"}}>{r.income}</td>
                                <td className="lead">{r.info || "-"}</td>
                            </tr>
                        ))}
                        {!rows.length && !loading && (
                            <tr><td colSpan={5} className="lead">Sin datos. Ejecuta una consulta.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}