import json
import re
import time
from google import genai
from google.genai import types
from flask import Blueprint, request, jsonify

# Set up the Blueprint
ai_planner_bp = Blueprint("ai_planner", __name__)

# ⚠️  Replace this with a fresh key from https://aistudio.google.com/apikey
API_KEY = "AIzaSyD32mykLXqgsHFDBcYA3a8URnxdjnCSIHc"

# Models to try in order of preference (confirmed available via ListModels)
MODELS_TO_TRY = [
    "gemini-2.5-flash-lite",  # confirmed working ✓
    "gemini-2.5-flash",       # high quality fallback
    "gemini-2.0-flash",       # widely available fallback
    "gemini-2.0-flash-lite",  # lightest quota fallback
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

    # Support simplified places-focused parameters
    places_mini   = data.get("placesMini", [])
    days          = int(data.get("days", 4))
    travelers     = int(data.get("travelers", int(data.get("adults", 2)) + int(data.get("children", 0))))
    selected_ids  = data.get("selectedPlaces", [])
    interests     = data.get("interests", [])
    important     = data.get("important", "") or "None"

    selected_names = [
        p["name"] for p in places_mini if p.get("id") in selected_ids
    ]

    prompt = f"""You are a Philippine travel expert creating a premium attractions-only itinerary formatted as JSON.
Create a detailed {days}-day sightseeing and activities itinerary for {travelers} traveler(s).
Selected Specific Destinations to Include: {', '.join(selected_names) if selected_names else 'Anywhere'}.
Top Interests: {', '.join(interests) if interests else 'Popular Highlights'}.
Special Requests: {important}.

Available places (choose ONLY from these IDs): {json.dumps(places_mini)}

Rules:
1. FOCUS ONLY ON PLACES AND ATTRACTIONS. Do NOT include any hotels, accommodations, flight travels, or transfer logistics in the descriptions or itinerary stops.
2. MUST integrate and prioritize the "Selected Specific Destinations to Include". If none selected, pick logical groupings.
3. Group places sensibly (geographical sense for multi-day travel, so places on the same day are in the same province or nearby area).
4. Assign 2-3 places/activities per day.
5. Return ONLY a raw JSON array — no markdown, no explanation text. Format EXACTLY:
[
  {{"day": 1, "placeId": 5, "time": "09:00 AM", "description": "Engaging 2-sentence description focusing on what to see and do at this attraction."}},
  {{"day": 1, "placeId": 6, "time": "02:00 PM", "description": "..."}}
]"""

    raw_text = ""
    failures = []
    quota_exhausted = []

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
            err_str = str(e)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                quota_exhausted.append(model_name)
                failures.append(f"{model_name}: QUOTA_EXHAUSTED")
            else:
                failures.append(f"{model_name}: {type(e).__name__}: {e}")
            continue

    # Give a clear message if the issue is quota
    if len(quota_exhausted) == len(MODELS_TO_TRY):
        return jsonify({
            "status": "error",
            "message": "API quota exceeded. The free-tier daily limit has been reached. Please try again tomorrow or upgrade your Gemini API plan at https://aistudio.google.com/apikey",
            "details": failures,
        }), 429

    return jsonify({
        "status": "error",
        "message": "All models failed to generate a valid itinerary.",
        "details": failures,
        "raw": raw_text,
    }), 500


@ai_planner_bp.route("/ai-chat", methods=["POST", "OPTIONS"])
def ai_chat():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    if not API_KEY:
        return jsonify({"status": "error", "message": "API key not configured."}), 400

    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"status": "error", "message": "Prompt is required."}), 400

    full_prompt = f"""You are a Philippine travel expert. 
Respond to the user request below. 
RULES:
1. Do NOT use any emojis, icons, or graphical symbols in your response.
2. Do NOT use any markdown bold formatting like asterisks (double asterisks ** or triple asterisks ***) in your response. Keep it clean text.
3. Keep the tone friendly, informative, and professional.

Request: {prompt}"""

    client = genai.Client(api_key=API_KEY)
    
    for model_name in MODELS_TO_TRY:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=2048,
                ),
            )
            return jsonify({"status": "success", "data": response.text}), 200
        except Exception as e:
            continue

    return jsonify({"status": "error", "message": "All models failed to generate chat content."}), 500
