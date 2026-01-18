import { useTheme } from '../context/ThemeContext';
import { themes } from '../config/themes';
import './ThemeSelector.css';

function ThemeSelector({ isOpen, onClose }) {
    const { theme, setTheme } = useTheme();

    if (!isOpen) return null;

    return (
        <div className="theme-modal-overlay" onClick={onClose}>
            <div className="theme-modal" onClick={(e) => e.stopPropagation()}>
                <div className="theme-modal-header">
                    <h2>Scegli un tema</h2>
                    <button className="theme-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="theme-modal-content">
                    {Object.entries(themes).map(([key, themeData]) => (
                        <button
                            key={key}
                            className={`theme-option ${theme === key ? 'active' : ''}`}
                            style={{
                                background: `linear-gradient(135deg, ${themeData.gradientStart}, ${themeData.gradientEnd})`,
                            }}
                            onClick={() => {
                                setTheme(key);
                                onClose();
                            }}
                        >
                            <span className="theme-emoji">{themeData.emoji}</span>
                            <span className="theme-name">{themeData.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ThemeSelector;
