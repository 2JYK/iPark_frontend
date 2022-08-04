// 카카오 로그인 : 계정에서 받아온 값을 서버로 보내기
function kakaoLogin() {
    const kakaosignup = document.getElementById("kakaosignup")
    const sign = document.getElementById("sign")
  
    if (Kakao.isInitialized() == false) {
      Kakao.init("c414e5945e36386b3b383a30f1b31271")
    }
  
    Kakao.Auth.login({
      scope: "profile_nickname, account_email",
      success: function (authObj) {
  
        Kakao.API.request({
          url: "/v2/user/me",
          success: function (kakao) {
            const kakaoData = {
              username: kakao.id,
              email: kakao.kakao_account.email,
              fullname: kakao.kakao_account.profile.nickname
            }
            kakaoUserForm(authObj, kakaoData)
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
      }
    })
  }
  
  
  // 카카오 로그아웃
  // function kakaoLogout() {
  //   Kakao.Auth.logout(function () {
  //     localStorage.removeItem("payload")
  //     localStorage.removeItem("access")
  //     localStorage.removeItem("refresh")
  
  //     window.location.replace(`${frontendBaseUrl}login.html`)
  //   })
  // }