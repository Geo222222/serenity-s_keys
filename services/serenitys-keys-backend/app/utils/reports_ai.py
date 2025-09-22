def compose_parent_summary(student_name: str, metrics: list[dict]) -> str:
    if not metrics:
        return (
            f"{student_name} is just getting started. We'll establish a baseline"
            " in the first week and focus on accuracy over speed."
        )

    latest = metrics[-1]
    avg_wpm = round(sum(m["wpm"] for m in metrics) / len(metrics), 1)
    avg_acc = round(sum(m["accuracy"] for m in metrics) / len(metrics), 1)

    return (
        f"This week {student_name} averaged {avg_wpm} WPM at {avg_acc}% accuracy. "
        "Our focus next week: steady accuracy above 90% with calm pacing for "
        "3-minute drills. We'll introduce short challenges to keep sessions "
        "fun and confidence high."
    )