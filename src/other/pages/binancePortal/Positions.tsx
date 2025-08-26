import { useState } from "react";
//import { getPositions } from "../api/binance";

export default function Positions(){
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = async () => {
        setLoading(true);
        try{
            const res = await getPositions();
            // filtra posiciones con qty != 0
            setRows((res || []).filter((p:any)=> Number(p.positionAmt) !== 0));
        } finally{
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="row" style={{justifyContent:"space-between"}}>
                <div>
                    <h2 className="h2">Positions</h2>
                    <p className="lead">Posiciones abiertas (USD-M).</p>
                </div>
                <button className="btn btn-primary" onClick={fetch} disabled={loading}>
                    {loading ? "Cargando..." : "Refrescar"}
                </button>
            </div>

            <hr className="sep" />

            <div className="card">
                <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%", borderCollapse:"collapse"}}>
                        <thead>
                        <tr style={{color:"#a7a7b3", textAlign:"left"}}>
                            <th>Symbol</th><th>Side</th><th>Amt</th><th>Entry</th><th>Mark</th><th>uPnL</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((p:any,i)=>(
                            <tr key={i} style={{borderTop:"1px solid #23233a"}}>
                                <td>{p.symbol}</td>
                                <td style={{color: Number(p.positionAmt)>0 ? "#2aa7ff" : "#ff4d9a"}}>
                                    {Number(p.positionAmt)>0 ? "LONG" : "SHORT"}
                                </td>
                                <td>{p.positionAmt}</td>
                                <td>{p.entryPrice}</td>
                                <td>{p.markPrice}</td>
                                <td style={{color: Number(p.unRealizedProfit)>=0 ? "#77e08c" : "#ff7a7a"}}>
                                    {p.unRealizedProfit}
                                </td>
                            </tr>
                        ))}
                        {!rows.length && !loading && (
                            <tr><td colSpan={6} className="lead">No hay posiciones abiertas.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}