// 게시글 상세페이지
const receivedData = parseInt(location.href.split('?')[1]);
console.log("receivedData :", receivedData)

// 게시글 불러오기
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
  console.log("게시글 ID :", response_json.id)
  const article_tag = document.getElementById("tag")

  const article_tag_h2 = document.createElement("h2")
  article_tag_h2.setAttribute("id", `${response_json.tag}`)

  if (article_tag_h2.id == 1) {
    article_tag_h2.setAttribute("style", "color: lightsteelblue;")
  } else {
    article_tag_h2.setAttribute("style", "color: lightcoral;")
  }
  article_tag_h2.innerText = tag_name
  article_tag.append(article_tag_h2)

  const article_title = document.getElementById("article_title")
  article_title.innerText = response_json.title

  const article_user = document.getElementById("article_user")
  article_user.innerText = response_json.username

  const article_date = document.getElementById("article_date")
  const date = response_json.created_at.split("T")[0]
  article_date.innerText = date

  const view_count = document.getElementById("view_count")
  view_count.innerText = response_json.check_count

  const comment_count = document.getElementById("comment_count")
  comment_count.innerText = response_json.comment_count

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
  comment_post.setAttribute("onclick", `articleCommentPost(${response_json.id})`)

  if (parseJwt("access") != undefined) {
    if (response_json.user == parseJwt("access").user_id) {
      const title_div = document.getElementById("title-control")

      const put_span = document.createElement("span")
      put_span.id = 'modal-open';
      put_span.innerHTML = "수정 "
      title_div.append(put_span)

      const del_span = document.createElement("span")
      del_span.setAttribute("onclick", `deleteArticle(${response_json.id})`)
      del_span.innerHTML = " 삭제 "
      title_div.append(del_span)
    }
  }
} getArticlesDetail(receivedData)


// 게시글 수정
async function updateArticle(receivedData) {
  const image = document.getElementById("popup-body-file").files
  const select = document.getElementById("popup-body-choice").value
  tag = parseInt(select)
  const title = document.getElementById("popup-body-title").value
  const content = document.getElementById("popup-body-content").value
  const formData = new FormData()

  formData.append("tag", tag)
  formData.append("title", title)
  formData.append("content", content)
  if (image.length == 1) {
    formData.append("image", image[0])
  }

  const response = await fetch(`${backendBaseUrl}community/${receivedData}/`, {
    headers: TOKEN,
    body: formData,
    method: 'PUT'
  }
  )
  response_json = await response.json()

  if (response.status == 200) {
    alert("게시글 수정 완료")
    location.reload();
  }
  else {
    alert(response_json["message"])
  }
}


// 게시글 삭제
async function deleteArticle(receivedData) {
  const response = await fetch(`${backendBaseUrl}community/${receivedData}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("access")
    },
    method: 'DELETE'

  }
  )

  if (response.status == 200) {
    window.location.replace(`${frontendBaseUrl}/community.html`);
    alert("게시물이 삭제 되었습니다.")
  } else {
    alert("게시물 작성자만 삭제 가능합니다.")
  }
}


// 댓글 POST
async function articleCommentPost(article_id) {
  const comment = document.getElementById("comment_post").value
  const commentData = {
    // "user": parseJwt("access").user_id,
    // "article": article_id,
    "comment": comment
  }
  console.log("ㅡCommentㅡ", commentData)

  // 로그인 유저와 비로그인 유저 판별
  if (parseJwt("access") != undefined) {
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


// 댓글 GET
async function articleCommentGet(article_id) {
  // 로그인 유저와 비로그인 유저 판별
  if (parseJwt("access") != undefined) {
    token = {
      Accept: "application/json",
      'content-type': "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
    }
  }

  const comment_wrap = document.querySelector(".comment-wrap")
  comment_wrap.innerText = ""

  const response = await fetch(`${backendBaseUrl}community/${article_id}/comment/`, {
    method: 'GET',
    headers: token
  })
  response_json = await response.json()
  response_json.forEach(data => {

    // 댓글 올린 시간 설정
    let created_at = data.created_at.split(".")
    created_date = created_at[0].replace(/-/g, ".").split("T")
    created_time = created_date[1].split(":")

    const comment = document.createElement("div")
    comment.className = 'comment'

    comment.innerHTML = `
    </li>
    <div class="username">${data.username}</div>
    <div class="user-comment">${data.comment}</div>
    <div class="time" id="${data.id}">

    ${created_date[0]} ${created_time[0]}:${created_time[1]}
    </div>
    </li>
    `
    comment_wrap.append(comment)

    if (parseJwt("access") != undefined || token == {}) {
      if (data.user == parseJwt("access").user_id) {
        const time_div = document.getElementById(`${data.id}`)

        const del_span = document.createElement("span")
        del_span.setAttribute("onclick", `articleCommentDel(${data.id})`)
        del_span.innerHTML = "삭제<br>"
        time_div.prepend(del_span)

        const put_span = document.createElement("span")
        put_span.setAttribute("onclick", `data(${data.id})`)
        // del_span.setAttribute("id", `data${data.id}`)
        put_span.innerHTML = "수정"
        time_div.prepend(put_span)
      }
    }
  });
} articleCommentGet(receivedData)


// 댓글 삭제
async function articleCommentDel(comment_id) {
  const response = await fetch(`${backendBaseUrl}community/comment/${comment_id}/`, {
    method: "DELETE",
    headers: TOKEN,
  })
  response_json = await response.json()

  if (parseJwt("access") != undefined) {
    if (response.status == 200) {
      alert(response_json["message"])
    } else {
      alert(response_json["message"])
    }
  }
}