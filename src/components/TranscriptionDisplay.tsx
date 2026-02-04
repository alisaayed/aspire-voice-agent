interface TranscriptionDisplayProps {
  text: string;
}

export default function TranscriptionDisplay({
  text,
}: TranscriptionDisplayProps) {
  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Transcription
      </h2>
      <p className="leading-relaxed text-zinc-800 dark:text-zinc-200">{text}</p>
    </div>
  );
}
