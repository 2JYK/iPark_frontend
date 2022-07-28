//즐겨찾기 페이지 user별 북마크 불러오기
async function getBookmark() {
  token = {
    'content-type': "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization": "Bearer " + localStorage.getItem("access"),
  }
  const response = await fetch(`${backendBaseUrl}park/bookmark/`, {
    method: 'GET',
    headers: token
  }
  )
  response_json = await response.json()

  const bookmark_boxes = document.querySelector(".boxes")
  bookmark_boxes.innerHTML = ""

  response_json.forEach(data => {
    const bookmark_box = document.createElement("div")
    bookmark_box.className = 'park-box'
    bookmark_box.innerHTML = `
  <div>
                  <img src="${data.image}" width="200px" height="180px">
              </div>
              <div class="content">
                  <div>
                      <h3>${data.name}</h3>
                      <br>
                  </div>
                  <div>
                      <span>${data.desc}</span>
                  </div>
                  <div class="delete">
                      <br>
                      <button onclick="postBookmark(this.id)" id="${data.id}" class="delete-btn">삭제</button>
                  </div>
              </div>
  `
    bookmark_boxes.append(bookmark_box)

  })
}
getBookmark()


//북마크 등록 및 취소
async function postBookmark(id) {
  const response = await fetch(`${backendBaseUrl}park/${id}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': "Bearer " + localStorage.getItem("access")
    },
    method: 'POST'
  }
  )
  response_json = await response.json()

  if (response.status == 200) {
    alert(response_json["message"])
    window.location.reload()

  } else {
    alert("잘못된 로그인 정보입니다.")
    window.location.reload();
  }
}



