import requests
res = requests.post("http://127.0.0.1:5000/get-crop-price", json={"crop": "Rice", "state": "Punjab"})
print(res.status_code)
print(res.json())
