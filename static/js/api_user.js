// 회원가입 // 
async function handleSignup() {
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

  if (response.status == 201) {
    window.location.replace(`${frontendBaseUrl}login.html`)
  } else {
    alert(response_json["error"])
  }
}


// 로그인 //
async function handleLogin() {
  const loginData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  }

  const response = await fetch(`${backendBaseUrl}user/api/token/`, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(loginData)
  })

  response_json = await response.json()

  if (response.status == 200) {
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    const base64Url = response_json.access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(atob(base64).split("").map(
      function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));

    localStorage.setItem("payload", jsonPayload);
    window.location.replace(`${frontendBaseUrl}index.html`)
  } else {
    alert("잘못된 로그인입니다.", response.status)
  }
}


// refresh token으로 access token 발급
function refreshToken() {
  const payload = JSON.parse(localStorage.getItem("payload"));

  // 아직 access 토큰의 인가 유효시간이 남은 경우
  if (payload.exp > (Date.now() / 1000)) {
    return;
  } else {
    // `${backendBaseUrl}user/api/token/refresh/`
    // 인증 시간이 지났기 때문에 다시 refresh token으로 access token 다시 요청
    const requestRefreshToken = async (url) => {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "refresh": localStorage.getItem("refresh")
        })
      }
      );
      return response.json();
    };

    // 다시 인증 받은 accessToken을 localStorage에 저장하자.
    requestRefreshToken(`${backendBaseUrl}user/api/token/refresh/`).then((data) => {
      // 새롭게 발급 받은 accessToken을 localStorage에 저장
      const accessToken = data.access;
      localStorage.setItem("access", accessToken);
    });
  }
};
refreshToken()


// 카카오 로그인 : 토큰과 페이로드 생성, 회원가입 유도 //
async function kakaoUserForm(authObj, kakaoData) {
  const kakaoUserData = Object.assign({}, authObj, kakaoData)

  const response = await fetch(`${backendBaseUrl}user/kakao/`, {
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
          window.location.replace(`${frontendBaseUrl}index.html`)
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


// 아이디 찾기 //
async function findUsername() {
  const userData = {
    email: document.getElementById("inputEmail").value,
    phone: document.getElementById("inputPhone").value
  }

  const response = await fetch(`${backendBaseUrl}user/myid/`, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(userData)
  })

  response_json = await response.json()

  if (response.status == 200) {
    alert("회원님의 아이디는 [ " + response_json.username + " ]입니다.")
    window.location.replace(`${frontendBaseUrl}login.html`)
  } else {
    alert(response_json["message"])
  }
}


// 비밀번호 변경 자격 확인 //
async function verifyUser() {
  const userDataForVerify = {
    username: document.getElementById("inputUsername").value,
    email: document.getElementById("inputEmail").value
  }

  const response = await fetch(`${backendBaseUrl}user/alterpassword/`, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(userDataForVerify)
  })

  response_json = await response.json()

  if (response.status == 200) {
    alert("비밀번호 변경 페이지로 이동합니다.")
    conveyUserData(response_json)
  } else {
    alert(response_json["message"])
    const popup = document.getElementById("popup")
    popup.style.visibility = "hidden"
  }
}


// 사용자 정보 전달 //
function conveyUserData(response_json) {
  const conveyedData = {
    username: response_json.username,
    email: response_json.email
  }

  return conveyedData
}


// 비밀번호 변경 // 
async function changePassword() {
  conveyUserData(response_json)
  const passwordData = {
    username: conveyUserData(response_json).username,
    email: conveyUserData(response_json).email,
    new_password: document.getElementById("popup-body-new-password").value,
    rewrite_password: document.getElementById("popup-body-rewrite").value
  }

  const response = await fetch(`${backendBaseUrl}user/alterpassword/`, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    method: "PUT",
    body: JSON.stringify(passwordData)
  })

  response_password = await response.json()

  if (response.status == 201) {
    alert(response_password["message"])
    window.location.replace(`${frontendBaseUrl}login.html`)
  } else {
    alert(response_password["message"])
  }
};


// 계정관리 페이지 사용 권한 확인 // 
async function searchUser() {
  const userData = {
    username: document.getElementById("checkUsername").value,
    password: document.getElementById("checkPassword").value
  }

  const response = await fetch(`${backendBaseUrl}user/verification/`, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: "POST",
    body: JSON.stringify(userData)
  })

  verification_json = await response.json()

  if (response.status == 200) {
    const popup = document.getElementById("popup")
    popup.style.visibility = "visible"

    document.getElementById("accountUsername").value = verification_json.username
    document.getElementById("accountFullname").value = verification_json.fullname
    document.getElementById("accountEmail").value = verification_json.email
    document.getElementById("accountPhone").value = verification_json.phone
    document.getElementById("accountBirthday").value = verification_json.birthday
    document.getElementById("accountRegion").value = verification_json.region
  } else {
    alert(verification_json["message"])
    const popup = document.getElementById("popup")
    popup.style.visibility = "hidden"
  }
}


// 계정확인 페이지 : 수정된 데이터 송신 //
async function changeAccount() {
  let changedData

  if (document.getElementById("accountPassword").value) {
    changedData = {
      username: document.getElementById("accountUsername").value,
      password: document.getElementById("accountPassword").value,
      fullname: document.getElementById("accountFullname").value,
      email: document.getElementById("accountEmail").value,
      phone: document.getElementById("accountPhone").value,
      birthday: document.getElementById("accountBirthday").value,
      region: document.getElementById("accountRegion").value
    }
  } else {
    changedData = {
      username: document.getElementById("accountUsername").value,
      fullname: document.getElementById("accountFullname").value,
      email: document.getElementById("accountEmail").value,
      phone: document.getElementById("accountPhone").value,
      birthday: document.getElementById("accountBirthday").value,
      region: document.getElementById("accountRegion").value
    }
  }

  const response = await fetch(`${backendBaseUrl}user/`, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: "PUT",
    body: JSON.stringify(changedData)
  })

  account_response = response.json()

  if (response.status == 201) {
    alert("회원정보 수정이 완료되었습니다.")
    window.location.replace(`${frontendBaseUrl}index.html`)
  } else {
    alert(account_response.data)
  }
}


// 회원 탈퇴 // 
async function withdrawal() {
  const response = await fetch(`${backendBaseUrl}user/`, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: "DELETE"
  })

  withdrawal_json = await response.json()

  if (withdrawal_json.status == 200) {
    alert(withdrawal_json["message"])
    localStorage.removeItem("payload")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")

    window.location.replace(`${frontendBaseUrl}index.html`)
  } else {
    alert(withdrawal_json["message"])
  }
}


// 카카오 회원 탈퇴 //
// function disconnect() {
//   Kakao.API.request({
//     url: '/v1/user/unlink',
//     success: function (response) {
//       localStorage.removeItem("payload")
//       localStorage.removeItem("access")
//       localStorage.removeItem("refresh")

//       window.location.replace(`${frontendBaseUrl}login.html`)
//     },
//     fail: function (error) {
//       alert("회원탈퇴가 이미 처리되었습니다")
//     },
//   })
// }


// 비밀번호 변경 모달 //
$(function () {
  $("#modal-open").click(function () {
    $("#popup").css("display", "flex").hide().fadeIn();
  });

  $("#close").click(function () {
    modalClose();
  });

  function modalClose() {
    $("#popup").fadeOut();
  }
});

