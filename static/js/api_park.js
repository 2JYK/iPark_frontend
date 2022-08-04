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
  if (parseJwt("access") == null) {
    alert(response_json["message"])
  } else {
    if (response.status == 200) {
      showParkDetail(id)
    } else {
      alert(response_json["message"])
    }
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
    const editButton = document.getElementById(`updateButton(${comment_id})`)
    editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`
  } else {
    alert(response_json["message"])
  }
}


// 댓글 삭제 
async function deleteComment(comment_id) {
  const response = await fetch(`${backendBaseUrl}/park/comment/${comment_id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access")
    }
  })

  response_json = await response.json()
  if (parseJwt("access") == null) {
    alert(response_json["message"])
  } else {
    if (response.status == 200) {
      const comment = document.getElementById(`comment(${comment_id})`)
      comment.style.display = "none"
    } else {
      alert(response_json["message"])
    }
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
    alert(response_json["message"])
    showParkDetail(id)
  } else {
    alert("잘못된 로그인 정보입니다.")
    window.location.reload()
  }
}