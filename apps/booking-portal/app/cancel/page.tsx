import Link from "next/link";

export default function CancelPage() {
  return (
    <section className="stack">
      <div>
        <h2 className="h-display">Checkout canceled</h2>
        <p>No worries—your slot is still open until someone else grabs it.</p>
      </div>
      <p>
        <Link href="/availability" className="button secondary">
          ← Return to availability
        </Link>
      </p>
    </section>
  );
}
