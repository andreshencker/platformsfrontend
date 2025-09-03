// Tipo normalizado que consume la UI, sin acoplarse a un endpoint concreto
export type NormalizedSymbol = {
    id: string;              // "BTCUSDT", "ADAUSDT", "BTCUSD_PERP", "BTC-240927-60000-C"
    display: string;         // "BTCUSDT", "ADAUSDT", etc
    base?: string;           // "BTC"
    quote?: string;          // "USDT" | "USD" | ...
    kind: 'perp' | 'option' | 'spot' | 'margin';
    segment:
        | 'usdm'     // futures
        | 'coinm'    // futures
        | 'options'  // futures
        | 'cross'    // margin
        | 'isolated' // margin
        | 'spot';    // spot
};