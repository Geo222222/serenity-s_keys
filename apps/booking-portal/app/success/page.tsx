import Link from "next/link";

export default function SuccessPage() {
  return (
    <section className="stack">
      <div>
        <h2 className="h-display">Checkout complete!</h2>
        <p>Your student is confirmed! Here are your next steps:</p>
        
        <div className="card elevate" style={{ marginTop: "24px" }}>
          <h3 className="card-title">1. Check your email</h3>
          <p>You'll receive an email with:</p>
          <ul>
            <li>Your Google Meet link for the session</li>
            <li>A link to register for Typing.com</li>
            <li>Calendar invitation</li>
          </ul>
        </div>

        <div className="card elevate" style={{ marginTop: "16px" }}>
          <h3 className="card-title">2. Register on Typing.com</h3>
          <p>Using the link in your email:</p>
          <ul>
            <li>Create your student's Typing.com account</li>
            <li>Join your assigned class</li>
            <li>Try logging in once before the session</li>
          </ul>
        </div>
      </div>
      
      <div style={{ marginTop: "24px" }}>
        <Link href="/programs" className="button primary">
          Book another session →
        </Link>
      </div>
    </section>
  );
}
