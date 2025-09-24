# Privacy & Compliance Notes

- **Parental consent first.** Collect explicit permission before storing student progress, generating AI content, or inviting learners to live Google Meet sessions. Honor deletion requests within 30 days.
- **Minimal data collection.** Landing site forms capture parent contact info and optional notes. Typing metrics uploads store student name, WPM, accuracy, and timestamps. No payment data is stored locally.
- **No recordings by default.** Google Meet sessions are not recorded. Parents may join anytime. If recording is ever enabled, obtain written consent per session.
- **Transparency for AI features.** When AI summaries or co-teacher prompts launch, provide opt-in controls, log every automated message, and expose explanations inside the parent dashboard.
- **Data retention.** Typing.com exports hold ~70 days of history; persist long-term metrics in Postgres with archival policies (e.g., 3-year retention, annual purges of inactive accounts).
- **Security controls.** Encrypt data at rest, limit access by role (admin/coach/parent), require MFA for admin tools, and log access attempts.
- **Regulatory alignment.** Comply with COPPA/FERPA: verifiable parental consent, published privacy policy, child-friendly terms, and export/delete workflows.
- **Vendors.** Maintain DPAs/BAs with Stripe, Google, Resend (or SendGrid), and any AI vendors. Document data flows and subprocessors in the public privacy notice.
- **Incident response.** Track request IDs across services, maintain a 24-hour disclosure policy, and rehearse breach response at least annually.
