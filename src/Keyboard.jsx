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
        if (keyRefs.current[key]) {
            keyRefs.current[key].classList.remove('key-pressed');
            // Force reflow to restart animation
            void keyRefs.current[key].offsetWidth;
        }
        keyRefs.current[key]?.classList.add('key-pressed');
        setTimeout(() => {
            keyRefs.current[key]?.classList.remove('key-pressed');
        }, 100);
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
                            className={`key ${keyStatuses[key] || ''}`}
                            onClick={() => handleKeyClick(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
} 