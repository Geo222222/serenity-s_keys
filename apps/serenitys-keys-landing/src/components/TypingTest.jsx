import React, { useEffect, useMemo, useRef, useState } from "react";
import { WORDS } from "../utils/words";

const pickWords = (count) => {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return out;
};

const clamp = (value, lower, upper) => Math.max(lower, Math.min(upper, value));

const calcMetrics = ({ correctChars, totalKeystrokes, secondsElapsed }) => {
  const minutes = Math.max(secondsElapsed, 1) / 60;
  const wpm = Math.floor((correctChars / 5) / minutes);
  const accuracy = totalKeystrokes
    ? Math.round((correctChars / totalKeystrokes) * 100)
    : 100;
  return { wpm, accuracy };
};

export default function TypingTest({
  durationOptions = [15, 30, 60],
  defaultDuration = 30,
  targetWordCount = 220,
}) {
  const [duration, setDuration] = useState(defaultDuration);
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [words, setWords] = useState(() => pickWords(targetWordCount));
  const [wordIndex, setWordIndex] = useState(0);

  const [correctChars, setCorrectChars] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);

  const [currentInput, setCurrentInput] = useState("");

  const focusTrapRef = useRef(null);
  const tickRef = useRef(null);

  const secondsElapsed = useMemo(() => duration - timeLeft, [duration, timeLeft]);

  const { wpm, accuracy } = useMemo(
    () => calcMetrics({ correctChars, totalKeystrokes, secondsElapsed }),
    [correctChars, totalKeystrokes, secondsElapsed],
  );

  const cleanupTimer = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const reset = (nextDuration = duration) => {
    cleanupTimer();
    setStarted(false);
    setFinished(false);
    setTimeLeft(nextDuration);
    setWords(pickWords(targetWordCount));
    setWordIndex(0);
    setCorrectChars(0);
    setTotalKeystrokes(0);
    setErrors(0);
    setCurrentInput("");
    requestAnimationFrame(() => focusTrapRef.current?.focus());
  };

  useEffect(() => () => cleanupTimer(), []);

  useEffect(() => {
    if (!started) {
      return () => {};
    }

    cleanupTimer();
    tickRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          cleanupTimer();
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => cleanupTimer();
  }, [started]);

  useEffect(() => {
    if (finished) {
      cleanupTimer();
    }
  }, [finished]);

  const handleChange = (event) => {
    const value = event.target.value;
    if (!started) {
      setStarted(true);
    }

    const targetWord = `${words[wordIndex] ?? ""} `;
    const safeValue = value.slice(0, targetWord.length + 5);

    const previousLength = currentInput.length;
    setCurrentInput(safeValue);

    const delta = Math.abs(safeValue.length - previousLength);
    if (delta > 0) {
      setTotalKeystrokes((prev) => prev + delta);
    }

    if (safeValue.endsWith(" ")) {
      const typed = safeValue.slice(0, -1);
      const target = words[wordIndex] ?? "";

      const perCharCorrect = Array.from(target).reduce(
        (accumulator, character, index) =>
          accumulator + (typed[index] === character ? 1 : 0),
        0,
      );

      const extra = Math.max(typed.length - target.length, 0);
      const missed = target.length - perCharCorrect;
      const wordCorrectChars = clamp(perCharCorrect, 0, target.length);

      setCorrectChars((prev) => prev + wordCorrectChars);
      setErrors((prev) => prev + missed + extra);

      setWordIndex((prev) => prev + 1);
      setCurrentInput("");
      return;
    }
  };

  const handleDurationChange = (event) => {
    const nextDuration = Number(event.target.value);
    setDuration(nextDuration);
    setTimeLeft(nextDuration);
    reset(nextDuration);
  };

  const progressPct = duration > 0
    ? Math.round(((duration - timeLeft) / duration) * 100)
    : 0;

  const displayWords = useMemo(() => {
    const start = Math.max(wordIndex - 10, 0);
    const end = Math.min(wordIndex + 50, words.length);
    return words.slice(start, end).map((word, index) => ({
      word,
      absoluteIndex: index + start,
    }));
  }, [wordIndex, words]);

  return (
    <section>
      <div className="container">
        <div className="section-label">Try it</div>
        <h1 className="section-title">Typing Playground</h1>
        <p className="section-subtitle" style={{ maxWidth: 760 }}>
          A simple test for parents and kids. Type the words below for {duration}s.
          We'll measure <strong>WPM</strong> and <strong>Accuracy</strong>. Accuracy beats speed.
        </p>

        <div className="card typing-controls">
          <label htmlFor="typing-duration"><strong>Test length:</strong></label>
          <select
            id="typing-duration"
            value={duration}
            onChange={handleDurationChange}
          >
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {option}s
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>
            Restart
          </button>
        </div>

        <div className="card typing-stats">
          <Stat label="wpm" value={wpm} />
          <Stat label="acc" value={`${accuracy}%`} />
          <Stat label="errors" value={errors} />
          <Stat label="time" value={`${timeLeft}s`} />
          <div className="typing-progress">
            <div className="typing-progress__bar" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="card typing-pad">
          <div className="typing-field" onClick={() => focusTrapRef.current?.focus()}>
            {displayWords.map(({ word, absoluteIndex }) => {
              const isCurrent = absoluteIndex === wordIndex;
              return (
                <Word
                  key={`${absoluteIndex}-${word}`}
                  word={word}
                  typed={isCurrent ? currentInput : null}
                  isCurrent={isCurrent}
                />
              );
            })}
          </div>

          <input
            ref={focusTrapRef}
            value={currentInput}
            onChange={handleChange}
            disabled={finished || timeLeft === 0}
            placeholder={started ? "" : "Click here and start typing..."}
            className="typing-input-trap"
          />
          {!started && (
            <button
              type="button"
              className="btn btn-primary typing-start"
              onClick={() => focusTrapRef.current?.focus()}
            >
              Click to begin
            </button>
          )}
        </div>

        {finished && (
          <div className="card typing-summary">
            <h3>Session summary</h3>
            <ul className="pricing-list">
              <li><strong>WPM:</strong> {wpm}</li>
              <li><strong>Accuracy:</strong> {accuracy}%</li>
              <li><strong>Correct characters:</strong> {correctChars}</li>
              <li><strong>Total keystrokes:</strong> {totalKeystrokes}</li>
            </ul>
            <p className="typing-tip">
              Tip: focus on accuracy first; speed follows. Kids can try {duration}s at a time with breaks.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="typing-stat">
      <div className="typing-stat__label">{label}</div>
      <div className="typing-stat__value">{value}</div>
    </div>
  );
}

function Word({ word, typed, isCurrent }) {
  if (!isCurrent) {
    return <span className="typing-word">{word}</span>;
  }

  const chars = Array.from(word);
  const typedChars = Array.from(typed ?? "");

  return (
    <span className="typing-word typing-word--current">
      {chars.map((character, index) => {
        const typedChar = typedChars[index];
        let className = "typing-char";
        if (typedChar != null) {
          className += typedChar === character
            ? " typing-char--correct"
            : " typing-char--incorrect";
        }
        return (
          <span key={index} className={className}>
            {character}
          </span>
        );
      })}
      {typedChars.length > chars.length && (
        <span className="typing-char typing-char--incorrect">
          {typedChars.slice(chars.length).join("")}
        </span>
      )}
      <span className="typing-caret" />
    </span>
  );
}
