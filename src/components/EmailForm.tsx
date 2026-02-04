"use client";

import { useState } from "react";

interface EmailFormProps {
  onSend: (recipientEmail: string, scheduledAt?: string) => void;
}

export default function EmailForm({ onSend }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"instant" | "scheduled">("instant");
  const [scheduledDate, setScheduledDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (mode === "scheduled" && scheduledDate) {
      onSend(email.trim(), new Date(scheduledDate).toISOString());
    } else {
      onSend(email.trim());
    }
  };

  const minDateTime = new Date(Date.now() + 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <input
        type="email"
        placeholder="recipient@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("instant")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "instant"
              ? "bg-blue-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          Send Now
        </button>
        <button
          type="button"
          onClick={() => setMode("scheduled")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "scheduled"
              ? "bg-blue-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          Schedule
        </button>
      </div>

      {mode === "scheduled" && (
        <input
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          min={minDateTime}
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      )}

      <button
        type="submit"
        className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
      >
        {mode === "instant" ? "Send Email" : "Schedule Email"}
      </button>
    </form>
  );
}
