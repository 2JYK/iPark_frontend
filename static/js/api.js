// const backendBaseUrl = "http://127.0.0.1:8000"
// const frontendBaseUrl = "http://127.0.0.1:5500"
const backendBaseUrl = "https://back.ilovepark.net"
const frontendBaseUrl = "https://www.ilovepark.net"


TOKEN = {
  "Access-Control-Allow-Origin": "*",
  "Authorization": "Bearer " + localStorage.getItem("access"),
}


// HTML 정규식
function removeHTMLText(text) {
  text = text.replaceAll(/<[^>]*>?/g, "");

  // text = text.replaceAll("<","&lt;")
  // text = text.replaceAll(">","&gt;")
  // text = text.replaceAll("&", "&amp;")
  return text
}