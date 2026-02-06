import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('impact'); // impact, stabilize, exit

    useEffect(() => {
        const timer1 = setTimeout(() => setPhase('stabilize'), 1200);
        const timer2 = setTimeout(() => setPhase('exit'), 2800);
        const timer3 = setTimeout(onComplete, 3500); // Intro lasts 3.5s

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    if (phase === 'exit') {
        return (
            <div className="splash-container" style={{
                transition: 'opacity 0.7s ease',
                opacity: 0,
                pointerEvents: 'none'
            }}>
                {/* Fade out state */}
            </div>
        );
    }

    return (
        <div className="splash-container">
            {/* Background Atmosphere */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at center, #1a0b2e 0%, #000000 70%)',
                opacity: 0.8
            }}></div>

            {/* Animated Void Rings */}
            <div className="void-ring" style={{ animationDelay: '0s' }}></div>
            <div className="void-ring" style={{ animationDelay: '0.2s', borderColor: '#FF0080' }}></div>
            <div className="void-ring" style={{ animationDelay: '0.4s', borderColor: '#7928CA' }}></div>

            {/* Central Energy Slash */}
            <div className="energy-line"></div>

            {/* Main Logo Container */}
            <div className="impact-logo" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
            }}>
                {/* Logo Icon */}
                <div style={{
                    width: '100px', height: '100px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #7928CA, #FF0080)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 60px rgba(121, 40, 202, 0.6)',
                    position: 'relative'
                }}>
                    {/* Inner Glitch Border */}
                    <div style={{
                        position: 'absolute', inset: '-2px', borderRadius: '26px',
                        background: 'linear-gradient(45deg, #00e5ff, #ff0080, #7928CA)',
                        zIndex: -1, opacity: 0.7,
                        filter: 'blur(10px)'
                    }}></div>

                    <span style={{ fontSize: '60px', fontWeight: '900', color: 'white', fontFamily: 'sans-serif' }}>W</span>
                </div>

                {/* Text Reveal */}
                <div style={{ textAlign: 'center', overflow: 'hidden' }}>
                    <h1 style={{
                        fontSize: '42px', fontWeight: '900', color: 'white',
                        letterSpacing: '4px', textTransform: 'uppercase',
                        margin: 0, fontFamily: 'sans-serif',
                        animation: 'glitch-text 3s infinite alternate-reverse'
                    }}>
                        Work<span style={{ color: '#EC4899' }}>Station</span>
                    </h1>
                    <p style={{
                        color: '#00e5ff', fontSize: '12px', letterSpacing: '8px',
                        textTransform: 'uppercase', marginTop: '10px',
                        opacity: phase === 'stabilize' ? 1 : 0,
                        transform: phase === 'stabilize' ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s ease'
                    }}>
                        Secure Environment
                    </p>
                </div>
            </div>

            {/* Scanlines Overlay for Anime Vibe */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))',
                backgroundSize: '100% 4px',
                pointerEvents: 'none',
                opacity: 0.3
            }}></div>
        </div>
    );
};

export default SplashScreen;
