const frontend_base_url = "http://127.0.0.1:5500"
// 로그인 //
function kakaoLogin() {
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
          var username = response.id
          var email = response.kakao_account.email
          sendLoggedInData(username, email, "kakao");
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

// DB 보내기 //
async function sendLoggedInData(username, email) {
  alert(username, email);
  const userInfo = {
    username: username, 
    email: email,
    password: "qwertqwert1!",
    fullname: "asdassa",
    phone:"010-1111-2332",
    birthday:2000-20-01,
    region:2
  }

  const response = await fetch(`http://127.0.0.1:8000/user/`, {
    method: "POST",
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(userInfo),
  })
  console.log("됨", response)

  if (response.status == 200) {
    window.location.replace(`http://127.0.0.1:5500/input_info.html`);
  } else {
    console.log("db보내기 실패")
    alert(response.status);
  }
}

// data GET API//
function showUserData() {
  $.ajax({
    type: 'GET',
    url: `http://127.0.0.1:5500/input_info.html`,
    data: {},
    success: function (response) {

      for (let i = 0; i < response.length; i++) {
        append_temp_html(
          response[i].id,
        )
      }
      function append_temp_html(id) {
        temp_html = `
							<div class="username">
								<input class="input-username" id="" type="text" />${id} 흠
							</div>
						`
      }
      $("#user-info").append(temp_html);
    }
  })
}
