// 전역 변수 //
const backendBaseUrl = "http://127.0.0.1:8000/"
const frontendBaseUrl = "http://127.0.0.1:5500/"


// 카카오로그인 -> 회원가입 // 
async function kakaoSignup() {
  const signupData = {
    username: document.getElementById("floatingInput").value,
    email: document.getElementById("floatingInputEmail").value,
    fullname: document.getElementById("floatingInputFullname").value,
    password: document.getElementById("floatingPassword").value,
    phone: document.getElementById("floatingPhone").value,
    birthday: document.getElementById("floatingBirthday").value,
    region: document.getElementById("floatingRegion").value
  }

  const response = await fetch(`${backendBaseUrl}user/`, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(signupData)
  })

  response_json = await response.json()

  if (response.status == 200) {
    window.location.replace(`${frontendBaseUrl}index.html`)
  } else {
    alert(response_json["error"]) // phone의 경우, 메세지가 undefined로 출력됨
  }
}


// 로그아웃 // 
async function logout() {
  localStorage.removeItem("payload")
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")

  window.location.replace(`${frontendBaseUrl}login.html`)
}


