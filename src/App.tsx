// src/App.tsx
import { RouterProvider } from "react-router-dom";
import { routes } from "src/app/router";

export default function App() {
    return <RouterProvider router={routes} />;
}