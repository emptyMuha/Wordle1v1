import { VALID_WORDS } from './validWords.js';

export function pickRandomWord(wordList = VALID_WORDS) {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

// Returns array of statuses: 'correct', 'present', 'absent'
export function checkGuess(guess, answer) {
    const result = Array(5).fill('absent');
    const answerArr = answer.split('');
    const guessArr = guess.split('');
    const used = Array(5).fill(false);

    // First pass: correct
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === answerArr[i]) {
            result[i] = 'correct';
            used[i] = true;
            answerArr[i] = null;
        }
    }
    // Second pass: present
    for (let i = 0; i < 5; i++) {
        if (result[i] === 'correct') continue;
        const idx = answerArr.indexOf(guessArr[i]);
        if (idx !== -1 && !used[idx]) {
            result[i] = 'present';
            used[idx] = true;
            answerArr[idx] = null;
        }
    }
    return result;
} 