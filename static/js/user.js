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
        alert("각 항목을 조건에 맞춰 입력해주세요.")
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
        alert("존재하지 않는 사용자의 정보를 입력하였습니다.")
    }
}