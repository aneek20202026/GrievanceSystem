from flask import Flask, jsonify, request
from urgent import predict_urgency, get_keywords, custom_translator

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to your Flask app!"})

@app.route('/urgent', methods=['POST'])
def post_data():
    data = request.get_json() 
    if not data:
        return jsonify({"error": "No JSON data provided", "status":0}), 400
    print(data)

    text=data["description"]
    if "language" in data:
        text=custom_translator(text, data["language"], "en")

    keywords=get_keywords(text)

    urgent_pred=predict_urgency(
        text, 
        None if len(keywords)==0 else ", ".join(keyword.lower() for keyword in keywords)
    )

    return jsonify({
        "urgency": urgent_pred, 
        "categories":None if len(keywords)==0 else keywords, 
        "status": 1
    })

if __name__ == '__main__':
    app.run(debug=False)
