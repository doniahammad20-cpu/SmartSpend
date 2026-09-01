from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/convert", methods=["POST"])
def convert_currency():

    data = request.get_json()

    amount = float(data["amount"])
    from_currency = data["from"]
    to_currency = data["to"]

    if from_currency == to_currency:
        return jsonify({
            "result": amount
        })

    try:
        url = f"https://api.frankfurter.dev/v2/rate/{from_currency}/{to_currency}"

        response = requests.get(url, timeout=10)
        response.raise_for_status()

        rate_data = response.json()

        result = amount * rate_data["rate"]

        return jsonify({
            "result": round(result, 2),
            "rate": rate_data["rate"]
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    income = float(data["income"])
    expenses = float(data["expenses"])

    savings = income - expenses

    if income > 0:
        spending_percentage = (expenses / income) * 100
        savings_percentage = (savings / income) * 100
    else:
        spending_percentage = 0
        savings_percentage = 0

    score = 100 - spending_percentage

    if score < 0:
        score = 0

    if score >= 70:
        message = "Excellent! Your spending habits look healthy."
    elif score >= 40:
        message = "Good, but you can improve your savings."
    else:
        message = "Try to reduce your expenses and improve your savings."

    return jsonify({
        "income": income,
        "expenses": expenses,
        "savings": savings,
        "spending_percentage": round(spending_percentage, 2),
        "savings_percentage": round(savings_percentage, 2),
        "score": round(score, 0),
        "message": message
    })


if __name__ == "__main__":
    app.run(debug=True)