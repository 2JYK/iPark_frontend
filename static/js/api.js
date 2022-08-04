TOKEN = {
  "Access-Control-Allow-Origin": "*",
  "Authorization": "Bearer " + localStorage.getItem("access"),
}


const backendBaseUrl = "http://127.0.0.1:8000"
const frontendBaseUrl = "http://127.0.0.1:5500"
// const backendBaseUrl = "https://www.ilovepark.net"
// const frontendBaseUrl = "https://front.ilovepark.net"