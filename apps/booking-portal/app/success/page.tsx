import Link from "next/link";

export default function SuccessPage() {
  return (
    <section className="stack">
      <div>
        <h2 className="h-display">Checkout complete!</h2>
        <p>Your student is confirmed. We'll email the Google Meet link and next steps shortly.</p>
      </div>
      <p>
        <Link href="/programs" className="button primary">
          Book another session →
        </Link>
      </p>
    </section>
  );
}
