import React, { useState } from 'react';

export default function AdminLeadsManager({ leads, isLoadingLeads, fetchLeads, authFetch }) {
    const [selectedLead, setSelectedLead] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionMsg, setActionMsg] = useState(null);

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await authFetch(`/api/admin/contact-submissions/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setActionMsg({ type: 'success', text: `✅ Status prospek #${id} berhasil diubah ke ${status}.` });
                if (selectedLead && selectedLead.id === id) {
                    setSelectedLead(prev => ({ ...prev, status }));
                }
                fetchLeads();
            }
        } catch (err) {
            setActionMsg({ type: 'danger', text: '❌ Gagal mengubah status prospek.' });
        }
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm(`Yakin ingin menghapus data prospek #${id}?`)) return;
        try {
            const res = await authFetch(`/api/admin/contact-submissions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setActionMsg({ type: 'success', text: `✅ Prospek #${id} berhasil dihapus.` });
                if (selectedLead && selectedLead.id === id) {
                    setSelectedLead(null);
                }
                fetchLeads();
            }
        } catch (err) {
            setActionMsg({ type: 'danger', text: '❌ Gagal menghapus prospek.' });
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        const matchesSearch = !searchTerm ||
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm) ||
            (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            lead.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const countNew = leads.filter(l => l.status === 'new').length;
    const countContacted = leads.filter(l => l.status === 'contacted').length;
    const countArchive = leads.filter(l => l.status === 'archive').length;

    const getStatusBadge = (status) => {
        if (status === 'new') {
            return <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>🔴 BARU</span>;
        } else if (status === 'contacted') {
            return <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>🔵 DIHUBUNGI</span>;
        } else {
            return <span style={{ background: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', border: '1px solid rgba(107, 114, 128, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>⚪ ARSIP</span>;
        }
    };

    return (
        <div className="panel" style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '24px', padding: '32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📥</span> Manajer Prospek Chatbot (Leads)
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
                        Kelola data calon pelanggan yang masuk melalui percakapan Chatbot Asisten SPSE.
                    </p>
                </div>
                <button
                    onClick={fetchLeads}
                    className="btn-secondary"
                    style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '12px' }}
                >
                    🔄 Refresh Data
                </button>
            </div>

            {/* Alert Message */}
            {actionMsg && (
                <div className={`alert alert-${actionMsg.type}`} style={{ marginBottom: '20px', borderRadius: '12px' }}>
                    {actionMsg.text}
                </div>
            )}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Prospek</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>{leads.length}</div>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '16px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#f87171', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prospek Baru</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#f87171', marginTop: '4px' }}>{countNew}</div>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '16px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sudah Dihubungi</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#60a5fa', marginTop: '4px' }}>{countContacted}</div>
                </div>
                <div style={{ background: 'rgba(107, 114, 128, 0.1)', border: '1px solid rgba(107, 114, 128, 0.25)', borderRadius: '16px', padding: '16px 20px' }}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diarsipkan</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#9ca3af', marginTop: '4px' }}>{countArchive}</div>
                </div>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama, WhatsApp, email, atau isi pesan..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ flex: 1, minWidth: '240px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'new', 'contacted', 'archive'].map(st => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                background: statusFilter === st ? '#6366f1' : 'rgba(30, 41, 59, 0.8)',
                                color: statusFilter === st ? '#ffffff' : '#94a3b8',
                                textTransform: 'capitalize'
                            }}
                        >
                            {st === 'all' ? 'Semua' : st === 'new' ? 'Baru' : st === 'contacted' ? 'Dihubungi' : 'Arsip'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 400px' : '1fr', gap: '24px' }}>
                {/* Table Column */}
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    {isLoadingLeads ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Memuat data prospek...</div>
                    ) : filteredLeads.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                            {leads.length === 0 ? 'Belum ada prospek yang masuk dari Chatbot.' : 'Tidak ada prospek yang sesuai filter.'}
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(30, 41, 59, 0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                                        <th style={{ padding: '14px 16px' }}>Tanggal</th>
                                        <th style={{ padding: '14px 16px' }}>Nama</th>
                                        <th style={{ padding: '14px 16px' }}>WhatsApp</th>
                                        <th style={{ padding: '14px 16px' }}>Status</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            onClick={() => setSelectedLead(lead)}
                                            style={{
                                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                cursor: 'pointer',
                                                background: selectedLead && selectedLead.id === lead.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '12px' }}>
                                                {lead.created_at || '-'}
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#ffffff', fontWeight: '700' }}>
                                                {lead.name}
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>
                                                {lead.phone}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                {getStatusBadge(lead.status)}
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setSelectedLead(lead)}
                                                    style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#818cf8', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginRight: '6px' }}
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLead(lead.id)}
                                                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Detail Column */}
                {selectedLead && (
                    <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '16px', padding: '24px', height: 'fit-content' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#ffffff', fontWeight: '800' }}>Rincian Prospek</h3>
                            <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Nama Lengkap</span>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>{selectedLead.name}</div>
                            </div>

                            <div>
                                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Kontak</span>
                                <div style={{ marginTop: '4px', fontSize: '14px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div>📱 <strong>{selectedLead.phone}</strong></div>
                                    {selectedLead.email && <div>📧 {selectedLead.email}</div>}
                                </div>
                            </div>

                            <div>
                                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Isi Konsultasi / Pesan</span>
                                <div style={{ marginTop: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {selectedLead.message}
                                </div>
                            </div>

                            <div>
                                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', display: 'block', marginBottom: '8px' }}>Status Tindak Lanjut</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedLead.id, 'new')}
                                        style={{ flex: 1, padding: '8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(239, 68, 68, 0.4)', background: selectedLead.status === 'new' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)', color: '#ffffff', cursor: 'pointer' }}
                                    >
                                        Baru
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedLead.id, 'contacted')}
                                        style={{ flex: 1, padding: '8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(59, 130, 246, 0.4)', background: selectedLead.status === 'contacted' ? '#3b82f6' : 'rgba(59, 130, 246, 0.15)', color: '#ffffff', cursor: 'pointer' }}
                                    >
                                        Dihubungi
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedLead.id, 'archive')}
                                        style={{ flex: 1, padding: '8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(107, 114, 128, 0.4)', background: selectedLead.status === 'archive' ? '#6b7280' : 'rgba(107, 114, 128, 0.15)', color: '#ffffff', cursor: 'pointer' }}
                                    >
                                        Arsip
                                    </button>
                                </div>
                            </div>

                            <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                <a
                                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                        `Halo ${selectedLead.name}, terima kasih telah menghubungi Spy SPSE. Menindaklanjuti konsultasi Anda mengenai:\n\n"${selectedLead.message}"`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        color: '#ffffff',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)'
                                    }}
                                >
                                    💬 Hubungi via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
