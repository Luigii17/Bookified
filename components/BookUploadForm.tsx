"use client";

import { useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  checkBookExists,
  createBook,
  saveBookSegments,
} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { parsePDFFile } from "@/lib/utils";
import { upload } from "@vercel/blob/client";

const schema = z.object({
  pdf: z.instanceof(File, { message: "Please upload a PDF file" }),
  coverImage: z.instanceof(File).optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  persona: z.string().min(1, "Please select a voice"),
});

type FormValues = z.infer<typeof schema>;

const voices: Record<
  "male" | "female",
  { id: string; name: string; description: string }[]
> = {
  male: [
    {
      id: "dave",
      name: "Dave",
      description: "Young male, British-Essex, casual & conversational",
    },
    {
      id: "daniel",
      name: "Daniel",
      description: "Middle-aged male, British, authoritative but warm",
    },
    { id: "chris", name: "Chris", description: "Male, casual & easy-going" },
  ],
  female: [
    {
      id: "rachel",
      name: "Rachel",
      description: "Young female, American, calm & clear",
    },
    {
      id: "sarah",
      name: "Sarah",
      description: "Young female, American, soft & approachable",
    },
  ],
};

interface DropzoneProps {
  accept: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
  file: File | null;
  onFile: (f: File) => void;
  onRemove: () => void;
}

function UploadDropzone({
  accept,
  icon,
  label,
  hint,
  onFile,
  file,
  onRemove,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  return (
    <div
      className={`upload-dropzone${dragging ? " upload-dropzone--active" : ""}`}
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `1.5px dashed ${dragging ? "#8B5E3C" : "#C4A882"}`,
        borderRadius: "10px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        cursor: file ? "default" : "pointer",
        background: dragging ? "rgba(139,94,60,0.04)" : "rgba(255,249,242,0.6)",
        transition: "all 0.2s ease",
        minHeight: "120px",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      {file ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "14px",
              color: "#5C3D1E",
              fontFamily: "'Lora', Georgia, serif",
              fontWeight: 500,
            }}
          >
            {file.name}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9B7B5A",
              fontSize: "18px",
              lineHeight: 1,
              padding: "0 4px",
            }}
            aria-label="Remove file"
          >
            ×
          </button>
        </div>
      ) : (
        <>
          <div
            style={{ color: "#A08060", fontSize: "28px", marginBottom: "2px" }}
          >
            {icon}
          </div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#5C3D1E",
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            {label}
          </span>
          <span style={{ fontSize: "12px", color: "#A08060" }}>{hint}</span>
        </>
      )}
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,249,242,0.88)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "18px",
        zIndex: 10,
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #E8D5BC",
          borderTop: "3px solid #663820",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          color: "#5C3D1E",
          fontSize: "15px",
          fontStyle: "italic",
        }}
      >
        Synthesizing your book…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Lora', Georgia, serif",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#7A5230",
  marginBottom: "6px",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid #D9BFA0",
  borderRadius: "8px",
  fontSize: "14px",
  fontFamily: "'Lora', Georgia, serif",
  color: "#3D2010",
  background: "rgba(255,249,242,0.8)",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.18s",
};

const errorStyle: React.CSSProperties = {
  color: "#C0392B",
  fontSize: "12px",
  marginTop: "4px",
};

const UploadIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#A08060"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#A08060"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export default function BookUploadForm() {
  const [submitting, setSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      author: "",
      persona: "",
      pdf: undefined,
      coverImage: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!userId) {
      return toast.error("Please login to uploads books");
    }

    setSubmitting(true);

    //PostHog -> track book uploads

    try {
      const existCheck = await checkBookExists(data.title);
      if (existCheck.exists && existCheck.book) {
        toast.info("Book with same title already exists");
        router.push(`/books/${existCheck.book.slug}`);
        return;
      }

      const fileTitle = data.title.replace(/\s+/g, "-").toLowerCase();
      const pdfFile = data.pdf;

      const parsedPDF = await parsePDFFile(pdfFile);

      if (parsedPDF.content.length === 0) {
        toast.error(
          "Failed to parse PDF. Please try again with a different file",
        );
        return;
      }
      const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: "application/pdf",
      });

      let coverUrl: string;

      if (data.coverImage) {
        const coverFile = data.coverImage;
        const uploadedCoverBlob = await upload(
          `${fileTitle}_cover.png`,
          coverFile,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: coverFile.type,
          },
        );
        coverUrl = uploadedCoverBlob.url;
      } else {
        const response = await fetch(parsedPDF.cover);
        const blob = await response.blob();

        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: "image/png",
        });
        coverUrl = uploadedCoverBlob.url;
      }

      const book = await createBook({
        clerkId: userId,
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,
      });

      if (!book || !book.success) {
        // Pinta el error real en la consola del navegador para inspeccionarlo
        console.error("Error devuelto por el servidor:", book?.error);

        // Muestra el mensaje en un toast para que lo veas de inmediato
        toast.error(
          `Backend Error: ${(book?.error as any)?.message || "Check server console"}`,
        );
        return; // Detén la ejecución aquí de forma segura sin romper la app
      }

      if (book.alreadyExists) {
        toast.info("Book with same title already exists");
        router.push(`/books/${existCheck.book.slug}`);
        return;
      }

      const segments = await saveBookSegments(
        book.data._id,
        userId,
        parsedPDF.content,
      );

      if (!segments || !segments.success) {
        toast.error("Failed to save book segments");
        throw new Error("Failed to save book segments");
      }

      console.log("¡Intentando ir al HOME ahora mismo!");
      router.push("/");
    } catch (error) {
      console.error(error);

      toast.error("Failed to upload book. Please try again later");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          minHeight: "100vh",
          background: "#F5ECD7",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "3rem 1rem",
          fontFamily: "'Lora', Georgia, serif",
        }}
      >
        <div
          className="new-book-wrapper"
          style={{
            width: "100%",
            maxWidth: "540px",
            background: "rgba(255,252,245,0.95)",
            borderRadius: "18px",
            padding: "2.5rem 2.25rem 2rem",
            boxShadow: "0 2px 32px rgba(100,60,20,0.09)",
            position: "relative",
          }}
        >
          {submitting && <LoadingOverlay />}

          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "22px",
                color: "#3D2010",
                margin: 0,
                marginBottom: "4px",
              }}
            >
              Add New Book
            </h1>
            <p style={{ fontSize: "13px", color: "#9B7B5A", margin: 0 }}>
              5 of 10 books used
              <a
                href="#"
                style={{
                  color: "#663820",
                  marginLeft: "6px",
                  textDecoration: "underline",
                  fontSize: "12px",
                }}
              >
                Upgrade
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {/* PDF Upload */}
              <div>
                <label style={labelStyle}>Book PDF File</label>
                <Controller
                  control={control}
                  name="pdf"
                  render={({ field }) => (
                    <UploadDropzone
                      accept=".pdf,application/pdf"
                      icon={<UploadIcon />}
                      label="Click to upload PDF"
                      hint="PDF file (max 50MB)"
                      file={pdfFile}
                      onFile={(f) => {
                        setPdfFile(f);
                        field.onChange(f);
                      }}
                      onRemove={() => {
                        setPdfFile(null);
                        field.onChange(undefined);
                      }}
                    />
                  )}
                />
                {errors.pdf && <p style={errorStyle}>{errors.pdf.message}</p>}
              </div>

              {/* Cover Image */}
              <div>
                <label style={labelStyle}>
                  Cover Image{" "}
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#9B7B5A",
                      textTransform: "none",
                    }}
                  >
                    (Optional)
                  </span>
                </label>
                <Controller
                  control={control}
                  name="coverImage"
                  render={({ field }) => (
                    <UploadDropzone
                      accept="image/*"
                      icon={<ImageIcon />}
                      label="Click to upload cover image"
                      hint="Leave empty to auto-generate from PDF"
                      file={coverFile}
                      onFile={(f) => {
                        setCoverFile(f);
                        field.onChange(f);
                      }}
                      onRemove={() => {
                        setCoverFile(null);
                        field.onChange(undefined);
                      }}
                    />
                  )}
                />
              </div>

              {/* Title */}
              <div>
                <label style={labelStyle}>Title</label>
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="ex. Rich Dad Poor Dad"
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#8B5E3C")
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        e.currentTarget.style.borderColor = "#D9BFA0";
                      }}
                    />
                  )}
                />
                {errors.title && (
                  <p style={errorStyle}>{errors.title.message}</p>
                )}
              </div>

              {/* Author */}
              <div>
                <label style={labelStyle}>Author Name</label>
                <Controller
                  control={control}
                  name="author"
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="ex. Robert Kiyosaki"
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#8B5E3C")
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        e.currentTarget.style.borderColor = "#D9BFA0";
                      }}
                    />
                  )}
                />
                {errors.author && (
                  <p style={errorStyle}>{errors.author.message}</p>
                )}
              </div>

              {/* Voice Selector */}
              <div>
                <label style={labelStyle}>Choose Assistant Voice</label>
                <Controller
                  control={control}
                  name="persona"
                  render={({ field }) => (
                    <>
                      {(["male", "female"] as const).map((gender) => (
                        <div key={gender} style={{ marginTop: "0.75rem" }}>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#9B7B5A",
                              marginBottom: "8px",
                              marginTop: 0,
                            }}
                          >
                            {gender === "male"
                              ? "Male Voices"
                              : "Female Voices"}
                          </p>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(140px, 1fr))",
                              gap: "8px",
                            }}
                          >
                            {voices[gender].map((voice) => {
                              const selected = field.value === voice.id;
                              return (
                                <label
                                  key={voice.id}
                                  className={`voice-selector-option${selected ? " voice-selector-option-selected" : ""}`}
                                  style={{
                                    display: "block",
                                    padding: "10px 12px",
                                    border: selected
                                      ? "1.5px solid #663820"
                                      : "1px solid #D9BFA0",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    background: selected
                                      ? "rgba(102,56,32,0.06)"
                                      : "rgba(255,249,242,0.7)",
                                    transition: "all 0.15s",
                                  }}
                                >
                                  <input
                                    type="radio"
                                    value={voice.id}
                                    checked={selected}
                                    onChange={() => field.onChange(voice.id)}
                                    style={{ display: "none" }}
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      marginBottom: "3px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        flexShrink: 0,
                                        border: selected
                                          ? "3.5px solid #663820"
                                          : "1.5px solid #C4A882",
                                        transition: "all 0.15s",
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#3D2010",
                                      }}
                                    >
                                      {voice.name}
                                    </span>
                                  </div>
                                  <p
                                    style={{
                                      fontSize: "11px",
                                      color: "#9B7B5A",
                                      margin: 0,
                                      lineHeight: 1.4,
                                      paddingLeft: "18px",
                                    }}
                                  >
                                    {voice.description}
                                  </p>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                />
                {errors.persona && (
                  <p style={errorStyle}>{errors.persona.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="form-btn"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: submitting ? "#9B7B5A" : "#663820",
                  color: "#FFF9F2",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontFamily: "'Lora', Georgia, serif",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  marginTop: "0.25rem",
                }}
                onMouseEnter={(e) =>
                  !submitting && (e.currentTarget.style.background = "#7A4525")
                }
                onMouseLeave={(e) =>
                  !submitting && (e.currentTarget.style.background = "#663820")
                }
              >
                {submitting ? "Synthesizing…" : "Begin Synthesis"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
