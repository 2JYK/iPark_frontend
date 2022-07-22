const receivedData = parseInt(location.href.split('?')[1]);

async function getArticlesDetail(receivedData) {
  if (parseJwt("access") != null) {
    token = {
      'content-type': "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
    }
  } else if (parseJwt("access") == null) {
    token = {}
  }

  const response = await fetch(`${backendBaseUrl}community/${receivedData}/`, {
    method: 'GET',
    headers: token
  })
  response_json = await response.json()
  console.log(response_json)
  if (response_json.tag == 1) {
    tag_name = "커뮤니티"
  } else {
    tag_name = "나눔마켓"
  }

  console.log(response_json.check_count)

  const article_tag = document.getElementById("article_tag")
  article_tag.innerText = tag_name

  const article_title = document.getElementById("article_title")
  article_title.innerText = response_json.title

  const article_user = document.getElementById("article_user")
  article_user.innerText = response_json.username

  const article_date = document.getElementById("article_date")
  const date = response_json.created_at.split("T")[0]
  article_date.innerText = date

  const view_count = document.getElementById("view_count")
  view_count.innerText = response_json.check_count

  const article_content = document.getElementById("article_content")
  article_content.innerText = response_json.content

  const article_image = document.getElementById("article_image")
  article_image.setAttribute("src", `http://127.0.0.1:8000${response_json.image}`)


} getArticlesDetail(receivedData)

