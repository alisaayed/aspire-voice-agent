"use client";

import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import TranscriptionDisplay from "@/components/TranscriptionDisplay";
import SummaryDisplay from "@/components/SummaryDisplay";
import EmailForm from "@/components/EmailForm";
import StatusMessage from "@/components/StatusMessage";

type AppState =
  | "idle"
  | "transcribing"
  | "summarizing"
  | "ready-to-send"
  | "sending"
  | "sent";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setError("");
    setState("transcribing");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) {
        throw new Error("Transcription failed");
      }

      const { text } = await transcribeRes.json();
      setTranscription(text);
      setState("summarizing");

      const summarizeRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!summarizeRes.ok) {
        throw new Error("Summarization failed");
      }

      const { summary: summaryText } = await summarizeRes.json();
      setSummary(summaryText);
      setState("ready-to-send");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("idle");
    }
  };

  const handleSendEmail = async (recipientEmail: string) => {
    setError("");
    setState("sending");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary, recipientEmail }),
      });

      if (!res.ok) {
        throw new Error("Failed to send email");
      }

      setState("sent");
    } catch {
      setError("Failed to send email. Please try again.");
      setState("ready-to-send");
    }
  };

  const reset = () => {
    setState("idle");
    setTranscription("");
    setSummary("");
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Voice to Email
        </h1>
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          Record a voice note, get a summary, and email it.
        </p>

        {error && <StatusMessage type="error" message={error} />}

        {(state === "idle" || state === "transcribing") && (
          <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
        )}

        {state === "transcribing" && (
          <StatusMessage type="loading" message="Transcribing your audio..." />
        )}

        {state === "summarizing" && (
          <StatusMessage type="loading" message="Generating summary..." />
        )}

        {state === "sending" && (
          <StatusMessage type="loading" message="Sending email..." />
        )}

        {transcription && <TranscriptionDisplay text={transcription} />}

        {summary && <SummaryDisplay summary={summary} />}

        {state === "ready-to-send" && <EmailForm onSend={handleSendEmail} />}

        {state === "sent" && (
          <>
            <StatusMessage
              type="success"
              message="Email sent successfully!"
            />
            <button
              onClick={reset}
              className="rounded-full bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Record Another
            </button>
          </>
        )}
      </main>
    </div>
  );
}
