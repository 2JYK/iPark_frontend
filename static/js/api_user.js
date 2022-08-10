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
  var error_node = document.querySelectorAll("#error")
  error_node.forEach(
    error =>
      error.parentNode.removeChild(error)
  )

  const signupData = {
    username: document.getElementById("floatingInput").value,
    email: document.getElementById("floatingInputEmail").value + document.getElementById("emailSection").value,
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
    const key = Object.keys(response_json)
    const error = Object.values(response_json)

    for (let i = 0; i < key.length; i++) {
      switch (key[i]) {
        case "username":
          const err_username = document.getElementById("usernameField")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_username.appendChild(new_span)
          break
        case "email":
          const err_email = document.getElementById("emailField")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_email.appendChild(new_span)
          break
        case "fullname":
          const err_fullname = document.getElementById("fullnameField")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_fullname.appendChild(new_span)
          break
        case "password":
          const err_password = document.getElementById("passwordField")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_password.appendChild(new_span)
          break
        case "phone":
          const err_phone = document.getElementById("phoneField")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_phone.appendChild(new_span)
          break
      }
    }
  }
}


// 로그인
async function handleLogin() {
  const loginData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value
  }

  const response = await fetch(`${backendBaseUrl}/user/api/ipark/token/`, {
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

  const res = await fetch(`${backendBaseUrl}/user/kakao/`, {
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
          localStorage.setItem("access", code.access)
          localStorage.setItem("refresh", code.refresh)
          const base64Url = code.access.split(".")[1]
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
          const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          }).join(""))
          localStorage.setItem("payload", jsonPayload)
          window.location.replace(`${frontendBaseUrl}/index.html`)

      } else if (res.status == 200 && code.res_code == 1) {
        document.getElementById("sign").style.display = "none"
        kakaosignup.style.display = "block"
      
        const username = document.getElementById("floatingInput")
        const emailId = document.getElementById("floatingInputEmail")
        const emailDomain = document.getElementById("emailSection")
        const fullname = document.getElementById("floatingInputFullname")

        var domains = Array.from($("#emailSection>option").map(function() { return $(this).val(); }))

        if (!domains.includes(emailDomain.value)) {
          document.getElementById("emailSection").outerHTML = 
            `<select id="emailSection">
              <option selected>-- 이메일 선택 --</option>
              <option value="@naver.com">@naver.com</option>
              <option value="@gmail.com">@gmail.com</option>
              <option value="@kakao.com">@kakao.com</option>
              <option value="@daum.net">@daum.net</option>
              <option value="@nate.com">@nate.com</option>
              <option value="@outlook.com">@outlook.com</option>
            </select>
            <span style="color:red; font-size:15px;">* naver, google, kakao, daum, nate, outlook만 가능</span>
            `

        } else {
          username.value = kakaoUserData.username
          emailId.value = kakaoUserData.email.split('@')[0]
          emailDomain.value = ['@'] + kakaoUserData.email.split('@')[1]
          fullname.value = kakaoUserData.fullname
        }
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