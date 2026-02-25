import requests

url = "http://localhost:8000/api/v2/user-based-retrieval/"
payload = {
    "query": "Investment Advice",
    "user": {
        "name": "Test",
        "age": 30,
        "gender": "male",
        "address": "123",
        "city": "Test",
        "state": "Test",
        "zip": "123",
        "country": "India",
        "maritalStatus": "single",
        "dependents": 0,
        "employmentType": "salaried",
        "annualIncome": 1000000,
        "riskProfile": "moderate"
    }
}
try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code != 200:
        print("Error Detail:")
        print(response.json().get("detail", response.text))
except Exception as e:
    print(f"Error: {e}")
