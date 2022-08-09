// 댓글 작성 
async function postComment(id) {
  const comment = document.getElementById("commentInputComment").value
  const commentData = {
    "park": id,
    "comment": comment
  }

  const response = await fetch(`${backendBaseUrl}/park/${id}/comment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: JSON.stringify(commentData)
  })

  response_json = await response.json()
  if (response.status == 200) {
    showParkDetail(id)
  } else if (response.status == 400) {
    alert(response_json["message"])
  } else {
    alert("로그인한 사용자만 이용할 수 있습니다")
  }
}


// 댓글 수정 
async function putComment(comment_id) {
  const inputContent = document.getElementById(`inputContent(${comment_id})`)

  const commentData = {
    "comment": inputContent.value
  }

  const response = await fetch(`${backendBaseUrl}/park/comment/${comment_id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    },
    body: JSON.stringify(commentData)
  })

  response_json = await response.json()
  if (response.status == 200) {
    const comment = document.getElementById(`commentContent(${comment_id})`)
    comment.innerHTML = `
      <div class="comment-comment" id="commentContent(${comment_id})">
        ${inputContent.value}
      </div>
    `
    document.getElementById(`updateButton(${comment_id})`).innerHTML = `<i class="fa-solid fa-pencil"></i>`
    document.getElementById(`deleteButton(${comment_id})`).style.display = "none"
  } else {
    alert(response_json["message"])
  }
}


// 댓글 삭제 
async function deleteComment(comment_id) {
  // ${frontendBaseUrl}/park_detail.html?park_comment_page=${urlParkCommentPageNum}
  const response = await fetch(`${backendBaseUrl}/park/comment/${comment_id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    }
  })

  response_json = await response.json()
  if (response.status == 200) {
    const comment = document.getElementById(`comment(${comment_id})`)
    comment.style.display = "none"
  } else if (response.status == 400) {
    alert(response_json["message"])
  } else {
    alert("로그인한 사용자만 이용할 수 있습니다")
  }
}


// 북마크 등록 및 취소 (공원 상세 페이지)
async function postBookmark(id) {
  const response = await fetch(`${backendBaseUrl}/park/${id}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access")
    }
  })

  response_json = await response.json()
  if (response.status == 200) {
    showParkDetail(id)
  } else {
    alert("로그인한 사용자만 이용할 수 있습니다")
    window.location.reload()
  }
}