# Privacy & Compliance Notes

- Collect explicit parent consent for storing student progress, generating AI feedback, and optionally recording Google Meet sessions.
- Provide opt-out controls for AI-generated messaging (email/SMS) per parent and per student.
- Retention policy: Typing.com exports only surface ~70 days of history; persist long-term metrics in Postgres and define archival rules.
- Secure handling of student PII – encrypt at rest where possible, restrict access via role-based auth.
- Log all automated decisions (AI feedback, scheduling actions) to support audits and parental review.
- Honor COPPA/FERPA considerations: obtain verifiable parental consent, publish privacy policy, and allow data deletion requests.