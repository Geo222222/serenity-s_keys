# AI Services

Modules to build:

- `progress-analyzer/` – Pandas-based metrics processors, rule checks (plateau, accuracy, consistency) with outputs stored to Postgres.
- `feedback-writer/` – LLM prompt runners (OpenAI / Anthropic) producing parent reports and kid mini-challenges.
- `tts-coach/` – TTS orchestration (ElevenLabs or Coqui) with audio playback cues for the co-teacher companion.
- `prompt-library/` – central prompt/version registry; tie into experiment tracking.

## Data Contracts

Input matrices expect the metrics schema defined in `docs/architecture.md`. Persist derived insights so dashboards and notifications can read without re-running models.

## Runtime

- Batch via Celery / RQ / BullMQ workers.
- Real-time endpoints for Meet sidecar app (mini-goals, praise cues).
- Logging + consent history to respect privacy requirements.