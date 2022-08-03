// 토글 공원 List 로드 
function showparkList() {
  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}park/`,

    success: function (response) {
      for (let i = 0; i < response.length; i++) {
        parkListHtml(
          response[i].id,
          response[i].park_name
        )
      }
    }
  })
}
showparkList()


// 공원 상세 정보 보기 
function showParkDetail(id, urlParkCommentPageNum) {
  if (!urlParkCommentPageNum) {
    urlParkCommentPageNum = 1
  }

  $("#parkDetail").empty()
  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}park/${id}/`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json")
    },
    data: { id, urlParkCommentPageNum },

    success: function (response) {
      sessionStorage.setItem("park_info", JSON.stringify(response))
      if (urlParkCommentPageNum) {
        window.location.replace(`${frontendBaseUrl}park_detail.html?park_comment_page=${urlParkCommentPageNum}`)

      } else {
        window.location.replace(`${frontendBaseUrl}park_detail.html`)
      }
    }
  })
}


// 댓글 작성 
async function postComment(id) {
  const comment = document.getElementById("commentInputComment").value
  const commentData = {
    "park": id,
    "comment": comment
  }

  const response = await fetch(`${backendBaseUrl}park/${id}/comment/`, {
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

  const response = await fetch(`${backendBaseUrl}park/comment/${comment_id}/`, {
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
      </div>`

    const editButton = document.getElementById(`updateButton(${comment_id})`)
    editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`
    showParkDetail(id)

  } else {
    alert(response_json["message"])
  }
}


// 댓글 삭제 
async function deleteComment(comment_id) {
  const response = await fetch(`${backendBaseUrl}park/comment/${comment_id}/`, {
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
      showParkDetail(id)

    } else {
      alert(response_json["message"])
    }
  }
}


// 쿼리 파라미터를 통한 공원 정보 get 
function getParks() {
  var optionButton = document.getElementsByclassName("option")
  for (var i = 0; i < optionButton.length; i++) {
    optionButton[i].classList.remove("clicked")
  }

  var zoneButton = document.getElementsByclassName("option")
  for (var i = 0; i < zoneButton.length; i++) {
    zoneButton[i].classList.remove("clicked")
  }

  $("#parks").empty()

  let option_param = ""
  for (let i = 0; i < valueList.length; i++) {
    if (valueList[i] != undefined) {
      option_param += "param=" + valueList[i] + "&"
    }
  }

  let zone_param = ""
  for (let i = 0; i < zoneList.length; i++) {
    if (zoneList[i] != undefined) {
      zone_param += "param=" + zoneList[i] + "&"
    }
  }

  valueList = []
  zoneList = []

  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}park/option/` + "?" + option_param + zone_param,
    data: {},

    success: function (response) {
      for (let i = 0; i < response.length; i++) {
        get_parks_html(
          response[i].id,
          response[i].park_name,
          response[i].image,
          response[i].check_count
        )
      }
    }
  })
}


// 인기가 많은 공원 순 나열
function getPopularParks() {
  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}park/popularity/`,
    data: {},

    success: function (response) {
      for (let i = 0; i < response.length; i++) {
        popular_parks_html(
          response[i].id,
          response[i].park_name,
          response[i].image,
          response[i].check_count
        )
      }
    }
  })
}
getPopularParks()


//북마크 API 시작
//즐겨찾기 페이지 user별 북마크 불러오기
async function getBookmark() {
  token = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization": "Bearer " + localStorage.getItem("access"),
  }
  const response = await fetch(`${backendBaseUrl}park/bookmark/`, {
    method: "GET",
    headers: token
  })

  response_json = await response.json()
  return response_json
}
getBookmark()


//북마크 등록 및 취소 (공원 상세 페이지)
async function postBookmark(id) {
  const response = await fetch(`${backendBaseUrl}park/${id}/`, {
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


//북마크 삭제 (북마크 페이지)
async function deleteBookmark(bookmark_id) {
  const response = await fetch(`${backendBaseUrl}park/bookmark/?id=${bookmark_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("access")
    }
  })

  response_json = await response.json()
  if (response.status == 200) {
    alert(response_json["message"])
    window.location.reload()
  }
}