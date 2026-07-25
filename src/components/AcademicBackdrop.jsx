export default function AcademicBackdrop() {
  return (
    <div className="academic-backdrop" aria-hidden="true">
      <div className="paper-grain" />
      <div className="orbital-mark orbital-mark-a" />
      <div className="orbital-mark orbital-mark-b" />
      <svg className="seal-diagram" viewBox="0 0 520 520">
        <circle cx="260" cy="260" r="176" />
        <circle cx="260" cy="260" r="104" />
        <path d="M84 260h352M260 84v352M135 137c78 82 172 82 250 0M135 383c78-82 172-82 250 0" />
      </svg>
    </div>
  )
}
