import { useState, useEffect } from 'react';

export default function DemoNotice() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem('yoli_demo_notice_seen');
        if (!seen) {
            // Small delay so it doesn't flash immediately on load
            const t = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(t);
        }
    }, []);

    const dismiss = () => {
        localStorage.setItem('yoli_demo_notice_seen', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <span style={styles.icon}>🛠️</span>
                <p style={styles.message}>
                    This is demo data — we're adding real data soon!
                </p>
                <button onClick={dismiss} style={styles.closeBtn} aria-label="Dismiss">✕</button>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        animation: 'demoSlideUp 0.4s ease',
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(30, 20, 60, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: '14px',
        padding: '14px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        maxWidth: '420px',
        width: 'max-content',
    },
    icon: {
        fontSize: '18px',
        flexShrink: 0,
    },
    message: {
        margin: 0,
        color: '#e2d9f3',
        fontSize: '14px',
        lineHeight: '1.4',
        fontFamily: 'inherit',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#a78bfa',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '0 4px',
        flexShrink: 0,
        lineHeight: 1,
    },
};
