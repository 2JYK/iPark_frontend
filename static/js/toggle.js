// 토글 공원 List 로드 
function showparkList(n, data) {
  const parkList = document.querySelector("#parkList" + n)

  if (parkList.childNodes.length == 0) {
    $.ajax({
      type: "POST",
      url: `${backendBaseUrl}/park/`,
      data: { data },
      success: function (response) {
        for (let i = 0; i < response.length; i++) {
          parkListTempHtml = `
            <li class="nav-item">
              <button class="nav-link active" aria-current="page" 
                style="border: none; background-color: transparent;" 
                onclick="showParkDetail(${response[i].id})">${response[i].park_name}</button>
              <hr>
            </li>`
          $("#parkList" + n).append(parkListTempHtml)
        }
      }
    })
  } else {
    parkList.remove()
  }
}


// 공원 상세 정보 보기 
function showParkDetail(id, urlParkCommentPageNum) {
  // console.log("start")
  if (!urlParkCommentPageNum) {
    urlParkCommentPageNum = 1
  }

  $("#parkDetail").empty()
  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}/park/${id}/`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json")
    },
    data: { id, urlParkCommentPageNum },

    success: function (response) {
      sessionStorage.setItem("park_info", JSON.stringify(response))

      if (urlParkCommentPageNum) {
        window.location.replace(`${frontendBaseUrl}/park_detail.html?park_comment_page=${urlParkCommentPageNum}`)
      } else {
        window.location.replace(`${frontendBaseUrl}/park_detail.html`)
      }
    }
  })
}