import React, { useState, useEffect, useRef } from 'react';

function extractName(input) {
    if (!input || typeof input !== 'string') return "";
    let name = input.trim();

    // 1. Remove common greetings & fillers at the beginning
    const greetings = [
        /^(hallo juga|halo juga|hai juga|hi juga|hei juga|hey juga)\b/i,
        /^(selamat pagi|selamat siang|selamat sore|selamat malam)\b/i,
        /^(assalamu'alaikum|assalamualaikum|assalamu\s+alaikum)\b/i,
        /^(hallo|halo|hai|hi|hei|hey)\b/i
    ];

    for (const regex of greetings) {
        name = name.replace(regex, "").trim();
    }

    // 2. Remove salutations & callouts at start
    const salutations = /^(min|admin|kak|kakak|kaka|gan|agan|sis|sist|sista|bos|boss|mas|mbak|pak|bapak|bu|ibu)\b[,.\s:-]*/i;
    name = name.replace(salutations, "").trim();

    // 3. Remove common name prefixes (ordered from most specific to shortest)
    const prefixes = [
        /^(nama\s+saya\s+adalah|nama\s+ku\s+adalah|namaku\s+adalah)\s*[:=-]?\s*/i,
        /^(nama\s+saya|nama\s+ku|namaku|nama\s+sy|nama\s+gua|nama\s+gw|nama\s+aku|nama)\s*[:=-]?\s*/i,
        /^(bisa\s+panggil\s+saya|bisa\s+panggil|panggil\s+saya|panggil\s+aja|panggil\s+ak|panggil\s+gw|panggil)\s*[:=-]?\s*/i,
        /^(disini\s+dengan|di\s+sini\s+dengan|saya\s+dengan|dengan\s+saya|dengan)\s*[:=-]?\s*/i,
        /^(saya\s+adalah|aku\s+adalah|saya|aku|sy|ak|gw|gua)\s*[:=-]?\s*/i
    ];

    for (const regex of prefixes) {
        if (regex.test(name)) {
            name = name.replace(regex, "").trim();
            break;
        }
    }

    // 4. Remove trailing salutations/fillers
    const suffixes = /[\s,.-]+(aja|ya|kak|kakak|min|admin|gan|bos|bapak|ibu|pak|bu)$/i;
    name = name.replace(suffixes, "").trim();

    // 5. Clean non-alphanumeric punctuation
    name = name.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "").trim();

    if (!name) return input.trim();

    // Capitalize first letter of each word
    return name.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

function checkSmartFAQ(text) {
    const q = text.toLowerCase();
    
    // Check pricing / trial / cost
    if (/(harga|biaya|bayar|tarif|paket|trial|gratis|sewa|berlangganan)/i.test(q)) {
        return "Layanan Spy SPSE menyediakan Akses Trial 7 Hari Bebas Risiko! Setelah masa trial, kami memiliki paket berlangganan fleksibel & terjangkau untuk pemantauan tender LPSE 24/7 otomatis.";
    }
    // Check features / how it works
    if (/(cara kerja|fitur|apa ini|apa itu|kegunaan|fungsi|gimana)/i.test(q)) {
        return "Spy SPSE adalah platform cerdas pemantau tender LPSE. Sistem kami meng-crawl 100+ LPSE instansi secara 24/7 real-time dan langsung memberi notifikasi WhatsApp/Email saat tender baru yang sesuai kata kunci bisnis Anda tayang!";
    }
    // Check LPSE covered
    if (/(lpse mana|instansi|wilayah|daerah|lokasi|kabupaten|provinsi)/i.test(q)) {
        return "Spy SPSE memantau 100+ LPSE instansi pusat & daerah (seperti LKPP, Kementerian PU, DKI Jakarta, Jawa Barat, Jawa Timur, Medan, Makassar, dll).";
    }
    // Check human contact
    if (/(wa|whatsapp|kontak|telepon|hubungi|admin|human|cs)/i.test(q)) {
        return "Anda bisa langsung terhubung ke tim sales & teknis WhatsApp kami setelah mengisi info singkat di chatbot ini ya.";
    }

    return null;
}

export default function Chatbot({ adminSettings }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isFloatingMinimized, setIsFloatingMinimized] = useState(false);
    const [step, setStep] = useState(0); // 0: Greeting, 1: Name, 2: Phone, 3: Email, 4: Reason, 5: Done
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Captured Leads Data
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [reason, setReason] = useState("");
    const [prefillReason, setPrefillReason] = useState("");

    // Message Edit States (WhatsApp Style)
    const [editingMsgId, setEditingMsgId] = useState(null);
    const [editingText, setEditingText] = useState("");

    const chatEndRef = useRef(null);

    const botName = adminSettings?.chatbot_name || "Nadia";
    const botAvatar = adminSettings?.chatbot_avatar || null;
    const isBotActive = adminSettings?.chatbot_active !== "false";

    // Save edited message and sync chatbot state
    const handleSaveEdit = (targetMsg) => {
        const trimmed = editingText.trim();
        if (!trimmed) return;

        setMessages(prev => {
            const nextMsgs = [...prev];
            const msgIdx = nextMsgs.findIndex(m => m.id === targetMsg.id);
            if (msgIdx === -1) return prev;

            // Update user message text & isEdited flag
            nextMsgs[msgIdx] = {
                ...nextMsgs[msgIdx],
                text: trimmed,
                isEdited: true
            };

            const stepRef = targetMsg.stepRef;

            // Step 1: User edited Name
            if (stepRef === 1) {
                const newExtractedName = extractName(trimmed);
                setName(newExtractedName);

                // Update subsequent bot message asking for phone (if exists)
                if (msgIdx + 1 < nextMsgs.length && nextMsgs[msgIdx + 1].type === "bot") {
                    const phoneAskText = adminSettings?.chatbot_ask_phone_message || "Boleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)";
                    nextMsgs[msgIdx + 1] = {
                        ...nextMsgs[msgIdx + 1],
                        text: `Halo ${newExtractedName}! ${phoneAskText}`
                    };
                }
            }
            // Step 2: User edited Phone
            else if (stepRef === 2) {
                const cleanedPhone = trimmed.replace(/[^0-9]/g, "");
                let formattedPhone = cleanedPhone;
                if (formattedPhone.startsWith("62")) {
                    formattedPhone = "0" + formattedPhone.slice(2);
                }
                setPhone(formattedPhone);
            }
            // Step 3: User edited Email
            else if (stepRef === 3) {
                setEmail(trimmed);
            }
            // Step 4: User edited Reason
            else if (stepRef === 4) {
                setReason(trimmed);
            }

            return nextMsgs;
        });

        setEditingMsgId(null);
        setEditingText("");
    };

    // Listen to open_chatbot custom event
    useEffect(() => {
        const handleOpen = (e) => {
            const customEvent = e;
            const reasonVal = customEvent.detail?.reason || "";
            if (reasonVal) {
                setPrefillReason(reasonVal);
            }
            setIsOpen(true);
        };
        window.addEventListener("open_chatbot", handleOpen);
        return () => window.removeEventListener("open_chatbot", handleOpen);
    }, []);

    // Autofill user input when step becomes 4 if prefillReason exists
    useEffect(() => {
        if (step === 4 && prefillReason) {
            setUserInput(prefillReason);
        }
    }, [step, prefillReason]);

    // Initial Bot Greeting on Chat Open
    useEffect(() => {
        if (isOpen && isBotActive && messages.length === 0) {
            setIsTyping(true);
            const timer = setTimeout(() => {
                const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const greetingText = adminSettings?.chatbot_initial_greeting ||
                    "Halo! Perlu bantuan atau mau lihat demo singkat pemantauan tender dari kami? 😊";
                setMessages([
                    {
                        id: "greeting",
                        type: "bot",
                        text: greetingText,
                        time: timeStr
                    }
                ]);
                setIsTyping(false);
                setStep(1); // Ready to ask for Name next
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isBotActive, messages, adminSettings]);

    // Prompt Name question right after initial greeting
    useEffect(() => {
        if (step === 1 && messages.length === 1 && messages[0].type === "bot") {
            setIsTyping(true);
            const timer = setTimeout(() => {
                const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setMessages(prev => [
                    ...prev,
                    {
                        id: "ask_name",
                        type: "bot",
                        text: adminSettings?.chatbot_ask_name_message || "Boleh tahu siapa nama Anda?",
                        time: timeStr
                    }
                ]);
                setIsTyping(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [step, messages, adminSettings]);

    // Auto-scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    if (!isBotActive) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const input = userInput.trim();
        setUserInput("");
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add user message with stepRef for editing capability
        setMessages(prev => [
            ...prev,
            {
                id: Math.random().toString(),
                type: "user",
                text: input,
                time: timeStr,
                stepRef: step,
                isEdited: false
            }
        ]);

        setIsTyping(true);

        // Check if user is asking a question instead of answering the step
        const faqAnswer = checkSmartFAQ(input);

        // Step 1: User entered Name
        if (step === 1) {
            // If user asked a question (e.g. "harga berapa?", "apa ini?") and didn't mention name prefix
            if (faqAnswer && input.length > 7 && !/^(nama|panggil|saya|aku|sy|namaku)/i.test(input)) {
                setTimeout(() => {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Math.random().toString(),
                            type: "bot",
                            text: `${faqAnswer}\n\nOya, boleh tahu siapa nama Anda agar kami bisa menyapa Anda dengan baik?`,
                            time: timeStr
                        }
                    ]);
                    setIsTyping(false);
                }, 800);
                return;
            }

            if (input.length < 2) {
                setTimeout(() => {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Math.random().toString(),
                            type: "bot",
                            text: "Maaf, namanya sepertinya terlalu pendek. Boleh tuliskan nama lengkap Anda?",
                            time: timeStr
                        }
                    ]);
                    setIsTyping(false);
                }, 800);
                return;
            }

            const extractedName = extractName(input);
            setName(extractedName);
            setStep(2);

            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: Math.random().toString(),
                        type: "bot",
                        text: `Halo ${extractedName}! ${adminSettings?.chatbot_ask_phone_message || "Boleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)"}`,
                        time: timeStr
                    }
                ]);
                setIsTyping(false);
            }, 1000);
        }
        // Step 2: User entered Phone
        else if (step === 2) {
            const cleanedPhone = input.replace(/[^0-9]/g, "");
            
            // Check FAQ during Phone step if user didn't enter a phone number
            if (faqAnswer && cleanedPhone.length < 5) {
                setTimeout(() => {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Math.random().toString(),
                            type: "bot",
                            text: `${faqAnswer}\n\nBoleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)`,
                            time: timeStr
                        }
                    ]);
                    setIsTyping(false);
                }, 800);
                return;
            }

            if (cleanedPhone.length < 9 || cleanedPhone.length > 15) {
                setTimeout(() => {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Math.random().toString(),
                            type: "bot",
                            text: "Maaf, sepertinya format nomor WhatsApp Anda kurang tepat. Mohon masukkan nomor yang valid ya (contoh: 08123456789)",
                            time: timeStr
                        }
                    ]);
                    setIsTyping(false);
                }, 800);
                return;
            }

            // Normalize 628... or 08...
            let formattedPhone = cleanedPhone;
            if (formattedPhone.startsWith("62")) {
                formattedPhone = "0" + formattedPhone.slice(2);
            }

            setPhone(formattedPhone);
            setStep(3);

            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: Math.random().toString(),
                        type: "bot",
                        text: adminSettings?.chatbot_ask_email_message || "Bisa infokan juga alamat email Anda? (Ketik '-' atau 'skip' jika tidak ada)",
                        time: timeStr
                    }
                ]);
                setIsTyping(false);
            }, 1000);
        }
        // Step 3: User entered Email
        else if (step === 3) {
            const lowerInput = input.toLowerCase();

            // Allow user to skip email
            if (["tidak ada", "gaada", "gak punya", "gak ada", "skip", "lewat", "-", "tidak"].some(k => lowerInput.includes(k))) {
                setEmail("-");
                setStep(4);

                setTimeout(() => {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Math.random().toString(),
                            type: "bot",
                            text: adminSettings?.chatbot_ask_reason_message || "Baik, tidak masalah! Silakan ceritakan apa yang ingin Anda tanyakan atau konsultasikan mengenai pemantauan tender LPSE?",
                            time: timeStr
                        }
                    ]);
                    setIsTyping(false);
                }, 1000);
                return;
            }

            // Check FAQ during Email step if user asked a question
            if (faqAnswer && !input.includes("@")) {
                setTimeout(() => {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Math.random().toString(),
                            type: "bot",
                            text: `${faqAnswer}\n\nBisa infokan alamat email Anda? (Ketik '-' atau 'skip' jika tidak ada)`,
                            time: timeStr
                        }
                    ]);
                    setIsTyping(false);
                }, 800);
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input)) {
                setTimeout(() => {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Math.random().toString(),
                            type: "bot",
                            text: "Ups! Format emailnya sepertinya kurang tepat. Mohon masukkan alamat email yang benar ya (contoh: nama@perusahaan.com), atau ketik 'skip' jika tidak ada.",
                            time: timeStr
                        }
                    ]);
                    setIsTyping(false);
                }, 800);
                return;
            }

            setEmail(input);
            setStep(4);

            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: Math.random().toString(),
                        type: "bot",
                        text: adminSettings?.chatbot_ask_reason_message || "Terima kasih! Silakan ceritakan apa yang ingin Anda tanyakan atau konsultasikan mengenai pemantauan tender LPSE?",
                        time: timeStr
                    }
                ]);
                setIsTyping(false);
            }, 1000);
        }
        // Step 4: User entered Reason/Message
        else if (step === 4) {
            if (input.length < 5) {
                setTimeout(() => {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Math.random().toString(),
                            type: "bot",
                            text: "Bisa diceritakan sedikit lebih detail lagi alasannya? Agar kami bisa membantu Anda dengan lebih baik.",
                            time: timeStr
                        }
                    ]);
                    setIsTyping(false);
                }, 800);
                return;
            }

            setReason(input);
            setStep(5);

            // Save lead to backend database
            try {
                await fetch("/api/public/contact-submissions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        email: email,
                        message: input
                    })
                });
            } catch (err) {
                console.error("Failed to save lead:", err);
            }

            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        id: Math.random().toString(),
                        type: "bot",
                        text: adminSettings?.chatbot_final_message || "Terima kasih! Informasi Anda sudah kami simpan. Silakan klik tombol di bawah untuk langsung terhubung dengan tim teknis kami di WhatsApp.",
                        time: timeStr
                    }
                ]);
                setIsTyping(false);
            }, 1200);
        }
    };

    const handleWhatsAppRedirect = () => {
        const waPhone = adminSettings?.contact_whatsapp
            ? adminSettings.contact_whatsapp.replace(/[^0-9]/g, "")
            : "6281234567890";
        const appName = adminSettings?.app_name || "Spy SPSE";
        const waText = encodeURIComponent(
            `Halo Tim ${appName}, saya *${name}*.\n\n*Saya ingin berkonsultasi mengenai pemantauan tender LPSE:*\n${reason}\n\n*Kontak Saya:*\n- No. WA: ${phone}\n- Email: ${email}`
        );
        window.open(`https://wa.me/${waPhone}?text=${waText}`, "_blank");
    };

    return (
        <div className="spy-chatbot-container">
            {/* Chat Window */}
            {isOpen && (
                <div className="spy-chatbot-window">
                    {/* Header - DishFlo / MasterUPVC Style Dark Teal */}
                    <div style={{
                        background: '#0d5c4d',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: '#ffffff'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                background: '#094036',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                color: '#ffffff',
                                fontWeight: '800',
                                fontSize: '15px',
                                flexShrink: 0
                            }}>
                                {botAvatar ? (
                                    <img src={botAvatar} alt={botName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span>{botName.slice(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>{botName}</h4>
                                <div style={{ fontSize: '11px', color: '#a7f3d0', marginTop: '2px', fontWeight: '500' }}>
                                    Balasan dalam 1 menit
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.8)',
                                cursor: 'pointer',
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Area - Light WhatsApp Pattern Wallpaper */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
                        backgroundBlendMode: 'overlay',
                        backgroundColor: 'rgba(232, 228, 222, 0.75)' // Warm WhatsApp light background
                    }}>
                        {messages.map((msg) => {
                            const isBot = msg.type === "bot";
                            const isEditing = editingMsgId === msg.id;

                            return (
                                <div
                                    key={msg.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: isBot ? 'flex-start' : 'flex-end'
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '85%',
                                        borderRadius: '16px',
                                        borderTopLeftRadius: isBot ? '2px' : '16px',
                                        borderTopRightRadius: isBot ? '16px' : '2px',
                                        padding: '10px 14px',
                                        fontSize: '13px',
                                        lineHeight: '1.5',
                                        background: isBot ? '#ffffff' : '#dcf8c6', // Bot = White, User = WhatsApp Light Green
                                        color: '#1f2937',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
                                    }}>
                                        {isEditing ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
                                                <textarea
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px 10px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #0d5c4d',
                                                        fontSize: '13px',
                                                        outline: 'none',
                                                        resize: 'none',
                                                        minHeight: '44px',
                                                        fontFamily: 'inherit',
                                                        background: '#ffffff',
                                                        boxSizing: 'border-box'
                                                    }}
                                                    autoFocus
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingMsgId(null)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid #9ca3af',
                                                            color: '#4b5563',
                                                            borderRadius: '12px',
                                                            padding: '3px 10px',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Batal
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveEdit(msg)}
                                                        style={{
                                                            background: '#0d5c4d',
                                                            border: 'none',
                                                            color: '#ffffff',
                                                            borderRadius: '12px',
                                                            padding: '3px 12px',
                                                            fontSize: '11px',
                                                            fontWeight: '700',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Simpan ✓
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                                                    <p style={{ margin: 0, whiteSpace: 'pre-line', flex: 1 }}>{msg.text}</p>
                                                    {!isBot && (
                                                        <button
                                                            onClick={() => { setEditingMsgId(msg.id); setEditingText(msg.text); }}
                                                            title="Edit pesan (seperti WhatsApp)"
                                                            style={{
                                                                width: '22px',
                                                                height: '22px',
                                                                padding: 0,
                                                                background: 'rgba(255, 255, 255, 0.85)',
                                                                border: '1px solid rgba(13, 92, 77, 0.35)',
                                                                borderRadius: '5px',
                                                                color: '#0d5c4d',
                                                                cursor: 'pointer',
                                                                fontSize: '11px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                                                                transition: 'all 0.2s ease',
                                                                marginLeft: '4px',
                                                                flexShrink: 0,
                                                                lineHeight: 1
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = '#ffffff';
                                                                e.currentTarget.style.borderColor = '#0d5c4d';
                                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                                                                e.currentTarget.style.borderColor = 'rgba(13, 92, 77, 0.35)';
                                                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
                                                            }}
                                                        >
                                                            ✏️
                                                        </button>
                                                    )}
                                                </div>
                                                <span style={{
                                                    display: 'block',
                                                    fontSize: '9px',
                                                    textAlign: 'right',
                                                    marginTop: '4px',
                                                    color: isBot ? '#9ca3af' : '#6b7280'
                                                }}>
                                                    {msg.time} {msg.isEdited && <strong style={{ color: '#0d5c4d', marginLeft: '4px' }}>• Diedit</strong>}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    background: '#ffffff',
                                    color: '#6b7280',
                                    borderRadius: '16px',
                                    borderTopLeftRadius: '2px',
                                    padding: '10px 14px',
                                    fontSize: '12px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <span>{botName} sedang mengetik...</span>
                                </div>
                            </div>
                        )}

                        {/* Final WhatsApp Button */}
                        {step === 5 && !isTyping && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                <button
                                    onClick={handleWhatsAppRedirect}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: '#25d366',
                                        color: '#ffffff',
                                        padding: '12px 20px',
                                        borderRadius: '24px',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    💬 Hubungi Tim via WhatsApp
                                </button>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Footer Input */}
                    {step < 5 && (
                        <form onSubmit={handleSend} style={{
                            padding: '12px 14px',
                            background: '#ffffff',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <input
                                type={step === 2 ? "tel" : step === 3 ? "email" : "text"}
                                placeholder={
                                    step === 1 ? "Tuliskan nama Anda..." :
                                    step === 2 ? "Tuliskan nomor WhatsApp..." :
                                    step === 3 ? "Tuliskan alamat email..." :
                                    "Tuliskan Pesan Anda..."
                                }
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    borderRadius: '20px',
                                    background: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    color: '#1f2937',
                                    fontSize: '13px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!userInput.trim()}
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: userInput.trim() ? '#0d5c4d' : '#e5e7eb',
                                    color: '#ffffff',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: userInput.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '16px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ➤
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Floating Trigger Button - DishFlo / MasterUPVC Style with Close Action */}
            {!isOpen && (
                isFloatingMinimized ? (
                    <button
                        onClick={() => { setIsOpen(true); setIsFloatingMinimized(false); }}
                        style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: '#25d366',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            boxShadow: '0 10px 25px rgba(37, 211, 102, 0.4)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        title="WhatsApp Kami"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.603 6.042L0 24l6.102-1.602a11.834 11.834 0 005.944 1.602h.005c6.634 0 12.048-5.414 12.048-12.05 0-3.219-1.253-6.241-3.53-8.513z" />
                        </svg>
                    </button>
                ) : (
                    <div
                        onClick={() => setIsOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: '#ffffff',
                            padding: '10px 14px 10px 10px',
                            borderRadius: '40px',
                            border: '1px solid #f3f4f6',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: '#25d366',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '22px',
                            boxShadow: '0 4px 10px rgba(37, 211, 102, 0.3)',
                            flexShrink: 0
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.603 6.042L0 24l6.102-1.602a11.834 11.834 0 005.944 1.602h.005c6.634 0 12.048-5.414 12.048-12.05 0-3.219-1.253-6.241-3.53-8.513z" />
                            </svg>
                        </div>
                        <div style={{ textAlign: 'left', paddingRight: '4px' }}>
                            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>BUTUH BANTUAN?</div>
                            <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '800', lineHeight: '1' }}>WhatsApp Kami</div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsFloatingMinimized(true);
                            }}
                            title="Sembunyikan Label"
                            style={{
                                background: 'rgba(0, 0, 0, 0.06)',
                                border: 'none',
                                color: '#9ca3af',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '11px',
                                lineHeight: '1',
                                marginLeft: '2px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )
            )}
        </div>
    );
}
