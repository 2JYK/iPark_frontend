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
