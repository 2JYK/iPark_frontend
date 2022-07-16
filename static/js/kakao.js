// 로그인 //
function kakaoLogin() {
  const kakaoLogin = document.getElementById("kakao-login")
  const userInfo = document.getElementById("user-info")

  if (Kakao.isInitialized() == false) {
    Kakao.init("c414e5945e36386b3b383a30f1b31271")
  }
  Kakao.Auth.login({
    success: function () {
      Kakao.API.request({
        url: "/v2/user/me",
        success: function (response) {
          console.log("성공", response)
          const kakaoUsername = response.id
          const kakaoEmail = response.kakao_account.email

          kakaoLogin.style.visibility = "hidden"
          userInfo.style.visibility = "visible"
          makeLoginForm(kakaoUsername, kakaoEmail)
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
  if (!Kakao.Auth.getAccessToken()) {
    alert("로그아웃 성공")
    return
  }
  Kakao.Auth.logout(function (response) {
    alert(response + " logout")
  })
}


// 회원 탈퇴 //
function disconnect() {
  Kakao.API.request({
    url: '/v1/user/unlink',
    success: function (response) {
      alert("회원탈퇴 성공")
    },
    fail: function (error) {
      alert("회원탈퇴가 이미 처리되었습니다")
    },
  })
}


// 카카오 로그인 성공 -> 받아온 정보값을 회원가입 입력창으로 내용 보내기 (id, email 값) //
function makeLoginForm(kakaoUsername, kakaoEmail) {
  const username = document.getElementById("username")
  const email = document.getElementById("email")

  username.value = kakaoUsername
  email.value = kakaoEmail
}