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
  
  
  // 계정확인 페이지 : 수정된 데이터 송신
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
  
    const response = await fetch(`${backendBaseUrl}/user/`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access")
      },
      body: JSON.stringify(changedData)
    })
  
    account_response = response.json()
    if (response.status == 201) {
      alert("회원정보 수정이 완료되었습니다.")
      window.location.replace(`${frontendBaseUrl}/index.html`)
  
    } else {
      alert(account_response.data)
    }
  }
  
  
  // 회원 탈퇴
  async function withdrawal() {
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
      alert(withdrawal_json["message"])
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
  