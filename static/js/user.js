// 전역 변수 //
const backendBaseUrl = "http://127.0.0.1:8000/"
const frontendBaseUrl = "http://127.0.0.1:5500/"


// 카카오 로그인 : 계정에서 받아온 값을 서버로 보내기 //
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


// 카카오 로그아웃 //
// function kakaoLogout() {
//   Kakao.Auth.logout(function () {
//     localStorage.removeItem("payload")
//     localStorage.removeItem("access")
//     localStorage.removeItem("refresh")

//     window.location.replace(`${frontendBaseUrl}login.html`)
//   })
// }


// 로그아웃 // 
async function logout() {
  localStorage.removeItem("payload")
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")

  window.location.replace(`${frontendBaseUrl}login.html`)
}


// 로그인한 user.id 찾는 함수
function parseJwt(token) {
  var base64Url = localStorage.getItem("access")
  if (base64Url != null) {
    base64Url = base64Url.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(window.atob(base64).split("").map(
      function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
    return JSON.parse(jsonPayload);
  }
};


// 로그인 여부 확인 후 드롭박스 변경
const loginbtn = document.getElementById("my-login")
const favorite = document.getElementById("my-favorite")
const article = document.getElementById("my-article")
const divider = document.getElementById("divider")
const account = document.getElementById("my-account")

if (parseJwt("access") != null) {
  loginbtn.innerText = "로그아웃"
} else {
  favorite.style.display = "none"
  article.style.display = "none"
  account.style.display = "none"
  divider.style.display = "none"
  loginbtn.innerText = "로그인"
}


// 시간 함수
function time2str(date) {
  let today = new Date()
  let time = (today - date) / 1000 / 60  // 분

  if (time < 60) {
    return parseInt(time) + "분 전"
  }
  time = time / 60  // 시간

  if (time < 24) {
    return parseInt(time) + "시간 전"
  }
  time = time / 24

  if (time < 7) {
    return parseInt(time) + "일 전"
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
};