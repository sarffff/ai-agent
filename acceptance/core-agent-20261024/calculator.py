def clamp(value: int, minimum: int, maximum: int) -> int:
    """Keep a value within the inclusive bounds."""
    return max(minimum, min(value, maximum))
