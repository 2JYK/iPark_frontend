

// 댓글 작성 
async function postComment(id) {
  const comment = document.getElementById("commentInputComment").value
  const commentHTML = removeHTMLText(comment)
  const commentData = {
    "park": id,
    "comment": commentHTML
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


//북마크 정보 불러오기
async function getParkBookmark(id) {
  token = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
  const response = await fetch(`${backendBaseUrl}/park/${id}/bookmark/`, {
    method: "GET",
    headers: token
  })

  responseJson = await response.json()

  heartDiv = document.getElementById("bookmark")
  heartDiv.innerHTML = `<i id="heart" class="fa-regular fa-heart" type="button" onclick="postBookmark(${id})"></i>
                        <span id= "bookmarkCnt" class="bookmark-cnt">${responseJson.length}</span>`

  //북마크 여부 확인
  if (responseJson !== "") {
    const userid = parseJwt("access").user_id
    const userlist = []

    responseJson.forEach(data => {
      userlist.push(data["user"])
    })

    if (userlist.includes(userid)) {
      const heart = document.getElementById("heart")
      heart.classList.add("fa-solid")
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
    changeBookmarkCount()
    $("#heart").toggleClass("fa-solid");

  } else {
    alert("로그인한 사용자만 이용할 수 있습니다")
  }
}


// 댓글 불러오기
async function getParkComment(id, urlParkCommentPageNum) {
  token = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
  const response = await fetch(`${backendBaseUrl}/park/${id}/comment/?urlParkCommentPageNum=${urlParkCommentPageNum}`, {
    method: "GET",
    headers: token,
  })

  responseJson = await response.json()
  // console.log(responseJson[0])
  comment_total_count = responseJson[1]["comment_total_count"]

  pagination(comment_total_count, 10, 10, urlParkCommentPageNum, id)

  for (let j = 0; j < responseJson[0].length; j++) {
    let timePost = new Date(responseJson[0][j].updated_at)
    let timeBefore = time2str(timePost)

    // 사용자가 댓글 작성자인지를 확인하여 수정,삭제 버튼이 보이게하기 위함
    if (responseJson[0][j].user_id) {
      if (parseJwt("access") == null) {
        $(`#comments${id}`).append(`
        <div class="comment" id="comment">
          <div class="comment-username">
            ${responseJson[0][j].user}
          </div>
          <div class="comment-comment" id="commentContent">
            ${responseJson[0][j].comment}
          </div>
          <div class="comment-upload-time" id="commentUploadTime">
            ${timeBefore}
          </div>
        </div>
      `)
      } else if (responseJson[0][j].user_id == parseJwt("access").user_id) {
        $(`#comments${id}`).append(`
        <div class="comment" id="comment(${responseJson[0][j].id})">
          <div class="comment-username">
            ${responseJson[0][j].user}
          </div>
          <div class="comment-comment" id="commentContent(${responseJson[0][j].id})">
            ${responseJson[0][j].comment}
          </div>
          <div class="comment-upload-time" id="commentUploadTime(${responseJson[0][j].id})">
            ${timeBefore}
          </div>
          <div class="comment-buttons" id="parkCommentButtons">
            <button class="comment-edit" type="button" id="updateButton(${responseJson[0][j].id})" onclick="editComment(${responseJson[0][j].id})">
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button class="comment-delete" type="button" id="deleteButton(${responseJson[0][j].id})" onclick="deleteComment(${responseJson[0][j].id})">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div> 
        </div>
      `)
      } else if (responseJson[0][j].user_id != parseJwt("access").user_id) {
        $(`#comments${id}`).append(`
        <div class="comment" id="comment">
          <div class="comment-username">
            ${responseJson[0][j].user}
          </div>
          <div class="comment-comment" id="commentContent">
            ${responseJson[0][j].comment}
          </div>
          <div class="comment-upload-time" id="commentUploadTime">
            ${timeBefore}
          </div>
        </div>
      `)
      }
    }
  }

}
