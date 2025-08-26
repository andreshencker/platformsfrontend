import React, { useState } from 'react';
import { useMe, useUpdateMyProfile } from '../../hooks/useUsers';

export default function ProfilePage() {
    const { data: me, isLoading } = useMe();
    const { mutateAsync, isPending } = useUpdateMyProfile();

    const [form, setForm] = useState({
        firstName: me?.firstName ?? '',
        middleName: me?.middleName ?? '',
        lastName: me?.lastName ?? '',
        secondLastName: me?.secondLastName ?? '',
    });

    if (isLoading) return <div className="p-6">Cargando perfil…</div>;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await mutateAsync(form);
    };

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-xl font-semibold mb-4">Mi perfil</h1>

            <form className="grid gap-3" onSubmit={onSubmit}>
                <label className="grid gap-1">
                    <span className="text-sm">Primer nombre</span>
                    <input
                        className="border rounded px-3 py-2"
                        value={form.firstName}
                        onChange={(e) => setForm(s => ({ ...s, firstName: e.target.value }))}
                    />
                </label>

                <label className="grid gap-1">
                    <span className="text-sm">Segundo nombre</span>
                    <input
                        className="border rounded px-3 py-2"
                        value={form.middleName}
                        onChange={(e) => setForm(s => ({ ...s, middleName: e.target.value }))}
                    />
                </label>

                <label className="grid gap-1">
                    <span className="text-sm">Primer apellido</span>
                    <input
                        className="border rounded px-3 py-2"
                        value={form.lastName}
                        onChange={(e) => setForm(s => ({ ...s, lastName: e.target.value }))}
                    />
                </label>

                <label className="grid gap-1">
                    <span className="text-sm">Segundo apellido</span>
                    <input
                        className="border rounded px-3 py-2"
                        value={form.secondLastName}
                        onChange={(e) => setForm(s => ({ ...s, secondLastName: e.target.value }))}
                    />
                </label>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black text-white rounded px-4 py-2 disabled:opacity-60"
                >
                    {isPending ? 'Guardando…' : 'Guardar cambios'}
                </button>
            </form>
        </div>
    );
}