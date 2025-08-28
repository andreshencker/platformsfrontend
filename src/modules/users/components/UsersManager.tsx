// src/modules/users/components/UsersManager.tsx
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UserForm, { CreateUserAdminDto, UpdateUserDto } from "./UsersFormFields";
import { listUsers, createUser as createUserByAdmin, updateUser } from "../api/users";

type UserRole = "admin" | "client";
type User = {
    _id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
};

export default function UsersManager() {
    const qc = useQueryClient();

    // UI state
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"newest" | "name-asc">("newest");

    // Data
    const { data: listResp, isLoading } = useQuery({
        queryKey: ["users", {}],
        queryFn: () => listUsers({}),
    });

    // Soporta backend que retorna [] o { data: [] }
    const allUsers: User[] = (listResp as any)?.data ?? (listResp ?? []);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        let arr = allUsers;

        if (s) {
            arr = arr.filter((u) => {
                const name =
                    `${u.firstName ?? ""} ${u.middleName ?? ""} ${u.lastName ?? ""} ${u.secondLastName ?? ""}`
                        .replace(/\s+/g, " ")
                        .trim()
                        .toLowerCase();
                return (
                    name.includes(s) ||
                    (u.email ?? "").toLowerCase().includes(s) ||
                    (u.role ?? "").toLowerCase().includes(s)
                );
            });
        }

        if (sort === "name-asc") {
            arr = [...arr].sort((a, b) => (a.firstName ?? "").localeCompare(b.firstName ?? ""));
        } else {
            arr = [...arr].sort(
                (a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0),
            );
        }
        return arr;
    }, [allUsers, search, sort]);

    const selected = useMemo(
        () => filtered.find((u) => u._id === selectedId),
        [filtered, selectedId],
    );

    // Mutations
    const createMut = useMutation({
        mutationFn: (dto: CreateUserAdminDto) => createUserByAdmin(dto as any),
        onSuccess: () => {
            toast.success("User created");
            setMode("create");
            setSelectedId(null);
            void qc.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message ?? "Error creating"),
    });

    const updateMut = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) => updateUser(id, dto),
        onSuccess: () => {
            toast.success("User updated");
            void qc.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message ?? "Error updating"),
    });

    // Handlers
    function handleNew() {
        setMode("create");
        setSelectedId(null);
    }
    function handleSelect(u: User) {
        setSelectedId(u._id);
        setMode("edit");
    }
    function handleSubmit(payload: CreateUserAdminDto | UpdateUserDto) {
        if (mode === "create") {
            createMut.mutate(payload as CreateUserAdminDto);
        } else if (selected?._id) {
            updateMut.mutate({ id: selected._id, dto: payload as UpdateUserDto });
        }
    }

    // === estilos para que la columna izquierda “imite” el formulario ===
    const listPanelStyle: React.CSSProperties = {
        position: "relative",
        background:
        // halo dorado + leve velo + surface
            "radial-gradient(1200px 240px at 40% 0%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 60%)," +
            "linear-gradient(180deg, color-mix(in oklab, #fff 2%, transparent), transparent)," +
            "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: 18,
        boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
        minHeight: 560,
    };

    const chipStyle: React.CSSProperties = {
        position: "absolute",
        top: 12,
        left: 16,
        fontSize: 11,
        letterSpacing: 0.6,
        border: "1px solid color-mix(in oklab, var(--primary) 45%, var(--border))",
        color: "var(--primary)",
        background: "color-mix(in oklab, var(--primary) 12%, transparent)",
        borderRadius: 999,
        padding: "4px 10px",
        userSelect: "none",
    };

    const cardStyle = (isSelected: boolean): React.CSSProperties => ({
        textAlign: "left",
        background: isSelected
            ? "color-mix(in oklab, var(--primary) 8%, var(--panel))"
            : "var(--panel)",
        border: isSelected
            ? "1px solid color-mix(in oklab, var(--primary) 45%, var(--border))"
            : "1px solid var(--border)",
        padding: 14,
        borderRadius: 14,
        display: "grid",
        gridTemplateColumns: "44px 1fr",
        gap: 12,
        transition: "background .15s ease, border-color .15s ease",
    });

    const avatarBox: React.CSSProperties = {
        width: 44,
        height: 44,
        borderRadius: 10,
        background: "color-mix(in oklab, var(--text) 6%, transparent)",
        overflow: "hidden",
    };

    const roleBadge = (role: UserRole): React.CSSProperties => ({
        background:
            role === "admin"
                ? "color-mix(in oklab, var(--primary) 16%, transparent)"
                : "color-mix(in oklab, var(--text) 10%, transparent)",
        color: role === "admin" ? "var(--primary)" : "var(--text)",
        border: "1px solid var(--border)",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
    });

    const activeBadge = (isActive: boolean): React.CSSProperties => ({
        background: isActive
            ? "color-mix(in oklab, var(--success) 18%, transparent)"
            : "color-mix(in oklab, var(--danger) 16%, transparent)",
        color: isActive ? "var(--success)" : "var(--danger)",
        border: "1px solid var(--border)",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
    });

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "520px 1fr",
                gap: 24,
                alignItems: "start",
            }}
        >
            {/* Columna izquierda: ahora con .panel-hero */}
            <div className="panel-hero" style={{ minHeight: 560 }}>
                <div className="chip">LIST • MANAGE</div>

                {/* Filtros */}
                <div className="row" style={{ gap: 12, marginTop: 32, marginBottom: 12 }}>
                    <input
                        className="input"
                        placeholder="Search by name, email or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                    <select
                        className="input select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as any)}
                        style={{ width: 160 }}
                    >
                        <option value="newest">Newest</option>
                        <option value="name-asc">Name (A→Z)</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleNew}
                        className="btn btn-primary"
                        style={{ padding: "0 14px", fontWeight: 600 }}
                    >
                        New
                    </button>
                </div>

                {/* Lista */}
                <div
                    style={{
                        maxHeight: 560,
                        overflowY: "auto",
                        display: "grid",
                        gap: 12,
                        paddingRight: 6,
                    }}
                >
                    {isLoading && (
                        <div style={{ color: "var(--muted, #8b8b99)" }}>Loading…</div>
                    )}

                    {!isLoading &&
                        filtered.map((u) => {
                            const selected = selectedId === u._id;
                            return (
                                <button
                                    key={u._id}
                                    onClick={() => handleSelect(u)}
                                    className={`card${selected ? " is-selected" : ""}`}
                                    style={{
                                        textAlign: "left",
                                        border: "1px solid var(--color-border)",
                                        padding: 14,
                                        borderRadius: 14,
                                        display: "grid",
                                        gridTemplateColumns: "44px 1fr",
                                        gap: 12,
                                        background: "var(--color-panel)",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 10,
                                            background: "#191a20",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {u.avatarUrl ? (
                                            <img
                                                src={u.avatarUrl}
                                                alt=""
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : null}
                                    </div>

                                    <div style={{ display: "grid", gap: 4 }}>
                                        <div style={{ fontWeight: 700, color: "var(--color-text)" }}>
                                            {(u.firstName ?? "") + " " + (u.lastName ?? "")}
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
                                            {u.email}
                                        </div>
                                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <span
                          className="badge"
                          style={{
                              background:
                                  u.role === "admin" ? "rgba(240,185,11,0.1)" : "#1A1B1F",
                              color: u.role === "admin" ? "#F0B90B" : "#E6E6E6",
                              border: "1px solid #22242A",
                              padding: "2px 8px",
                              borderRadius: 999,
                              fontSize: 12,
                          }}
                      >
                        {u.role.toUpperCase()}
                      </span>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: u.isActive ? "rgba(34,197,94,0.12)" : "#1A1B1F",
                                                    color: u.isActive ? "#22C55E" : "#E6E6E6",
                                                    border: "1px solid #22242A",
                                                    padding: "2px 8px",
                                                    borderRadius: 999,
                                                    fontSize: 12,
                                                }}
                                            >
                        {u.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                    {!isLoading && filtered.length === 0 && (
                        <div style={{ color: "var(--color-muted)" }}>No users found.</div>
                    )}
                </div>
            </div>

            {/* Columna derecha: Formulario (sin cambios) */}
            <div>
                <UserForm
                    mode={mode}
                    initial={selected ?? undefined}
                    submitting={createMut.isPending || updateMut.isPending}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setMode("create");
                        setSelectedId(null);
                    }}
                />
            </div>
        </div>
    );
}