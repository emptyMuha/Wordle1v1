import React from 'react';
import './WordleGrid.css';

export default function WordleGrid({ guesses, statuses }) {
    return (
        <div className="wordle-grid">
            {Array.from({ length: 6 }).map((_, rowIdx) => (
                <div className="row" key={rowIdx}>
                    {Array.from({ length: 5 }).map((_, colIdx) => {
                        const letter = guesses[rowIdx]?.[colIdx] || '';
                        const status = statuses[rowIdx]?.[colIdx] || '';
                        return (
                            <div className={`cell ${status}`} key={colIdx}>
                                {letter.toUpperCase()}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
} 