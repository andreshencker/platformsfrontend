// src/app/Providers.tsx
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/app/lib/queryClient";
import { AuthProvider } from "@/modules/auth/hooks/useAuth";

// ⬇️ importa tu ThemeProvider
import { ThemeProvider } from "@/app/common/theme/ThemeProvider";
// (opcional) si tu ThemeProvider no importa su CSS, impórtalo aquí:
// import "@/modules/common/theme/theme.css";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        {children}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: {
                                    background: "#111214",
                                    color: "#E6E6E6",
                                    border: "1px solid #22242A",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                                },
                                success: { iconTheme: { primary: "#F0B90B", secondary: "#111214" } },
                                error: { iconTheme: { primary: "#F03D3D", secondary: "#111214" } },
                            }}
                        />
                    </AuthProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}