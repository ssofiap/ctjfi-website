"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  texts: string[];
  prefix?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdDuration?: number;
  className?: string;
};

export default function Typewriter({
  texts,
  prefix = "",
  typeSpeed = 70,
  deleteSpeed = 100,
  holdDuration = 1500,
  className = "",
}: TypewriterProps) {
  const validTexts = texts.filter((text) => text.length > 0);
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (validTexts.length === 0) {
      return undefined;
    }

    const currentText = validTexts[textIndex % validTexts.length];
    const isComplete = displayText === currentText;
    const isEmpty = displayText.length === 0;
    const delay = isDeleting
      ? deleteSpeed
      : isComplete
        ? holdDuration
        : typeSpeed;

    const timeout = window.setTimeout(() => {
      if (isDeleting) {
        setDisplayText((text) => text.slice(0, -1));

        if (isEmpty) {
          setIsDeleting(false);
          setTextIndex((index) => (index + 1) % validTexts.length);
        }
      } else if (isComplete) {
        if (validTexts.length > 1) {
          setIsDeleting(true);
        }
      } else {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [
    deleteSpeed,
    displayText,
    holdDuration,
    isDeleting,
    textIndex,
    typeSpeed,
    validTexts,
  ]);

  if (validTexts.length === 0) {
    return null;
  }

  return (
    <span className={className} aria-live="polite">
      {prefix}
      <span>{displayText}</span>
      <span className="typewriter-cursor" aria-hidden="true">
        _
      </span>
    </span>
  );
}
