// 전역 변수 //
const backend_base_url = 'http://127.0.0.1:8000/'
const frontend_base_url = 'http://127.0.0.1:5500/'


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

  const response = await fetch(`${backend_base_url}user/`, {
    headers: {
      Accept: "application/json",
      'Content-type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(signupData)
  })

  response_json = await response.json()

  if (response.status == 200) {
    window.location.replace(`${frontend_base_url}login.html`)
  } else {
    alert(response_json["error"]) // phone의 경우, 메세지가 undefined로 출력됨
  }
}


// 로그인 //
async function handleLogin() {
  const loginData = {
    username: document.getElementById("floatingInput").value,
    password: document.getElementById("floatingPassword").value,
  }

  const response = await fetch(`${backend_base_url}user/api/token/`, {
    headers: {
      Accept: "application/json",
      'Content-type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(loginData)
  })

  response_json = await response.json()

  if (response.status == 200) {
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(
      function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

    localStorage.setItem("payload", jsonPayload);
    window.location.replace(`${frontend_base_url}index.html`)
  } else {
    alert("잘못된 로그인입니다.", response.status)
  }
}


// 로그아웃 // 
async function logout() {
  localStorage.removeItem('payload')
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')

  window.location.replace(`${frontend_base_url}login.html`)
}


// 아이디 찾기 //
async function findUsername() {
  const userData = {
    email: document.getElementById("inputEmail").value,
    phone: document.getElementById("inputPhone").value
  }

  const response = await fetch(`${backend_base_url}user/myid/`, {
    headers: {
      Accept: "application/json",
      'Content-type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(userData)
  })

  response_json = await response.json()

  if (response.status == 200) {
    alert("회원님의 아이디는 [ " + response_json.username + " ]입니다.")
    window.location.replace(`${frontend_base_url}login.html`)
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

  const response = await fetch(`${backend_base_url}user/alterpassword/`, {
    headers: {
      Accept: "application/json",
      'Content-type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(userDataForVerify)
  })

  response_json = await response.json()

  if (response.status == 200) {
    alert("비밀번호 변경 페이지로 이동합니다.")
    conveyUserData(response_json)
  } else {
    alert(response_json["message"]) // 현재 모달이 같은 html 파일에 있어 실패해도 모달이 보이게 된다.
    window.location.replace(`${frontend_base_url}change_password.html`)
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

  const response = await fetch(`${backend_base_url}user/alterpassword/`, {
    headers: {
      Accept: "application/json",
      'Content-type': 'application/json'
    },
    method: "PUT",
    body: JSON.stringify(passwordData)
  })

  response_password = await response.json()

  if (response.status == 200) {
    alert(response_password["message"])
    window.location.replace(`${frontend_base_url}login.html`)
  } else {
    alert(response_password["message"])
  }
}


// 비밀번호 변경 모달
$(function () {
  $("#modal-open").click(function () {
    $("#popup").css('display', 'flex').hide().fadeIn();
  });

  $("#close").click(function () {
    modalClose();
  });

  function modalClose() {
    $("#popup").fadeOut();
  }
});