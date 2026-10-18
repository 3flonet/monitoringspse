import React, { useState, useEffect } from 'react';

export default function AdminAlertsManager({ authFetch, getLpseNameBySlug }) {
    const [alertsData, setAlertsData] = useState([]);
    const [totalAlerts, setTotalAlerts] = useState(0);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [actionMsg, setActionMsg] = useState(null);
    const [testingId, setTestingId] = useState(null);
    const [togglingKeys, setTogglingKeys] = useState({});

    const limit = 25;

    const fetchAlerts = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search: searchTerm,
                status: statusFilter,
                page: currentPage,
                limit: limit
            });
            const res = await authFetch(`/api/admin/alerts?${queryParams.toString()}`);
            const json = await res.json();
            if (res.ok && json.data) {
                setAlertsData(json.data.items || []);
                setTotalAlerts(json.data.total || 0);
                setStats(json.data.stats || null);
            }
        } catch (err) {
            console.error("Gagal mengambil data alerts admin:", err);
            setActionMsg({ type: 'danger', text: '❌ Gagal memuat data alerts pengguna.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, [statusFilter, currentPage]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchAlerts();
    };

    const handleToggle = async (alertId, field, currentValue) => {
        const toggleKey = `${alertId}_${field}`;
        setTogglingKeys(prev => ({ ...prev, [toggleKey]: true }));
        const newValue = !currentValue;

        // Optimistic update
        setAlertsData(prev => prev.map(a => a.id === alertId ? { ...a, [field]: newValue ? 1 : 0 } : a));

        try {
            const res = await authFetch(`/api/admin/alerts/${alertId}/toggle`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: newValue })
            });
            const data = await res.json();
            if (res.ok) {
                const label = field === 'is_active' ? 'Status Master Alert' : (field === 'email_active' ? 'Notifikasi Email' : 'Notifikasi WhatsApp');
                setActionMsg({
                    type: 'success',
                    text: `✅ ${label} untuk Alert #${alertId} berhasil diubah ke ${newValue ? 'AKTIF' : 'NONAKTIF'}.`
                });
                setTimeout(() => setActionMsg(null), 4000);
            } else {
                fetchAlerts();
                setActionMsg({ type: 'danger', text: `❌ ${data.detail || 'Gagal mengubah status alert.'}` });
            }
        } catch (err) {
            fetchAlerts();
            setActionMsg({ type: 'danger', text: '❌ Terjadi kesalahan jaringan saat mengubah status.' });
        } finally {
            setTogglingKeys(prev => {
                const next = { ...prev };
                delete next[toggleKey];
                return next;
            });
        }
    };

    const handleDeleteAlert = async (alertObj) => {
        if (!window.confirm(`Yakin ingin menghapus pemantauan kata kunci "${alertObj.keyword}" milik "${alertObj.user_email}"?`)) {
            return;
        }
        try {
            const res = await authFetch(`/api/admin/alerts/${alertObj.id}`, { method: 'DELETE' });
            if (res.ok) {
                setActionMsg({ type: 'success', text: `✅ Alert #${alertObj.id} berhasil dihapus.` });
                fetchAlerts();
            } else {
                setActionMsg({ type: 'danger', text: '❌ Gagal menghapus alert.' });
            }
        } catch (err) {
            setActionMsg({ type: 'danger', text: '❌ Kesalahan saat menghapus alert.' });
        }
    };

    const handleTestAlert = async (alertId) => {
        setTestingId(alertId);
        try {
            const res = await authFetch(`/api/admin/alerts/${alertId}/test`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                const emailStatus = data.results?.email || 'Tidak diset';
                const waStatus = data.results?.whatsapp || 'Tidak diset';
                setActionMsg({
                    type: 'success',
                    text: `🧪 Hasil Uji Notifikasi Alert #${alertId} -> Email: ${emailStatus} | WhatsApp: ${waStatus}`
                });
            } else {
                setActionMsg({ type: 'danger', text: `❌ ${data.detail || 'Gagal mengirim uji notifikasi.'}` });
            }
        } catch (err) {
            setActionMsg({ type: 'danger', text: '❌ Gagal menghubungi server untuk uji notifikasi.' });
        } finally {
            setTestingId(null);
        }
    };

    const totalPages = Math.ceil(totalAlerts / limit) || 1;

    return (
        <div className="panel" style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '24px', padding: '32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🔔</span> Kelola Radar &amp; Alerts Pengguna
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
                        Kontrol terpusat untuk memantau, menguji, dan mengaktifkan/menonaktifkan notifikasi Email &amp; WhatsApp ke masing-masing alert pengguna.
                    </p>
                </div>
                <button
                    onClick={fetchAlerts}
                    className="btn-secondary"
                    disabled={isLoading}
                    style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <span style={{ display: 'inline-block', transform: isLoading ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }}>🔄</span>
                    Refresh Data
                </button>
            </div>

            {/* Notification Banner */}
            {actionMsg && (
                <div style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                    color: actionMsg.type === 'success' ? '#34d399' : '#f87171'
                }}>
                    {actionMsg.text}
                </div>
            )}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Alerts</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginTop: '6px' }}>
                        {stats ? stats.total_alerts : '...'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Seluruh radar pengguna</div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Master</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#34d399', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span>{stats ? stats.active_alerts : 0} Aktif</span>
                        <span style={{ fontSize: '14px', color: '#f87171', fontWeight: '600' }}>/ {stats ? stats.inactive_alerts : 0} Dijeda</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Status operasional pemantauan</div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saluran Email</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#818cf8', marginTop: '6px' }}>
                        {stats ? stats.email_enabled : 0} <span style={{ fontSize: '13px', fontWeight: '600' }}>Aktif</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Menerima notifikasi email</div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saluran WhatsApp</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#34d399', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span>{stats ? stats.wa_enabled : 0} Aktif</span>
                        <span style={{ fontSize: '13px', color: '#60a5fa', fontWeight: '600' }}>({stats ? stats.wa_verified : 0} Terhubung)</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Menerima notifikasi WhatsApp</div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: '1 1 320px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                            type="text"
                            placeholder="Cari user email, kata kunci, instansi, atau no. WA..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 16px 10px 38px',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontSize: '13px'
                            }}
                        />
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px' }}>🔍</span>
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0 18px', borderRadius: '12px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        Cari
                    </button>
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                            className="btn-secondary"
                            style={{ padding: '0 14px', borderRadius: '12px', fontSize: '12px' }}
                        >
                            Reset
                        </button>
                    )}
                </form>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Filter:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        style={{
                            padding: '9px 16px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '13px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">Semua Status</option>
                        <option value="active">🟢 Master: Aktif</option>
                        <option value="inactive">⏸️ Master: Dijeda / Nonaktif</option>
                        <option value="email_disabled">✉️ Email Dimatikan</option>
                        <option value="wa_disabled">💬 WA Dimatikan</option>
                        <option value="wa_unverified">🟡 WA Belum Terverifikasi</option>
                    </select>
                </div>
            </div>

            {/* Alerts Table */}
            <div className="table-wrapper" style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <table className="tender-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(30, 41, 59, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700', width: '60px' }}>ID</th>
                            <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700' }}>Pengguna (Pemilik)</th>
                            <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700' }}>Kata Kunci &amp; Instansi</th>
                            <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700', textAlign: 'center' }}>Master Status</th>
                            <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700' }}>Penerima Email</th>
                            <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700' }}>Penerima WhatsApp</th>
                            <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700', textAlign: 'center' }}>Terkirim</th>
                            <th style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700', textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                    <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</div> Memuat daftar alerts...
                                </td>
                            </tr>
                        ) : alertsData.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                    Tidak ada data alert yang cocok dengan kriteria pencarian.
                                </td>
                            </tr>
                        ) : (
                            alertsData.map((alert) => {
                                const isMasterActive = Boolean(alert.is_active);
                                const isEmailActive = Boolean(alert.email_active);
                                const isWaActive = Boolean(alert.wa_active);
                                const isWaVerified = Boolean(alert.wa_verified);
                                const planBadge = alert.plan_type === 'premium' ? 'Premium' : 'Trial';
                                const planColor = alert.plan_type === 'premium' ? '#fbbf24' : '#60a5fa';

                                return (
                                    <tr
                                        key={alert.id}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            background: !isMasterActive ? 'rgba(239, 68, 68, 0.03)' : 'transparent',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        {/* ID */}
                                        <td style={{ padding: '14px 16px', color: '#64748b', fontWeight: '700' }}>
                                            #{alert.id}
                                        </td>

                                        {/* User Info */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontWeight: '600', color: '#ffffff' }}>{alert.user_email}</div>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: '700',
                                                    padding: '1px 7px',
                                                    borderRadius: '10px',
                                                    background: `${planColor}15`,
                                                    color: planColor,
                                                    border: `1px solid ${planColor}30`
                                                }}>
                                                    {planBadge}
                                                </span>
                                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                                    {new Date(alert.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Keyword & Instansi */}
                                        <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {alert.keyword && alert.keyword.split(',').map((k, kIdx) => (
                                                    <span
                                                        key={kIdx}
                                                        style={{
                                                            fontSize: '11px',
                                                            background: 'rgba(99, 102, 241, 0.15)',
                                                            color: '#c7d2fe',
                                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                                            padding: '2px 7px',
                                                            borderRadius: '5px',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        🔍 {k.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                            <div style={{ marginTop: '6px' }}>
                                                <span style={{
                                                    fontSize: '11px',
                                                    color: '#34d399',
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    border: '1px solid rgba(16, 185, 129, 0.25)',
                                                    padding: '2px 7px',
                                                    borderRadius: '4px'
                                                }}>
                                                    🏢 {getLpseNameBySlug ? getLpseNameBySlug(alert.instansi) : alert.instansi}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Master Toggle */}
                                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(alert.id, 'is_active', isMasterActive)}
                                                disabled={Boolean(togglingKeys[`${alert.id}_is_active`])}
                                                style={{
                                                    background: isMasterActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                    color: isMasterActive ? '#34d399' : '#f87171',
                                                    border: `1px solid ${isMasterActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                                                    padding: '5px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                                title="Klik untuk mengubah status aktif/nonaktif master alert"
                                            >
                                                <span>{isMasterActive ? '🟢 AKTIF' : '⏸️ DIJEDA'}</span>
                                            </button>
                                        </td>

                                        {/* Email Target & Toggle */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ color: '#e2e8f0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>✉️</span>
                                                <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {alert.email || '—'}
                                                </span>
                                            </div>
                                            <div style={{ marginTop: '6px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(alert.id, 'email_active', isEmailActive)}
                                                    disabled={Boolean(togglingKeys[`${alert.id}_email_active`])}
                                                    style={{
                                                        background: isEmailActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(148, 163, 184, 0.12)',
                                                        color: isEmailActive ? '#818cf8' : '#94a3b8',
                                                        border: `1px solid ${isEmailActive ? 'rgba(99, 102, 241, 0.35)' : 'rgba(148, 163, 184, 0.25)'}`,
                                                        padding: '2px 8px',
                                                        borderRadius: '6px',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    {isEmailActive ? '✅ Email ON' : '❌ Email OFF'}
                                                </button>
                                            </div>
                                        </td>

                                        {/* WhatsApp Target & Toggle */}
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ color: '#e2e8f0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>💬</span>
                                                <span>{alert.whatsapp || '—'}</span>
                                            </div>
                                            <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(alert.id, 'wa_active', isWaActive)}
                                                    disabled={Boolean(togglingKeys[`${alert.id}_wa_active`])}
                                                    style={{
                                                        background: isWaActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.12)',
                                                        color: isWaActive ? '#34d399' : '#94a3b8',
                                                        border: `1px solid ${isWaActive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(148, 163, 184, 0.25)'}`,
                                                        padding: '2px 8px',
                                                        borderRadius: '6px',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    {isWaActive ? '✅ WA ON' : '❌ WA OFF'}
                                                </button>

                                                {alert.whatsapp && (
                                                    <span style={{
                                                        fontSize: '10px',
                                                        fontWeight: '700',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        background: isWaVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                                        color: isWaVerified ? '#34d399' : '#fbbf24',
                                                        border: `1px solid ${isWaVerified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                                                    }}>
                                                        {isWaVerified ? '🟢 Terhubung' : '🟡 Unverified'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Sent Alerts Counter */}
                                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                background: alert.sent_count > 0 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.05)',
                                                color: alert.sent_count > 0 ? '#818cf8' : '#64748b',
                                                border: `1px solid ${alert.sent_count > 0 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.1)'}`
                                            }}>
                                                🎯 {alert.sent_count || 0}x
                                            </span>
                                        </td>

                                        {/* Action Buttons */}
                                        <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleTestAlert(alert.id)}
                                                    disabled={testingId === alert.id}
                                                    style={{
                                                        background: 'rgba(59, 130, 246, 0.15)',
                                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                                        color: '#60a5fa',
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                    title="Uji coba pengiriman pesan lelang dummy ke email dan WhatsApp alert ini"
                                                >
                                                    {testingId === alert.id ? '⏳ Menguji...' : '🧪 Uji Kirim'}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAlert(alert)}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.12)',
                                                        border: '1px solid rgba(239, 68, 68, 0.25)',
                                                        color: '#f87171',
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title="Hapus alert ini"
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: '#94a3b8', fontSize: '13px' }}>
                    <div>
                        Menampilkan {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalAlerts)} dari {totalAlerts} alerts
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="btn-secondary"
                            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px' }}
                        >
                            ◀ Sebelumnya
                        </button>
                        <span style={{ padding: '6px 12px', fontWeight: '700', color: '#fff' }}>
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="btn-secondary"
                            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px' }}
                        >
                            Selanjutnya ▶
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
