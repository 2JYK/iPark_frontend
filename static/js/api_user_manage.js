// 아이디 찾기 
async function findUsername() {
  const userData = {
    email: document.getElementById("inputEmail").value,
    phone: document.getElementById("inputPhone").value
  }

  const response = await fetch(`${backendBaseUrl}/user/myid/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(userData)
  })

  response_json = await response.json()

  if (response.status == 200) {
    alert("회원님의 아이디는 [ " + response_json.username + " ]입니다.")
    window.location.replace(`${frontendBaseUrl}/login.html`)

  } else {
    alert(response_json["message"])
  }
}


// 계정관리 페이지 사용 권한 확인
async function searchUser() {
  const userData = {
    username: document.getElementById("checkUsername").value,
    password: document.getElementById("checkPassword").value
  }

  const response = await fetch(`${backendBaseUrl}/user/verification/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: JSON.stringify(userData)
  })

  verification_json = await response.json()
  if (response.status == 200) {
    const popup = document.getElementById("popup")
    popup.style.visibility = "visible"
    document.getElementById("accountUsername").value = verification_json.username
    document.getElementById("accountFullname").value = verification_json.fullname
    document.getElementById("accountEmail").value = verification_json.email.split("@")[0]
    document.querySelector("#email-field select option").value = "@" + verification_json.email.split("@")[1]
    document.querySelector("#email-field select option").innerHTML = "@" + verification_json.email.split("@")[1]
    document.getElementById("accountPhone").value = verification_json.phone
    document.getElementById("accountRegion").value = verification_json.region

  } else {
    alert(verification_json["message"])
    const popup = document.getElementById("popup")
    popup.style.visibility = "hidden"
  }
}


// 계정확인 페이지 : 수정된 데이터 송신
async function changeAccount() {
  var error_node = document.querySelectorAll("#error")
  error_node.forEach(
    error =>
      error.parentNode.removeChild(error)
  )

  let changedData

  if (document.getElementById("accountPassword").value) {
    changedData = {
      username: document.getElementById("accountUsername").value,
      password: document.getElementById("accountPassword").value,
      fullname: document.getElementById("accountFullname").value,
      email: document.getElementById("accountEmail").value + document.querySelector("#email-field select option").value,
      phone: document.getElementById("accountPhone").value,
      region: document.getElementById("accountRegion").value
    }
  } else {
    changedData = {
      username: document.getElementById("accountUsername").value,
      fullname: document.getElementById("accountFullname").value,
      email: document.getElementById("accountEmail").value + document.querySelector("#email-field select option").value,
      phone: document.getElementById("accountPhone").value,
      region: document.getElementById("accountRegion").value
    }
  }

  const response = await fetch(`${backendBaseUrl}/user/`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: JSON.stringify(changedData)
  })

  account_response = await response.json()
  if (response.status == 201) {
    alert("회원정보 수정이 완료되었습니다.")
    window.location.replace(`${frontendBaseUrl}/index.html`)

  } else {
    const key = Object.keys(account_response)
    const error = Object.values(account_response)

    for (let i = 0; i < key.length; i++) {
      switch (key[i]) {
        case "username":
          const err_username = document.getElementById("username-field")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_username.appendChild(new_span)
          break
        case "email":
          const err_email = document.getElementById("email-field")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_email.appendChild(new_span)
          break
        case "fullname":
          const err_fullname = document.getElementById("fullname-field")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_fullname.appendChild(new_span)
          break
        case "password":
          const err_password = document.getElementById("password-field")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_password.appendChild(new_span)
          break
        case "phone":
          const err_phone = document.getElementById("phone-field")
          var new_span = document.createElement("span")
          new_span.setAttribute("id", "error")
          new_span.innerText = error[i]
          err_phone.appendChild(new_span)
          break
      }
    }
  }
}

// 회원 탈퇴
async function withdrawal() {
  var delConfirm = confirm("정말 회원 탈퇴를 진행하시겠습니까?")
  if (delConfirm) {
    const response = await fetch(`${backendBaseUrl}/user/`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access")
      }
    })

    withdrawal_json = await response.json()
    if (response.status == 200) {
      alert(withdrawal_json["message"])
      localStorage.removeItem("payload")
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      window.location.replace(`${frontendBaseUrl}/index.html`)

    } else {
    }
  }
}


// 카카오 회원 탈퇴
// function disconnect() {
//   Kakao.API.request({
//     url: '/v1/user/unlink',
//     success: function (response) {
//       localStorage.removeItem("payload")
//       localStorage.removeItem("access")
//       localStorage.removeItem("refresh")

//       window.location.replace(`${frontendBaseUrl}/login.html`)
//     },
//     fail: function (error) {
//       alert("회원탈퇴가 이미 처리되었습니다")
//     },
//   })
// }