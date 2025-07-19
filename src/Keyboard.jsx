import React from 'react';
import './Keyboard.css';

const rows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['Enter', ...'ZXCVBNM'.split(''), 'Back']
];

export default function Keyboard({ keyStatuses = {}, onKey }) {
    return (
        <div className="keyboard">
            {rows.map((row, i) => (
                <div className="row" key={i}>
                    {row.map((key) => (
                        <button
                            key={key}
                            className={`key ${keyStatuses[key] || ''}`}
                            onClick={() => onKey(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
} 