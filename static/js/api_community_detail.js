// 게시글 상세페이지
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
  if (response_json.tag == 1) {
    tag_name = "커뮤니티"
  } else {
    tag_name = "나눔마켓"
  }
  console.log("User ID :", response_json.id)
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

  if (response_json.image != null) {
  const article_image = document.getElementById("article_image")
  article_image.setAttribute("src", `http://127.0.0.1:8000${response_json.image}`)
} else {
  const article_image = document.getElementById("article_image")
  article_image.remove(); 
}

  const comment_post = document.getElementById("button-addon2") // 댓글 onclick안에 article id 값 넣어주기 위해 사용
  comment_post.setAttribute("onclick", `article_comment_post(${response_json.id})`)
} getArticlesDetail(receivedData)


// 댓글 POST
async function article_comment_post(article_id) {
  const comment = document.getElementById("comment_post").value
  const commentData = {
    // "user": parseJwt("access").user_id,
    // "article": article_id,
    "comment": comment
  }
  console.log("ㅡCommentㅡ", commentData)

  // 로그인 유저와 비로그인 유저 판별
  if (parseJwt("access") != undefined){
    token = {
      Accept: "application/json",
      'content-type': "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
    }
  } else {
    token = {}
    alert("로그인 유저만 댓글 작성이 가능합니다.")
  } 

  const response = await fetch(`${backendBaseUrl}community/${article_id}/comment/`, {
    method: "POST",
    body: JSON.stringify(commentData),
    headers: token,
  })
  response_json = await response.json()
  if (response.status == 200) {
    alert(response_json["message"])
  } else if (response.status == 400) {
    alert(response_json["message"])
  }
}