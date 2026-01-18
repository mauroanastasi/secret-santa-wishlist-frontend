import { useEffect, useState } from 'react'
import './Snowfall.css'

function Snowfall() {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // Crea 30 fiocchi di neve iniziali
        const initialSnowflakes = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 10 + Math.random() * 5,
            size: 1 + Math.random() * 1.5
        }));
        setSnowflakes(initialSnowflakes);
    }, []);

    return (
        <div className="snowfall-container">
            {snowflakes.map(flake => (
                <div
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: `${flake.left}%`,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                        fontSize: `${flake.size}rem`
                    }}
                >
                    ❄️
                </div>
            ))}
        </div>
    );
}

export default Snowfall;
