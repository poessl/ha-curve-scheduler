"""Representative saved schedules, independent of new-curve defaults."""

from typing import Any


def example_schedule(language: str = "en") -> dict[str, Any]:
    """Return a legacy two-plan schedule for multi-plan and migration tests."""
    german = language.lower().startswith("de")
    return {
        "profiles": {
            "workday": {
                "name": "Werktag" if german else "Workday",
                "color": "#e67e22",
                "points": [
                    {"t": time, "v": value}
                    for time, value in [
                        ("05:00", 45),
                        ("05:30", 60),
                        ("08:30", 60),
                        ("09:00", 45),
                        ("17:00", 45),
                        ("17:30", 60),
                        ("21:30", 60),
                        ("22:00", 45),
                    ]
                ],
            },
            "day_off": {
                "name": "Frei" if german else "Day off",
                "color": "#27ae60",
                "points": [
                    {"t": time, "v": value}
                    for time, value in [("07:00", 45), ("07:30", 60), ("22:00", 60), ("22:30", 45)]
                ],
            },
        },
        "week": {
            **dict.fromkeys(["mon", "tue", "wed", "thu", "fri"], "workday"),
            **dict.fromkeys(["sat", "sun"], "day_off"),
        },
        "holiday_profile": "day_off",
        "fallback_profile": "workday",
        "exceptions": [],
        "auto_cleanup": False,
        "enabled": True,
        "override": None,
    }
