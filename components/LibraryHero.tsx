import React from "react";

const steps = [
  {
    number: 1,
    title: "Upload PDF",
    description: "Add your book file",
  },
  {
    number: 2,
    title: "AI Processing",
    description: "We analyze the content",
  },
  {
    number: 3,
    title: "Voice Chat",
    description: "Discuss with AI",
  },
];

export default function LibraryHero() {
  return (
    <section className="library-hero-wrapper pt-28 mb-10 md:mb-16">
      <div className="library-hero-card">
        {/* Left – Heading, description, button */}
        <div className="hero-left">
          <h1 className="hero-heading">Your Library</h1>
          <p className="hero-description">
            Convert your books into interactive AI conversations. Listen, learn,
            and discuss your favorite reads.
          </p>
          <button className="hero-button">
            <span className="hero-button-icon">+</span>
            Add new book
          </button>
        </div>

        {/* Center – Vintage illustration */}
        <div className="hero-center">
          <VintageIllustration />
        </div>

        {/* Right – Steps card */}
        <div className="hero-right">
          <div className="steps-card">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="step-item">
                  <div className="step-number">{step.number}</div>
                  <div className="step-text">
                    <span className="step-title">{step.title}</span>
                    <span className="step-desc">{step.description}</span>
                  </div>
                </div>
                {idx < steps.length - 1 && <div className="step-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600&display=swap');

        .library-hero-wrapper {
          font-family: 'Source Sans 3', sans-serif;
          padding: 2rem;
          background: #f5f0e8;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .library-hero-card {
          background: #ebdbb5;
          border-radius: 20px;
          padding: 3rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          max-width: 1200px;
          width: 100%;
          box-shadow: 0 4px 24px rgba(120, 90, 40, 0.08);
        }

        /* ── LEFT ── */
        .hero-left {
          flex: 0 0 220px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .hero-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #1a1209;
          line-height: 1.1;
          margin: 0;
        }

        .hero-description {
          font-size: 0.95rem;
          color: #6b5740;
          line-height: 1.55;
          margin: 0;
        }

        .hero-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.4rem;
          background: #ffffff;
          color: #1a1209;
          border: none;
          border-radius: 10px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
          box-shadow: 0 2px 8px rgba(120, 90, 40, 0.12);
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }

        .hero-button:hover {
          box-shadow: 0 4px 16px rgba(120, 90, 40, 0.2);
          transform: translateY(-1px);
        }

        .hero-button-icon {
          font-size: 1.2rem;
          line-height: 1;
          color: #7a6040;
        }

        /* ── CENTER ── */
        .hero-center {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .hero-center svg {
          width: 100%;
          max-width: 320px;
          height: auto;
          filter: drop-shadow(0 8px 24px rgba(100, 70, 20, 0.15));
        }

        /* ── RIGHT ── */
        .hero-right {
          flex: 0 0 200px;
        }

        .steps-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 1.2rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          box-shadow: 0 2px 12px rgba(120, 90, 40, 0.10);
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.7rem 0;
        }

        .step-number {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid #d4c4a0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: #5a4530;
          flex-shrink: 0;
        }

        .step-text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .step-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a1209;
          line-height: 1.2;
        }

        .step-desc {
          font-size: 0.78rem;
          color: #8a7060;
          line-height: 1.3;
        }

        .step-divider {
          height: 1px;
          background: #ece4d4;
          margin: 0 0.1rem;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .library-hero-card {
            flex-direction: column;
            padding: 2rem 1.5rem;
          }
          .hero-left, .hero-right {
            flex: unset;
            width: 100%;
          }
          .hero-center svg {
            max-width: 240px;
          }
        }
      `}</style>
    </section>
  );
}

/* ── SVG Illustration ── */
function VintageIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ── Open Book (base) ── */}
      <g>
        {/* Left page */}
        <ellipse
          cx="116"
          cy="242"
          rx="78"
          ry="10"
          fill="#c8a96e"
          opacity="0.3"
        />
        <path
          d="M40 220 Q80 210 116 212 L116 250 Q80 248 40 255 Z"
          fill="#e8d5a8"
          stroke="#b89050"
          strokeWidth="1"
        />
        <path
          d="M40 220 Q80 210 116 212"
          fill="none"
          stroke="#b89050"
          strokeWidth="1.5"
        />
        {/* Right page */}
        <path
          d="M116 212 Q152 210 192 220 L192 255 Q152 248 116 250 Z"
          fill="#f0e0b8"
          stroke="#b89050"
          strokeWidth="1"
        />
        <path
          d="M116 212 Q152 210 192 220"
          fill="none"
          stroke="#b89050"
          strokeWidth="1.5"
        />
        {/* Spine */}
        <line
          x1="116"
          y1="212"
          x2="116"
          y2="250"
          stroke="#8a6030"
          strokeWidth="2"
        />
        {/* Text lines on left page */}
        <line
          x1="55"
          y1="228"
          x2="108"
          y2="225"
          stroke="#c8a060"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="55"
          y1="233"
          x2="108"
          y2="230"
          stroke="#c8a060"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="55"
          y1="238"
          x2="108"
          y2="235"
          stroke="#c8a060"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="55"
          y1="243"
          x2="100"
          y2="240"
          stroke="#c8a060"
          strokeWidth="0.8"
          opacity="0.7"
        />
        {/* Text lines on right page */}
        <line
          x1="124"
          y1="225"
          x2="178"
          y2="228"
          stroke="#c8a060"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="124"
          y1="230"
          x2="178"
          y2="233"
          stroke="#c8a060"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="124"
          y1="235"
          x2="178"
          y2="238"
          stroke="#c8a060"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <line
          x1="124"
          y1="240"
          x2="172"
          y2="243"
          stroke="#c8a060"
          strokeWidth="0.8"
          opacity="0.7"
        />
        {/* Bookmark ribbon */}
        <polygon
          points="112,212 118,212 116,222"
          fill="#c0392b"
          opacity="0.8"
        />
      </g>

      {/* ── Stack of closed books ── */}
      {/* Book 3 (bottom, tallest) – dark brown */}
      <g>
        <rect x="58" y="145" width="22" height="72" rx="2" fill="#5c3317" />
        <rect x="58" y="145" width="4" height="72" rx="1" fill="#7a4520" />
        <rect x="60" y="150" width="18" height="62" fill="#6b3d1e" />
        {/* Decoration lines */}
        <line
          x1="62"
          y1="158"
          x2="76"
          y2="158"
          stroke="#9a6030"
          strokeWidth="0.7"
        />
        <line
          x1="62"
          y1="200"
          x2="76"
          y2="200"
          stroke="#9a6030"
          strokeWidth="0.7"
        />
      </g>
      {/* Book 2 – reddish-brown */}
      <g>
        <rect x="80" y="155" width="20" height="62" rx="2" fill="#7a2010" />
        <rect x="80" y="155" width="4" height="62" rx="1" fill="#952818" />
        <rect x="82" y="160" width="16" height="52" fill="#8a2814" />
        <line
          x1="84"
          y1="168"
          x2="96"
          y2="168"
          stroke="#c04030"
          strokeWidth="0.7"
        />
        <line
          x1="84"
          y1="200"
          x2="96"
          y2="200"
          stroke="#c04030"
          strokeWidth="0.7"
        />
      </g>
      {/* Book 1 – olive/tan *)  */}
      <g>
        <rect x="100" y="160" width="18" height="57" rx="2" fill="#6b6030" />
        <rect x="100" y="160" width="4" height="57" rx="1" fill="#7a7035" />
        <rect x="102" y="165" width="14" height="47" fill="#787540" />
        <line
          x1="104"
          y1="172"
          x2="114"
          y2="172"
          stroke="#a8a050"
          strokeWidth="0.7"
        />
        <line
          x1="104"
          y1="200"
          x2="114"
          y2="200"
          stroke="#a8a050"
          strokeWidth="0.7"
        />
      </g>

      {/* ── Globe ── */}
      <g transform="translate(170, 80)">
        {/* Globe base pole */}
        <rect x="23" y="110" width="4" height="30" fill="#8a7040" />
        <ellipse cx="25" cy="142" rx="18" ry="5" fill="#7a6030" />
        {/* Globe sphere */}
        <circle
          cx="25"
          cy="72"
          r="58"
          fill="#d4e8f0"
          stroke="#8aacb8"
          strokeWidth="1.5"
        />
        {/* Meridians */}
        <ellipse
          cx="25"
          cy="72"
          rx="18"
          ry="58"
          fill="none"
          stroke="#8aacb8"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <ellipse
          cx="25"
          cy="72"
          rx="40"
          ry="58"
          fill="none"
          stroke="#8aacb8"
          strokeWidth="0.8"
          opacity="0.6"
        />
        {/* Parallels */}
        <ellipse
          cx="25"
          cy="45"
          rx="52"
          ry="10"
          fill="none"
          stroke="#8aacb8"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <ellipse
          cx="25"
          cy="72"
          rx="58"
          ry="10"
          fill="none"
          stroke="#8aacb8"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <ellipse
          cx="25"
          cy="99"
          rx="52"
          ry="10"
          fill="none"
          stroke="#8aacb8"
          strokeWidth="0.8"
          opacity="0.6"
        />
        {/* Landmasses – simplified */}
        <path
          d="M-5 55 Q5 45 20 50 Q30 52 35 60 Q28 68 15 65 Q0 62 -5 55Z"
          fill="#8aaa70"
          opacity="0.7"
        />
        <path
          d="M30 48 Q45 40 60 50 Q65 60 55 68 Q42 72 32 65 Q26 58 30 48Z"
          fill="#8aaa70"
          opacity="0.7"
        />
        <path
          d="M-18 78 Q-5 72 10 76 Q18 82 12 90 Q0 94 -12 88 Q-20 83 -18 78Z"
          fill="#8aaa70"
          opacity="0.7"
        />
        <path
          d="M20 82 Q35 78 45 86 Q48 94 38 98 Q25 100 18 93 Q15 87 20 82Z"
          fill="#8aaa70"
          opacity="0.7"
        />
        {/* Globe sheen */}
        <circle cx="5" cy="52" r="12" fill="white" opacity="0.15" />
        {/* Globe stand ring */}
        <ellipse
          cx="25"
          cy="130"
          rx="28"
          ry="7"
          fill="none"
          stroke="#8a7040"
          strokeWidth="2"
        />
        <path
          d="M-3 130 Q25 118 53 130"
          fill="none"
          stroke="#8a7040"
          strokeWidth="2"
        />
      </g>

      {/* ── Desk Lamp ── */}
      <g>
        {/* Base */}
        <ellipse cx="252" cy="248" rx="22" ry="5" fill="#7a6a40" />
        {/* Pole */}
        <rect x="249" y="165" width="6" height="82" rx="3" fill="#8a7845" />
        {/* Arm joint */}
        <circle cx="252" cy="165" r="5" fill="#9a8850" />
        {/* Curved arm */}
        <path
          d="M252 165 Q268 148 255 128"
          fill="none"
          stroke="#8a7845"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Lamp shade */}
        <path d="M240 115 L270 115 L264 132 L246 132 Z" fill="#b8a060" />
        <path d="M240 115 L270 115" stroke="#9a8040" strokeWidth="1.5" />
        <path d="M246 132 L264 132" stroke="#9a8040" strokeWidth="1.5" />
        {/* Bulb glow */}
        <ellipse
          cx="255"
          cy="128"
          rx="14"
          ry="6"
          fill="#ffe080"
          opacity="0.3"
        />
        <ellipse
          cx="255"
          cy="128"
          rx="8"
          ry="4"
          fill="#ffe080"
          opacity="0.25"
        />
        {/* Light cone on books */}
        <path
          d="M246 132 Q200 200 160 240 Q220 220 265 190 Z"
          fill="#ffe080"
          opacity="0.06"
        />
      </g>

      {/* ── Shadow under whole scene ── */}
      <ellipse
        cx="148"
        cy="265"
        rx="130"
        ry="8"
        fill="#a08040"
        opacity="0.12"
      />
    </svg>
  );
}
