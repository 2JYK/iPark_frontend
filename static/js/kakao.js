const frontend_base_url = "http://127.0.0.1:5500"


// 로그인 //
function kakaoLogin() {
  const kakaoLogin = document.getElementById("kakaologin")
  const userInfo = document.getElementById("user-info")

  if (Kakao.isInitialized() == false) {
    Kakao.init("c414e5945e36386b3b383a30f1b31271");
  }
  Kakao.Auth.login({
    success: function (authObj) {
      console.log(authObj)
      Kakao.API.request({
        url: "/v2/user/me",
        success: function (response) {
          console.log("성공", response);
          const kakaoUsername = response.id
          const kakaoEmail = response.kakao_account.email
          
          kakaoLogin.style.visibility = "hidden"
          userInfo.style.visibility = "visible"
          makeLoginForm(kakaoUsername, kakaoEmail);
        },
        fail: function (error) {
          console.log("실패", error);
          if (!Kakao.Auth.getAccessToken()) {
            alert("로그인상태가 아닙니다")
            return
          }
          Kakao.Auth.logout(function () {
            alert("로그아웃 성공" + Kakao.Auth.getAccessToken())
          })
        }
      });
    },
    fail: function (err) {
      alert(JSON.stringify(err))
    },
  });
}


// 로그아웃 //
function kakaoLogout() {
  console.log("확인1")
  if (!Kakao.Auth.getAccessToken()) {
    console.log('Not logged in.');
    return;
  }
  Kakao.Auth.logout(function (response) {
    alert(response + ' logout');
    //window.location.href='/'
  });
};


// 연결 끊기 //
function disconnect() {
  console.log("확인2")
  Kakao.API.request({
    url: '/v1/user/unlink',
    success: function (response) {
      console.log(response);
      //callback(); //연결끊기(탈퇴)성공시 서버에서 처리할 함수
      //window.location.href='/'
    },
    fail: function (error) {
      console.log("탈퇴 실패", error);
    },
  });
};


// 카카오 로그인 성공 -> 받아온 정보값을 회원가입 입력창으로 내용 보내기 (id, email 값) //
function makeLoginForm(kakaoUsername, kakaoEmail) {
  console.log(kakaoUsername, kakaoEmail)

  const username = document.getElementById("username")
  const email = document.getElementById("email")

  username.value = kakaoUsername
  email.value = kakaoEmail
}