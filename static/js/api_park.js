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

  if (parseJwt("access") == null) {
    alert(response["message"])
  } else {
    if (response.status == 200) {
      showParkDetail(id)
    } else {
      alert(response["message"])
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

  if (response.status == 200) {
    const comment = document.getElementById(`commentContent(${comment_id})`)
    comment.innerHTML = `
        <div class="comment-comment" id="commentContent(${comment_id})">
          ${inputContent.value}
        </div>`

  } else {
    alert(response["message"])
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

  if (parseJwt("access") == null) {
    alert(response["message"])

  } else {
    if (response.status == 200) {
      const comment = document.getElementById(`comment(${comment_id})`)
      comment.style.display = "none"

    } else {
      alert(response["message"])
    }
  }
}


// 쿼리 파라미터를 통한 공원 정보 get 
function getParks() {
  var divText = document.querySelectorAll("#button div")
  var optionButton = document.getElementsByClassName("option")
  for (var i = 0; i < optionButton.length; i++) {
    divText[i].classList.remove("clicked");
    optionButton[i].classList.remove("clicked");
  }

  var zoneButton = document.getElementsByClassName("option")
  for (var i = 0; i < zoneButton.length; i++) {
    divText[i].classList.remove("clicked");
    zoneButton[i].classList.remove("clicked");
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
  });
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