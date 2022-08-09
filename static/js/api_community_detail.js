// 게시글 상세페이지
const receivedData = parseInt(location.href.split("?")[1])


// 게시글 불러오기
async function getArticlesDetail(receivedData) {
  if (parseJwt("access") != null) {
    token = {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
    }
  } else if (parseJwt("access") == null) {
    token = {}
  }

  const response = await fetch(`${backendBaseUrl}/community/${receivedData}/`, {
    method: "GET",
    headers: token
  })

  response_json = await response.json()
  if (response_json.tag == 1) {
    tagName = "커뮤니티"
  } else {
    tagName = "나눔마켓"
  }

  const articleTag = document.getElementById("tag")

  const articleTagH2 = document.createElement("h2")
  articleTagH2.setAttribute("id", `${response_json.tag}`)
  articleTagH2.classList.add("tag-name")


  if (articleTagH2.id == 1) {
    articleTagH2.setAttribute("style", "color: lightsteelblue;")
  } else {
    articleTagH2.setAttribute("style", "color: lightcoral;")
  }

  articleTagH2.innerText = tagName
  articleTag.append(articleTagH2)

  const articleTitle = document.getElementById("articleTitle")
  articleTitle.innerText = response_json.title

  const articlePark = document.getElementById("articlePark")
  articlePark.innerText = response_json.park_name

  const articleUser = document.getElementById("articleUser")
  articleUser.innerText = response_json.username

  const articleDate = document.getElementById("articleDate")
  const date = response_json.created_at.split("T")[0]
  articleDate.innerText = date

  const viewCount = document.getElementById("viewCount")
  viewCount.innerText = response_json.check_count

  const commentCount = document.getElementById("commentCount")
  commentCount.innerText = response_json.comment_count

  const articleContent = document.getElementById("articleContent")
  articleContent.innerText = response_json.content

  if (response_json.image != null) {
    const articleImage = document.getElementById("articleImage")
    articleImage.setAttribute("src", `https://front.ilovepark.net${response_json.image}`)
    // articleImage.setAttribute("src", `http://127.0.0.1:8000${response_json.image}`)
  } else {
    const articleImage = document.getElementById("articleImage")
    articleImage.remove()
  }

  const commentPost = document.getElementById("button-addon2")
  commentPost.setAttribute("onclick", `articleCommentPost(${response_json.id})`)

  if (parseJwt("access") != undefined) {
    if (response_json.user == parseJwt("access").user_id) {
      const titleDiv = document.getElementById("titleControl")

      const putSpan = document.createElement("span")
      putSpan.setAttribute("onclick", "openModal()")
      putSpan.innerHTML = " 수정 "
      titleDiv.append(putSpan)

      const delSpan = document.createElement("span")
      delSpan.setAttribute("onclick", `deleteArticle(${response_json.id})`)
      delSpan.innerHTML = " 삭제 "
      titleDiv.append(delSpan)
    }
  }
} getArticlesDetail(receivedData)


// 게시글 수정
async function updateArticle(receivedData) {
  const image = document.getElementById("popupBodyFile").files
  const title = document.getElementById("popupBodyTitle").value
  const content = document.getElementById("popupBodyContent").value
  const formData = new FormData()

  formData.append("title", title)
  formData.append("content", content)
  if (image.length == 1) {
    formData.append("image", image[0])
  }

  const response = await fetch(`${backendBaseUrl}/community/${receivedData}/`, {
    method: "PUT",
    headers: TOKEN,
    body: formData,
  })

  response_json = await response.json()

  if (response.status == 200) {
    location.reload()
  } else {
    alert(response_json["message"])
  }
}


// 게시글 삭제
async function deleteArticle(receivedData) {
  const response = await fetch(`${backendBaseUrl}/community/${receivedData}/`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    method: "DELETE"
  })

  if (response.status == 200) {
    window.location.replace(`${frontendBaseUrl}/community.html`)
  } else {
    alert("게시물 작성자만 삭제 가능합니다.")
  }
}


// 댓글 POST
async function articleCommentPost(article_id) {
  const comment = document.getElementById("commentPost").value
  const commentHTML = removeHTMLText(comment)
  const commentData = {
    // "user": parseJwt("access").user_id,
    // "article": article_id,
    "comment": commentHTML
  }

  // 로그인 유저와 비로그인 유저 판별
  if (parseJwt("access") != undefined) {
    token = {
      Accept: "application/json",
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
    }
  } else {
    token = {}
    alert("로그인한 사용자만 이용할 수 있습니다")
  }

  const response = await fetch(`${backendBaseUrl}/community/${article_id}/comment/`, {
    method: "POST",
    body: JSON.stringify(commentData),
    headers: token,
  })

  response_json = await response.json()
  const data = response_json.data

  if (response.status == 200) {
    document.getElementById("commentPost").value = ""

    // 댓글 올린 시간 설정
    let createdAt = data.created_at.split(".")
    createdDate = createdAt[0].replace(/-/g, ".").split("T")
    createdTime = createdDate[1].split(":")

    const commentWrap = document.querySelector(".comment-wrap")
    const comment = document.createElement("div")

    // 댓글수 카운트
    const commentCount = document.querySelector("#commentCount")
    commentCount.innerHTML = parseInt(commentCount.innerHTML) + 1

    comment.className = "comment"
    comment.id = `del${data.id}`
    comment.innerHTML = `
      </li>
        <div class="username">${data.username}</div>
        <div class="user-comment">${data.comment}</div>
        <div class="time" id="${data.id}">
        ${createdDate[0]} ${createdTime[0]}:${createdTime[1]}
        </div>
      </li>
    `
    commentWrap.append(comment)

    if (parseJwt("access") != undefined || token == {}) {
      if (data.user == parseJwt("access").user_id) {
        const timeDiv = document.getElementById(`${data.id}`)

        const delSpan = document.createElement("span")
        delSpan.setAttribute("onclick", `articleCommentDel(${data.id})`)
        delSpan.innerHTML = " 삭제 "
        timeDiv.append(delSpan)
      }
    }
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
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
    }
  }

  const commentWrap = document.querySelector(".comment-wrap")
  commentWrap.innerText = ""

  const response = await fetch(`${backendBaseUrl}/community/${article_id}/comment/`, {
    method: "GET",
    headers: token
  })

  response_json = await response.json()
  response_json.forEach(data => {

    // 댓글 올린 시간 설정
    let created_at = data.created_at.split(".")
    created_date = created_at[0].replace(/-/g, ".").split("T")
    createdTime = created_date[1].split(":")

    const comment = document.createElement("div")
    comment.className = "comment"
    comment.id = `del${data.id}`

    comment.innerHTML = `
      </li>
        <div class="username">${data.username}</div>
        <div class="user-comment">${data.comment}</div>
        <div class="time" id="${data.id}">
        ${created_date[0]} ${createdTime[0]}:${createdTime[1]}
        </div>
      </li>
    `
    commentWrap.append(comment)

    if (parseJwt("access") != undefined || token == {}) {
      if (data.user == parseJwt("access").user_id) {
        const timeDiv = document.getElementById(`${data.id}`)

        const delSpan = document.createElement("span")
        delSpan.setAttribute("onclick", `articleCommentDel(${data.id})`)
        delSpan.innerHTML = " 삭제 "
        timeDiv.append(delSpan)
      }
    }
  })
} articleCommentGet(receivedData)


// 댓글 삭제
async function articleCommentDel(comment_id) {
  const response = await fetch(`${backendBaseUrl}/community/comment/${comment_id}/`, {
    method: "DELETE",
    headers: TOKEN,
  })
  response_json = await response.json()

  if (parseJwt("access") != undefined) {
    if (response.status == 200) {
      const del_div = document.querySelector(`#del${comment_id}`)
      del_div.remove()
    
      // 댓글수 카운트
    const commentCount = document.querySelector("#commentCount")
    commentCount.innerHTML = parseInt(commentCount.innerHTML) - 1
    } else {
      alert(response_json["message"])
    }
  }
}