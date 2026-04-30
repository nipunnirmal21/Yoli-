import { useState, useEffect } from 'react';

export default function DemoNotice() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem('yoli_demo_notice_seen');
        if (!seen) {
            const t = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(t);
        }
    }, []);

    const dismiss = () => {
        localStorage.setItem('yoli_demo_notice_seen', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={dismiss}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    zIndex: 9998,
                    animation: 'fadeIn 0.3s ease',
                }}
            />

            {/* Modal card */}
            <div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                background: '#fff',
                borderRadius: '20px',
                padding: '36px 32px 28px',
                width: '90%', maxWidth: '420px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
                textAlign: 'center',
                animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
                {/* Icon */}
                <div style={{
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px',
                    fontSize: '28px',
                }}>
                    🛠️
                </div>

                <h2 style={{
                    fontSize: '20px', fontWeight: '700',
                    color: '#1a1a2e', marginBottom: '10px',
                    fontFamily: 'inherit',
                }}>
                    Demo Data
                </h2>

                <p style={{
                    fontSize: '15px', color: '#555',
                    lineHeight: '1.6', marginBottom: '24px',
                    fontFamily: 'inherit',
                }}>
                    This is demo data — we are adding real data.
                </p>

                <button
                    onClick={dismiss}
                    style={{
                        background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 36px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        width: '100%',
                        transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.88'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                >
                    Got it!
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; } to { opacity: 1; }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: translate(-50%, -48%) scale(0.88); }
                    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `}</style>
        </>
    );
}
