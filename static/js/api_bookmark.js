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
  console.log(response_json)

  const bookmark_boxes = document.querySelector(".boxes")
  bookmark_boxes.innerHTML = ""

  response_json.forEach(data => {
    console.log(data)

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
                      <button class="delete-btn">삭제</button>
                  </div>
              </div>
  `
    bookmark_boxes.append(bookmark_box)

  })
}
getBookmark()


