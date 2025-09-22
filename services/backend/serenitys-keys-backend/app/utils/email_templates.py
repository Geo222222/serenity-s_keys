"""Email template helpers."""
from __future__ import annotations

from datetime import datetime
from typing import Optional


def confirmation_email_html(
    *,
    parent_name: Optional[str],
    child_name: Optional[str],
    when: datetime,
    meet_link: str,
    launchpad_url: str,
    ics_link: Optional[str] = None,
) -> str:
    date_str = when.strftime("%A, %B %d @ %I:%M %p")
    add_to_calendar_html = (
        f'<p><a href="{ics_link}" style="color:#2563eb">Add to calendar</a></p>' if ics_link else ""
    )
    child_display = child_name or "your student"
    parent_display = parent_name or "there"
    return f"""
    <div style="font-family:system-ui,Arial,sans-serif;max-width:640px;margin:auto">
      <h2>You're booked! ??</h2>
      <p>Hi {parent_display},</p>
      <p>Your child <strong>{child_display}</strong> is confirmed for a Serenity's Keys session:</p>
      <ul>
        <li><strong>When:</strong> {date_str}</li>
        <li><strong>Where:</strong> Google Meet</li>
      </ul>
      <p><a href="{meet_link}" style="background:#0a7;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none">Join Google Meet</a></p>
      {add_to_calendar_html}
      <p>Please log into Typing.com at least once before class so it opens instantly when you use the Launchpad.</p>\n      <p>Before class, open our Launchpad (Meet + Typing.com in one place):</p>
      <p><a href="{launchpad_url}">{launchpad_url}</a></p>
      <hr/>
      <p style="color:#666;font-size:13px">Tip: Please log in to Typing.com beforehand so it opens instantly from the Launchpad.</p>
    </div>
    """.strip()
