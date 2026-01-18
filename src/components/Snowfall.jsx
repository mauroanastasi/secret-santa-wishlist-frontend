import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import './Snowfall.css'

function Snowfall() {
    const { theme } = useTheme();
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Crea particelle diverse in base al tema
        if (theme === 'bebe') {
            // Tema bebè: niente particelle
            setParticles([]);
        } else if (theme === 'compleanno') {
            // Tema compleanno: coriandoli
            const confetti = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 8 + Math.random() * 4,
                size: 0.8 + Math.random() * 1.2,
                emoji: ['🎉', '🎊', '🎈', '🎀'][Math.floor(Math.random() * 4)]
            }));
            setParticles(confetti);
        } else {
            // Tema natale: neve
            const snowflakes = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 10 + Math.random() * 5,
                size: 1 + Math.random() * 1.5,
                emoji: '❄️'
            }));
            setParticles(snowflakes);
        }
    }, [theme]);

    return (
        <div className="snowfall-container">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className={`particle ${theme === 'compleanno' ? 'confetti' : 'snowflake'}`}
                    style={{
                        left: `${particle.left}%`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                        fontSize: `${particle.size}rem`
                    }}
                >
                    {particle.emoji}
                </div>
            ))}
        </div>
    );
}

export default Snowfall;
