import React, { useRef } from 'react';
import './Keyboard.css';

const rows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['Enter', ...'ZXCVBNM'.split(''), 'Back']
];

export default function Keyboard({ keyStatuses = {}, onKey }) {
    // Track which keys are animating
    const keyRefs = useRef({});

    const handleKeyClick = (key) => {
        const btn = keyRefs.current[key];
        if (btn) {
            btn.classList.remove('key-pressed');
            // Force reflow to restart animation
            void btn.offsetWidth;
            btn.classList.add('key-pressed');
            setTimeout(() => {
                btn.classList.remove('key-pressed');
            }, 90);
            // Remove focus after click to prevent :focus/:active styling
            btn.blur();
        }
        onKey(key);
    };

    return (
        <div className="keyboard">
            {rows.map((row, i) => (
                <div className="row" key={i}>
                    {row.map((key) => (
                        <button
                            key={key}
                            ref={el => keyRefs.current[key] = el}
                            className={`key${keyStatuses[key] ? ' ' + keyStatuses[key] : ''}`}
                            onClick={() => handleKeyClick(key)}
                            tabIndex={0}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
} 