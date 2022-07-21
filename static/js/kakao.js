// 로그인 //
function kakaoLogin() {
  const kakaoLogin = document.getElementById("kakao")
  const userInfo = document.getElementById("userInfo")

  if (Kakao.isInitialized() == false) {
    Kakao.init("c414e5945e36386b3b383a30f1b31271")
  }

  Kakao.Auth.login({
    success: function (kakaokey) {
      console.log("kakaokey : ", kakaokey)

      Kakao.API.request({
        url: "/v2/user/me",
        success: function (response) {
          const kakaoUsername = response.id
          const kakaoEmail = response.kakao_account.email

          kakaoLogin.style.visibility = "hidden"
          userInfo.style.visibility = "visible"
          makeLoginForm(kakaoUsername, kakaoEmail)

          localStorage.setItem("access", kakaokey.access_token);
          localStorage.setItem("refresh", kakaokey.refresh_token);

          const base64Url = kakaokey.id_token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(atob(base64).split("").map(
            function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(""));
          localStorage.setItem("payload", jsonPayload);
        },
        fail: function (error) {
          if (!Kakao.Auth.getAccessToken()) {
            alert("로그인상태가 아닙니다")
            return
          }
          Kakao.Auth.logout(function () {
            alert("로그아웃 성공" + Kakao.Auth.getAccessToken())
          })
        }
      })
    },
    fail: function (err) {
      alert(JSON.stringify(err))
    },
  })
}


// 로그아웃 //
function kakaoLogout() {
  Kakao.Auth.logout(function () {
    localStorage.removeItem("payload")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")

    window.location.replace(`${frontendBaseUrl}login.html`)
  })
}


// 회원 탈퇴 //
function disconnect() {
  Kakao.API.request({
    url: '/v1/user/unlink',
    success: function (response) {
      localStorage.removeItem("payload")
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")

      window.location.replace(`${frontendBaseUrl}login.html`)
    },
    fail: function (error) {
      alert("회원탈퇴가 이미 처리되었습니다")
    },
  })
}


// 카카오 로그인 성공 -> 받아온 정보값을 회원가입 입력창으로 내용 보내기 (id, email 값) //
function makeLoginForm(kakaoUsername, kakaoEmail) {
  const username = document.getElementById("floatingInput")
  const email = document.getElementById("floatingInputEmail")

  username.value = kakaoUsername
  email.value = kakaoEmail
}