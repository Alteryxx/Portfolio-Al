import { useState, useEffect, useRef } from "react";

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#";
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.resolve = () => {};
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

const ScrambledTitle = ({ texts, delay = 2000 }) => {
  const elementRef = useRef(null);
  const scramblerRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (elementRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current);
    }
  }, []);

  useEffect(() => {
    if (scramblerRef.current && texts.length > 0) {
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(texts[index]).then(() => {
            setTimeout(() => {
              setIndex((prevIndex) => (prevIndex + 1) % texts.length); // Loop back to the first word
            }, delay);
          });
        }
      };
      next();
    }
  }, [index, texts, delay]);

  return (
    <h1 ref={elementRef} className="hero-title">
      {texts[0]}
    </h1>
  );
};

export default ScrambledTitle;
