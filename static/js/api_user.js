// 비밀번호 변경 모달
$(function () {
  $("#modalOpen").click(function () {
    $("#popup").css("display", "flex").hide().fadeIn();
  })

  $("#close").click(function () {
    modalClose();
  })

  function modalClose() {
    $("#popup").fadeOut();
  }
})


// 회원가입 
async function handleSignup() {
  const signupData = {
    username: document.getElementById("floatingInput").value,
    email: document.getElementById("floatingInputEmail").value,
    fullname: document.getElementById("floatingInputFullname").value,
    password: document.getElementById("floatingPassword").value,
    phone: document.getElementById("floatingPhone").value,
    region: document.getElementById("floatingRegion").value
  }

  const response = await fetch(`${backendBaseUrl}/user/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(signupData)
  })

  response_json = await response.json()
  if (response.status == 201) {
    window.location.replace(`${frontendBaseUrl}/login.html`)

  } else {
    alert(response_json["error"])
  }
}


// 로그인
async function handleLogin() {
  const loginData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value
  }

  const response = await fetch(`${backendBaseUrl}/user/api/token/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(loginData)
  })

  response_json = await response.json()
  if (response.status == 200) {
    localStorage.setItem("access", response_json.access)
    localStorage.setItem("refresh", response_json.refresh)
    const base64Url = response_json.access.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(atob(base64).split("").map(
      function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(""))
    localStorage.setItem("payload", jsonPayload)
    window.location.replace(`${frontendBaseUrl}/index.html`)

  } else {
    alert("잘못된 로그인입니다.")
  }
}



// 카카오 로그인 : 토큰과 페이로드 생성, 회원가입 유도
async function kakaoUserForm(authObj, kakaoData) {
  const kakaoUserData = Object.assign({}, authObj, kakaoData)

  const response = await fetch(`${backendBaseUrl}/user/kakao/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(kakaoUserData)
  })

    .then(async (res) => {
      const code = await res.json()
      if (res.status == 200 && code.res_code == 2) {
        res.json().then((res) => {
          localStorage.setItem("access", res.access)
          localStorage.setItem("refresh", res.refresh)
          const base64Url = res.access.split(".")[1]
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
          const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          }).join(""))
          localStorage.setItem("payload", jsonPayload)
          window.location.replace(`${frontendBaseUrl}/index.html`)
        })

      } else if (res.status == 200 && code.res_code == 1) {
        sign.style.display = "none"
        kakaosignup.style.display = "block"
        const username = document.getElementById("floatingInput")
        const email = document.getElementById("floatingInputEmail")
        const fullname = document.getElementById("floatingInputFullname")
        username.value = kakaoUserData.username
        email.value = kakaoUserData.email
        fullname.value = kakaoUserData.fullname
      }
    }
    )
}


// 비밀번호 변경 자격 확인
async function verifyUser() {
  const userDataForVerify = {
    username: document.getElementById("inputUsername").value,
    email: document.getElementById("inputEmail").value
  }

  const response = await fetch(`${backendBaseUrl}/user/alterpassword/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(userDataForVerify)
  })

  response_json = await response.json()
  if (response.status == 200) {
    const popup = document.getElementById("popup")
    popup.style.visibility = "visible"
    conveyUserData(response_json)

  } else {
    alert(response_json["message"])
    const popup = document.getElementById("popup")
    popup.style.visibility = "hidden"
  }
}


// 사용자 정보 전달
function conveyUserData(response_json) {
  const conveyedData = {
    username: response_json.username,
    email: response_json.email
  }
  return conveyedData
}


// 비밀번호 변경
async function changePassword() {
  conveyUserData(response_json)

  const passwordData = {
    username: conveyUserData(response_json).username,
    email: conveyUserData(response_json).email,
    new_password: document.getElementById("popupBodyNewPassword").value,
    rewrite_password: document.getElementById("popupBodyRewrite").value
  }

  const response = await fetch(`${backendBaseUrl}/user/alterpassword/`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(passwordData)
  })

  response_password = await response.json()
  if (response.status == 201) {
    alert(response_password["message"])
    window.location.replace(`${frontendBaseUrl}/login.html`)

  } else {
    alert(response_password["message"])
  }
}