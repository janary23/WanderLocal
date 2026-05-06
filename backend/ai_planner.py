import json
import re
from google import genai
from google.genai import types
from flask import Blueprint, request, jsonify

# Set up the Blueprint
ai_planner_bp = Blueprint("ai_planner", __name__)

# ⚠️  Replace this with a fresh key from https://aistudio.google.com/apikey
API_KEY = "AIzaSyCQjvl_I_Qc70oohXXId3EQ70a-nNauA8k"

# Models to try in order of preference (v1beta supported models only)
MODELS_TO_TRY = [
    "gemini-2.5-flash-preview-04-17",   # latest — highest quality
    "gemini-2.0-flash",                  # fast, widely available
    "gemini-2.0-flash-lite",             # lightest quota usage
    "gemini-2.0-flash-exp",              # experimental fallback
]


def _extract_json_array(text: str) -> list:
    """
    Robustly extract the first JSON array from an AI response string.
    Uses bracket-depth matching to handle markdown fences and prose wrapping.
    """
    # Strip markdown fences
    text = re.sub(r"```(?:json)?", "", text).strip()

    start = text.find("[")
    if start == -1:
        raise ValueError("No JSON array found in AI response.")

    depth = 0
    end = -1
    for i in range(start, len(text)):
        if text[i] == "[":
            depth += 1
        elif text[i] == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break

    if end == -1:
        raise ValueError("Unbalanced brackets in AI response.")

    return json.loads(text[start:end])


@ai_planner_bp.route("/ai-itinerary", methods=["POST", "OPTIONS"])
def generate_itinerary():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    if not API_KEY:
        return jsonify({"status": "error", "message": "API key not configured."}), 400

    data = request.get_json(silent=True) or {}

    # Full parameter set sent by the frontend ItineraryBuilder
    places_mini   = data.get("placesMini", [])
    days          = int(data.get("days", 4))
    adults        = int(data.get("adults", 2))
    children      = int(data.get("children", 0))
    budget        = data.get("budget", "Standard (Mid-range)")
    stars         = int(data.get("stars", 3))
    selected_ids  = data.get("selectedPlaces", [])
    interests     = data.get("interests", [])
    arrival_loc   = data.get("arrivalLoc", "") or "Any"
    departure_loc = data.get("departureLoc", "") or "Any"
    important     = data.get("important", "") or "None"

    selected_names = [
        p["name"] for p in places_mini if p.get("id") in selected_ids
    ]

    prompt = f"""You are a Philippine travel expert creating a premium itinerary formatted as JSON.
Create a detailed {days}-day itinerary for {adults} adults and {children} children on a {budget} budget, staying in {stars}-star accommodations.
Selected Specific Destinations to Include: {', '.join(selected_names) if selected_names else 'Anywhere'}.
Arrival: {arrival_loc} | Departure: {departure_loc}
Top Interests: {', '.join(interests) if interests else 'Popular Highlights'}.
Special Requests: {important}.

Available places (choose ONLY from these IDs): {json.dumps(places_mini)}

Rules:
1. MUST integrate and prioritize the "Selected Specific Destinations to Include". If none selected, pick logical groupings.
2. Group places sensibly (geographical sense for multi-day travel).
3. Assign 2-3 places per day.
4. Return ONLY a raw JSON array — no markdown, no explanation text. Format EXACTLY:
[
  {{"day": 1, "placeId": 5, "time": "09:00 AM", "description": "Engaging 2-sentence description..."}},
  {{"day": 1, "placeId": 6, "time": "02:00 PM", "description": "..."}}
]"""

    raw_text = ""
    failures = []

    # Initialise the new SDK client once per request
    client = genai.Client(api_key=API_KEY)

    for model_name in MODELS_TO_TRY:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=4096,
                ),
            )
            raw_text = response.text

            parsed = _extract_json_array(raw_text)

            if not isinstance(parsed, list):
                raise ValueError("AI response is not a JSON array")
            if len(parsed) == 0:
                raise ValueError("AI returned an empty array")

            return jsonify({"status": "success", "data": parsed}), 200

        except Exception as e:
            failures.append(f"{model_name}: {type(e).__name__}: {e}")
            continue

    return jsonify({
        "status": "error",
        "message": "All models failed to generate a valid itinerary.",
        "details": failures,
        "raw": raw_text,
    }), 500
