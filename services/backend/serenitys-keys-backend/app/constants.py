"""Shared constants across the application."""
from typing import TypedDict

class ProgramConfig(TypedDict):
    id: str
    name: str
    blurb: str
    defaultPriceCents: int

PROGRAMS: list[ProgramConfig] = [
    {
        "id": "group:3-5",
        "name": "Mini Movers Ages 3-5",
        "blurb": "Sensory-rich 30 minute sessions to spark curiosity and healthy habits.",
        "defaultPriceCents": 3500,
    },
    {
        "id": "group:6-8",
        "name": "Group Ages 6-8",
        "blurb": "Foundations and fun race challenges for younger typists.",
        "defaultPriceCents": 8900,
    },
    {
        "id": "group:9-11",
        "name": "Group Ages 9-11",
        "blurb": "Skill building and accuracy drills with peers.",
        "defaultPriceCents": 8900,
    },
    {
        "id": "group:12-14",
        "name": "Group Ages 12-14",
        "blurb": "Speed, ergonomics, and productivity shortcuts.",
        "defaultPriceCents": 8900,
    },
    {
        "id": "private:all",
        "name": "Private Coaching",
        "blurb": "One-on-one remote coaching tailored to the student.",
        "defaultPriceCents": 12900,
    },
]