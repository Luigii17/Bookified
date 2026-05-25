import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBookBySlug } from "@/lib/actions/book.actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) redirect("/");

  const { title, author, coverURL, persona } = result.data;

  return (
    <main
      className="book-page-container"
      style={{
        minHeight: "100vh",
        background: "#F5ECD7",
        padding: "6rem 1rem 3rem",
        fontFamily: "'Lora', Georgia, serif",
      }}
    >
      {/* Floating back button */}
      <Link
        href="/"
        className="back-btn-floating"
        style={{
          position: "fixed",
          top: "6rem",
          left: "1.5rem",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#fff",
          border: "1px solid #E2D5C3",
          boxShadow: "0 2px 12px rgba(100,60,20,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          transition: "box-shadow 0.15s, transform 0.15s",
          textDecoration: "none",
          color: "#3D2010",
        }}
        aria-label="Go back"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* ── Header card ── */}
        <div
          className="vapi-header-card"
          style={{
            background: "#f3e4c7",
            borderRadius: "16px",
            padding: "1.75rem",
            display: "flex",
            alignItems: "center",
            gap: "1.75rem",
          }}
        >
          {/* Cover + mic button */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: "120px",
                height: "160px",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(80,40,10,0.22)",
                position: "relative",
              }}
            >
              {coverURL ? (
                <Image
                  src={coverURL}
                  alt={`${title} cover`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="120px"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(145deg, #8B5E3C, #3D2010)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.5"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Mic button — overlapping bottom-right of cover */}
            <button
              className="vapi-mic-btn"
              type="button"
              aria-label="Toggle microphone"
              style={{
                position: "absolute",
                bottom: "-12px",
                right: "-12px",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "#fff",
                border: "none",
                boxShadow: "0 2px 12px rgba(80,40,10,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#5C3D1E",
                transition: "box-shadow 0.15s, transform 0.15s",
              }}
            >
              {/* mic-off icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          </div>

          {/* Book info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "#1E0E00",
                margin: "0 0 4px",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            <p
              style={{ fontSize: "14px", color: "#7A5C3A", margin: "0 0 1rem" }}
            >
              by {author}
            </p>

            {/* Pill badges row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {/* Status pill */}
              <span
                className="vapi-status-indicator"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  background: "#fff",
                  borderRadius: "999px",
                  fontSize: "13px",
                  color: "#3D2010",
                  fontFamily: "'Lora', Georgia, serif",
                  boxShadow: "0 1px 4px rgba(100,60,20,0.08)",
                }}
              >
                <span
                  className="vapi-status-dot"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#9CA3AF",
                    flexShrink: 0,
                  }}
                />
                <span className="vapi-status-text">Ready</span>
              </span>

              {/* Voice pill */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "5px 12px",
                  background: "#fff",
                  borderRadius: "999px",
                  fontSize: "13px",
                  color: "#3D2010",
                  fontFamily: "'Lora', Georgia, serif",
                  boxShadow: "0 1px 4px rgba(100,60,20,0.08)",
                }}
              >
                <span style={{ color: "#9B7B5A" }}>Voice:</span>
                <span style={{ fontWeight: 600 }}>{persona}</span>
              </span>

              {/* Timer pill */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "5px 12px",
                  background: "#fff",
                  borderRadius: "999px",
                  fontSize: "13px",
                  color: "#3D2010",
                  fontFamily: "'Lora', Georgia, serif",
                  fontVariantNumeric: "tabular-nums",
                  boxShadow: "0 1px 4px rgba(100,60,20,0.08)",
                }}
              >
                0:00 / 15:00
              </span>
            </div>
          </div>
        </div>

        {/* ── Transcript area ── */}
        <div
          className="transcript-container"
          style={{
            background: "#fff",
            borderRadius: "16px",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem",
            boxShadow: "0 1px 8px rgba(100,60,20,0.06)",
          }}
        >
          <div
            className="transcript-empty"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              textAlign: "center",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C4A882"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            <p
              className="transcript-empty-text"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "17px",
                fontWeight: 700,
                color: "#3D2010",
                margin: 0,
              }}
            >
              No conversation yet
            </p>
            <p
              className="transcript-empty-hint"
              style={{
                fontSize: "14px",
                color: "#9B7B5A",
                margin: 0,
              }}
            >
              Click the mic button above to start talking
            </p>
          </div>
        </div>
      </div>

      <link
        href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />
    </main>
  );
}
