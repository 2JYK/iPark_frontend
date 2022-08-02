// 전역 변수
const backendBaseUrl = "http://127.0.0.1:8000/"
const frontendBaseUrl = "http://127.0.0.1:5500/"


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


// 로그아웃 
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
    base64Url = base64Url.split(".")[1]
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    var jsonPayload = decodeURIComponent(window.atob(base64).split("").map(
      function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(""))
    return JSON.parse(jsonPayload)
  }
}


// 로그인 여부 확인 후 드롭박스 변경
const loginbtn = document.getElementById("myLogin")
const favorite = document.getElementById("myFavorite")
const article = document.getElementById("myArticle")
const divider = document.getElementById("divider")
const account = document.getElementById("myAccount")

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
}


// 브라우저 종료 시 로그인한 유저의 토큰값 로컬 스토리지에서 삭제
// 유저가 window 사용 시에는 window가 닫힌 것이 아니다.
var closingWindow = false
$(window).on("focus", function () {
  closingWindow = false
})

$(window).on("blur", function () {
  closingWindow = true
  if (!document.hidden) { // window가 최소화된 것은 닫힌 것이 아니다.
    closingWindow = false
  }
  $(window).on("resize", function (e) { // window가 최대화된 것은 닫힌 것이 아니다.
    closingWindow = false
  })
  $(window).off("resize") // multiple listening 회피
})

// 유저가 html을 나간다면 window가 닫힌 것으로 간주
$("html").on("mouseleave", function () {
  closingWindow = true
})

// 유저의 마우스가 window 안에 있다면 토큰들을 삭제하지 않음
$("html").on("mouseenter", function () {
  closingWindow = false
})

$(document).on("keydown", function (e) {
  if (e.keyCode == 91 || e.keyCode == 18) {
    closingWindow = false // 단축키 ALT+TAB (창 변경)
  }
  if (e.keyCode == 116 || (e.ctrlKey && e.keyCode == 82)) {
    closingWindow = false // 단축키 F5, CTRL+F5, CTRL+R (새로고침)
  }
})

// 페이지 새로고침 시 토큰값 삭제 방지
$(document).location.reload(function () {
  closingWindow = false
})

// a 링크를 눌렀을 때 토큰값 삭제 방지
$(document).on("click", "a", function () {
  closingWindow = false
})

// 버튼이 다른 페이지로 redirect한다면 토큰값 삭제 방지
$(document).on("click", "button", function () {
  closingWindow = false
})

// submit이나 form 사용 시 토큰값 삭제 방지
$(document).on("submit", "form", function () {
  closingWindow = false
})

// toDoWhenClosing 함수를 통해 window가 닫히면 토큰 관련 값 전부 삭제
var toDoWhenClosing = function () {
  localStorage.removeItem("payload")
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  return
}

// unload(window가 닫히는 이벤트)가 감지되면 closingWindow가 true가 되고 토큰 관련 값들 전부 삭제
window.addEventListener("unload", function (e) {
  if (closingWindow) {
    toDoWhenClosing()
  }
})

function goToMyArticle() {
  sessionStorage.setItem("id", 3)
  window.location.href = "/community.html"
}