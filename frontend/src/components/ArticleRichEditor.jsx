import React, { useState, useRef, useEffect } from 'react';

/**
 * ArticleRichEditor
 * Custom Built-in Rich Text Editor Ala CKEditor (100% Open Source & Gratis Selamanya)
 * Mendukung formatting visual, HTML Source Code mode, sisip {lpse_name},
 * serta modal sisipkan gambar dengan Alt Text SEO Google & Keterangan Foto.
 */
export default function ArticleRichEditor({ value = '', onChange, placeholder = 'Tulis konten artikel di sini...' }) {
    const editorRef = useRef(null);
    const savedRangeRef = useRef(null);
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [currentFormat, setCurrentFormat] = useState('p');

    // Image Modal State
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imgSourceTab, setImgSourceTab] = useState('upload'); // 'upload' | 'url'
    const [imgUrl, setImgUrl] = useState('');
    const [imgAlt, setImgAlt] = useState('');
    const [imgCaption, setImgCaption] = useState('');
    const [imgAlign, setImgAlign] = useState('center'); // 'center' | 'left' | 'right'
    const [isUploadingImg, setIsUploadingImg] = useState(false);
    const [imgUploadError, setImgUploadError] = useState(null);

    // Link Modal State
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [linkNewTab, setLinkNewTab] = useState(true);

    // Sync external value changes into the contentEditable div (e.g., when editing different article)
    useEffect(() => {
        if (editorRef.current && !isSourceMode) {
            if (editorRef.current.innerHTML !== (value || '')) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value, isSourceMode]);

    // Save active cursor/selection
    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
            savedRangeRef.current = sel.getRangeAt(0).cloneRange();
        }
    };

    // Restore saved cursor/selection
    const restoreSelection = () => {
        if (savedRangeRef.current) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRangeRef.current);
        } else if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    // Execute standard document command
    const execCmd = (command, val = null) => {
        if (isSourceMode) return;
        restoreSelection();
        document.execCommand(command, false, val);
        if (editorRef.current) {
            editorRef.current.focus();
            if (onChange) onChange(editorRef.current.innerHTML);
        }
        saveSelection();
    };

    // Insert raw HTML string at cursor
    const insertHtmlAtCursor = (html) => {
        if (isSourceMode) {
            // In source mode, append or insert at cursor in textarea
            if (onChange) onChange((value || '') + '\n' + html);
            return;
        }

        restoreSelection();
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const frag = document.createDocumentFragment();
            let node, lastNode;
            while ((node = tempDiv.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if (editorRef.current) {
            editorRef.current.innerHTML += html;
        }

        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
        }
        saveSelection();
    };

    // Format Block change (p, h2, h3, h4)
    const handleFormatChange = (e) => {
        const tag = e.target.value;
        setCurrentFormat(tag);
        execCmd('formatBlock', `<${tag}>`);
    };

    // Handle Image Upload to backend
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingImg(true);
        setImgUploadError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('user_token');
            const res = await fetch('/api/admin/articles/upload', {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setImgUrl(data.url);
                if (!imgAlt) {
                    // Pre-fill alt text with clean filename
                    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                    setImgAlt(baseName.replace(/[_-]/g, ' '));
                }
            } else {
                setImgUploadError(data.detail || 'Gagal mengunggah gambar ke server.');
            }
        } catch (err) {
            setImgUploadError('Terjadi kesalahan jaringan saat mengunggah gambar.');
        } finally {
            setIsUploadingImg(false);
        }
    };

    // Insert Image into Editor Body
    const handleInsertImage = () => {
        if (!imgUrl.trim()) {
            setImgUploadError('Harap tentukan URL gambar atau unggah file foto.');
            return;
        }

        const altText = (imgAlt || 'Foto Konten Artikel').replace(/"/g, '&quot;');
        const alignStyle = imgAlign === 'center' ? 'text-align: center;' : (imgAlign === 'right' ? 'text-align: right;' : 'text-align: left;');
        const captionHtml = imgCaption.trim()
            ? `<figcaption style="font-size: 13px; color: #9ca3af; margin-top: 8px; font-style: italic; text-align: center;">${imgCaption.trim()}</figcaption>`
            : '';

        const imageHtml = `
<figure style="${alignStyle} margin: 24px 0;">
  <img src="${imgUrl.trim()}" alt="${altText}" title="${altText}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 12px; display: inline-block; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);" />
  ${captionHtml}
</figure>
<p><br></p>
`.trim();

        insertHtmlAtCursor(imageHtml);

        // Reset & Close Modal
        setIsImageModalOpen(false);
        setImgUrl('');
        setImgAlt('');
        setImgCaption('');
        setImgAlign('center');
        setImgUploadError(null);
    };

    // Insert Link into Editor Body
    const handleInsertLink = () => {
        if (!linkUrl.trim()) return;
        const textToUse = linkText.trim() || linkUrl.trim();
        const targetAttr = linkNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        const linkHtml = `<a href="${linkUrl.trim()}" ${targetAttr} style="color: #818cf8; text-decoration: underline;">${textToUse}</a>`;

        insertHtmlAtCursor(linkHtml);

        setIsLinkModalOpen(false);
        setLinkUrl('');
        setLinkText('');
    };

    return (
        <div className="ck-custom-editor">
            {/* Toolbar */}
            <div className="ck-custom-toolbar">
                {/* Format Dropdown */}
                <select
                    className="ck-tool-select"
                    value={currentFormat}
                    onChange={handleFormatChange}
                    disabled={isSourceMode}
                    title="Pilih Format Paragraf / Heading"
                >
                    <option value="p">Paragraph (Normal)</option>
                    <option value="h2">Subjudul (H2)</option>
                    <option value="h3">Subtopik (H3)</option>
                    <option value="h4">Sorotan (H4)</option>
                </select>

                <div className="ck-tool-divider" />

                {/* Bold */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('bold')}
                    disabled={isSourceMode}
                    title="Tebal (Ctrl+B)"
                >
                    <strong>B</strong>
                </button>

                {/* Italic */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('italic')}
                    disabled={isSourceMode}
                    title="Miring (Ctrl+I)"
                >
                    <em>I</em>
                </button>

                {/* Underline */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('underline')}
                    disabled={isSourceMode}
                    title="Garis Bawah (Ctrl+U)"
                >
                    <u>U</u>
                </button>

                {/* Strikethrough */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('strikeThrough')}
                    disabled={isSourceMode}
                    title="Coret"
                >
                    <s>S</s>
                </button>

                <div className="ck-tool-divider" />

                {/* Alignments */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('justifyLeft')}
                    disabled={isSourceMode}
                    title="Rata Kiri"
                >
                    ⇤
                </button>
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('justifyCenter')}
                    disabled={isSourceMode}
                    title="Rata Tengah"
                >
                    ⇥⇤
                </button>
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('justifyRight')}
                    disabled={isSourceMode}
                    title="Rata Kanan"
                >
                    ⇥
                </button>
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('justifyFull')}
                    disabled={isSourceMode}
                    title="Rata Kanan Kiri"
                >
                    ≡
                </button>

                <div className="ck-tool-divider" />

                {/* Lists */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('insertUnorderedList')}
                    disabled={isSourceMode}
                    title="Daftar Poin (Bullet List)"
                >
                    • List
                </button>
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('insertOrderedList')}
                    disabled={isSourceMode}
                    title="Daftar Angka (Numbered List)"
                >
                    1. List
                </button>

                {/* Blockquote */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('formatBlock', '<blockquote>')}
                    disabled={isSourceMode}
                    title="Kutipan (Quote)"
                >
                    ❝ Kutipan
                </button>

                {/* Horizontal Rule */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('insertHorizontalRule')}
                    disabled={isSourceMode}
                    title="Garis Pemisah (<hr>)"
                >
                    ― Garis
                </button>

                <div className="ck-tool-divider" />

                {/* Insert Link Button */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => {
                        saveSelection();
                        const sel = window.getSelection();
                        setLinkText(sel ? sel.toString() : '');
                        setIsLinkModalOpen(true);
                    }}
                    disabled={isSourceMode}
                    title="Sisipkan Tautan / Link"
                >
                    🔗 Link
                </button>

                {/* Insert Image Button (with Alt Text SEO) */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', borderColor: 'rgba(99, 102, 241, 0.3)' }}
                    onClick={() => {
                        saveSelection();
                        setIsImageModalOpen(true);
                    }}
                    disabled={isSourceMode}
                    title="Sisipkan Foto / Gambar ke Konten (Upload/Link & Alt SEO)"
                >
                    🖼️ Gambar (SEO)
                </button>

                <div className="ck-tool-divider" />

                {/* Special Helper: Insert {lpse_name} placeholder */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => insertHtmlAtCursor(' <strong>{lpse_name}</strong> ')}
                    title="Sisipkan Tag Dinamis Nama LPSE {lpse_name}"
                    style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)', fontWeight: '600' }}
                >
                    🏛️ +&#123;lpse_name&#125;
                </button>

                {/* Clear Format */}
                <button
                    type="button"
                    className="ck-tool-btn"
                    onClick={() => execCmd('removeFormat')}
                    disabled={isSourceMode}
                    title="Hapus Pemformatan Teks"
                >
                    🧹 Bersihkan
                </button>

                {/* Toggle Source HTML Mode */}
                <button
                    type="button"
                    className={`ck-tool-btn ${isSourceMode ? 'active' : ''}`}
                    style={{ marginLeft: 'auto', fontWeight: 'bold' }}
                    onClick={() => {
                        if (!isSourceMode && editorRef.current) {
                            if (onChange) onChange(editorRef.current.innerHTML);
                        }
                        setIsSourceMode(!isSourceMode);
                    }}
                    title="Beralih ke Mode Edit Kode HTML Mentah (Source Code)"
                >
                    {isSourceMode ? '👁️ Tampilan Visual' : '💻 </> HTML Source'}
                </button>
            </div>

            {/* Editor Body */}
            {isSourceMode ? (
                <textarea
                    className="form-control"
                    value={value || ''}
                    onChange={(e) => {
                        if (onChange) onChange(e.target.value);
                    }}
                    style={{
                        minHeight: '380px',
                        background: '#040711',
                        color: '#38bdf8',
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        padding: '16px',
                        border: 'none',
                        borderRadius: 0,
                        resize: 'vertical'
                    }}
                    placeholder="<!-- Edit kode HTML mentah di sini -->"
                />
            ) : (
                <div
                    ref={editorRef}
                    className="ck-editor-canvas"
                    contentEditable
                    data-placeholder={placeholder}
                    onInput={() => {
                        if (editorRef.current && onChange) {
                            onChange(editorRef.current.innerHTML);
                        }
                    }}
                    onBlur={() => {
                        saveSelection();
                        if (editorRef.current && onChange) {
                            onChange(editorRef.current.innerHTML);
                        }
                    }}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                />
            )}

            {/* MODAL: Sisipkan Gambar (Upload / Link & Alt Text SEO) */}
            {isImageModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '520px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>🖼️</span> Sisipkan Foto ke Dalam Konten
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsImageModalOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Tab Selection */}
                            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '4px' }}>
                                <button
                                    type="button"
                                    onClick={() => setImgSourceTab('upload')}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        background: imgSourceTab === 'upload' ? '#4f46e5' : 'transparent',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    📤 Upload dari Perangkat
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImgSourceTab('url')}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        background: imgSourceTab === 'url' ? '#4f46e5' : 'transparent',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    🔗 Link URL Gambar
                                </button>
                            </div>

                            {/* Source Input */}
                            {imgSourceTab === 'upload' ? (
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                                        Pilih File Gambar (JPG, PNG, WebP, GIF)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        id="modal-article-img-upload"
                                        style={{ display: 'none' }}
                                    />
                                    <label
                                        htmlFor="modal-article-img-upload"
                                        className="btn-primary"
                                        style={{
                                            display: 'block',
                                            textAlign: 'center',
                                            padding: '12px',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            background: isUploadingImg ? '#312e81' : undefined
                                        }}
                                    >
                                        {isUploadingImg ? '⏳ Sedang Mengunggah Gambar...' : '📂 Klik untuk Pilih Gambar'}
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                                        Alamat URL Gambar (Direct Link)
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://example.com/images/foto-tender.jpg"
                                        value={imgUrl}
                                        onChange={(e) => setImgUrl(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Image Preview if available */}
                            {imgUrl && (
                                <div style={{
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    maxHeight: '140px',
                                    background: '#040711',
                                    textAlign: 'center'
                                }}>
                                    <img src={imgUrl} alt="Preview" style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }} />
                                </div>
                            )}

                            {/* Error Message */}
                            {imgUploadError && (
                                <div style={{ color: '#f87171', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    ⚠️ {imgUploadError}
                                </div>
                            )}

                            {/* Alt Text (SEO Google Image Search) */}
                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                                    <span>🏷️ Teks Alt (SEO Google Images) <strong style={{ color: '#38bdf8' }}>*Sangat Dianjurkan</strong></span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Contoh: Infografis Alur Penilaian Tender Konstruksi LPSE"
                                    value={imgAlt}
                                    onChange={(e) => setImgAlt(e.target.value)}
                                />
                                <small style={{ color: '#94a3b8', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                                    💡 Robot Google membaca teks ini agar gambar Anda muncul di pencarian Google Images.
                                </small>
                            </div>

                            {/* Caption / Keterangan */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                                    📝 Keterangan Foto / Sumber (Opsional)
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Contoh: Dok. Humas LKPP / Data SPSE 2026"
                                    value={imgCaption}
                                    onChange={(e) => setImgCaption(e.target.value)}
                                />
                            </div>

                            {/* Alignment */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                                    📐 Posisi Perataan Gambar
                                </label>
                                <select
                                    className="form-control"
                                    value={imgAlign}
                                    onChange={(e) => setImgAlign(e.target.value)}
                                >
                                    <option value="center">Rata Tengah (Center)</option>
                                    <option value="left">Rata Kiri (Left)</option>
                                    <option value="right">Rata Kanan (Right)</option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            <button
                                type="button"
                                onClick={() => setIsImageModalOpen(false)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#cbd5e1',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleInsertImage}
                                disabled={isUploadingImg || !imgUrl}
                                style={{
                                    background: '#4f46e5',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    cursor: (isUploadingImg || !imgUrl) ? 'not-allowed' : 'pointer',
                                    opacity: (isUploadingImg || !imgUrl) ? 0.6 : 1,
                                    fontSize: '13px',
                                    fontWeight: '600'
                                }}
                            >
                                ✅ Sisipkan ke Artikel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Sisipkan Link */}
            {isLinkModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '460px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>🔗 Sisipkan Tautan / Link</h3>
                            <button
                                type="button"
                                onClick={() => setIsLinkModalOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                                    URL Tujuan
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="https://spyspse.com/... atau https://lkpp.go.id/..."
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                                    Teks Tautan (Anchor Text)
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Contoh: Baca Pengumuman Resmi LKPP"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9', fontSize: '13px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={linkNewTab}
                                    onChange={(e) => setLinkNewTab(e.target.checked)}
                                />
                                <span>Buka di tab baru (target="_blank")</span>
                            </label>
                        </div>
                        <div style={{
                            padding: '16px 20px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            <button
                                type="button"
                                onClick={() => setIsLinkModalOpen(false)}
                                style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleInsertLink}
                                disabled={!linkUrl.trim()}
                                style={{ background: '#4f46e5', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                            >
                                Sisipkan Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
