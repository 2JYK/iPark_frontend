// 전역 변수
TOKEN = {
  "Access-Control-Allow-Origin": "*",
  "Authorization": "Bearer " + localStorage.getItem("access"),
}


// 로그인한 user.id 찾는 함수
function parseJwt(token) {
  var base64Url = localStorage.getItem("access")
  if (base64Url != null) {
    base64Url = base64Url.split(".")[1]
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    var jsonPayload = decodeURIComponent(window.atob(base64).split("").map(
      function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(""))
    return JSON.parse(jsonPayload)
  }
}


// 접속 유저 id 확인
if (parseJwt("access") != null) {
  console.log("접속한 user_id : ", parseJwt("access").user_id)
} else {
  console.log("로그인을 하지 않은 상태")
}


// 공원 상세정보 html 구간
function appendParkHtml(
  park_name, addr, check_count, image,
  list_content, admintel, main_equip, template_url, updated_at,
  id, bookmark, user, comments) {

  parkDetailTempHtml = `
			<!-- 첫번째 구간 : 이름, 북마크 -->
			<div class="park-name-mark">
				<div>
					<div class="park-name">${park_name}</div>
				</div>
				<div>
					<div class="bookmark">
						<button type="button">북마크</button>
					</div>
				</div>
			</div>

			<!-- 두번째 구간 : 조회수, 주소  -->
			<div>
				<div class="check-count">조회수 : ${check_count}</div>
			</div>
			<div>
				<div class="addr">${addr}</div>
			</div>

			<!-- 세번째 구간 : 이미지, 지도-->
			<div class="park-image-map">
				<div class="image">
					<img class="img" src="${image}" alt="${park_name}"/>
				</div>
				<div class="map" id="map"></div>
			</div>

			<!-- 네번째 구간 : 설명  -->
			<div class="park-description">
				<div>
					<div class="list-content">${list_content}</div>
				</div>
				<div>
					<div class="admintel">${admintel}</div>
				</div>
				<div>
					<div class="main-equip">${main_equip}</div>
				</div>
			</div>

			<!-- 다섯째 구간 : url, 정보업데이트시간 -->
			<div class="park-url-updated">
				<div>
					<div class="template-url">${template_url}</div>
				</div>
				<div>
					<div class="updated-at">${updated_at}</div>
				</div>
			</div>

			<!-- 공원 댓글창 -->
			<div>
				<div class="park-comment">
					<form action="POST">
					<div class="comment-box">
						<div class="comments" id="comments${id}">
							<!-- 공원 상세보기 댓글 : append.html -->
						</div>
					</div>

					<!-- 댓글 페이지 네이션 -->
					<div class="comment-pagenation">
						<div class="comment-pagenation-left-button">
							<button type="button">
								<
							</button>
						</div>
						<div class="comment-pagenation-num">
							<p>1 2 3</p>
						</div>
						<div class="comment-pagenation-right-button">
							<button type="button">
								>
							</button>
						</div>
					</div>

					<!-- 댓글 입력창 -->
					<div class="comment-input-box">
						<div class="comment-input-comment">
							<input id="commentInputComment" placeholder="댓글을 입력해주세요" /></input>
						</div>
						<div class="comment-input-button">
							<button type="button" id="commentButton" onclick="postComment(${id})">button</button>
						</div>
					</div>
					</form>
				</div>
			</div>
		`
  $("#parkDetail").append(parkDetailTempHtml)

  // 공원 상세보기 댓글
  for (let j = 0; j < comments.length; j++) {
    let time_post = new Date(comments[j].updated_at)
    let time_before = time2str(time_post)
    $(`#comments${id}`).append(`
			<div class="comment" id="comment(${id})">
				<div class="comment-username">
					<p>${comments[j].user}</p>
				</div>
				<div class="comment-comment" id="commentContent">
					<p>${comments[j].comment}</p>
				</div>
				<div class="comment-upload-time">
					<p>${time_before}</p>
				</div>
				<div class="comment-edit">
					<button type="button" id="updateButton" onclick="editComment(${id})">
						edit
					</button>
				</div>
				<div class="comment-delete">
					<button type="button" onclick="deleteComment(${id})">
						<i class="fa-regular fa-trash-can"></i>
					</button>
				</div>
			</div>
		`)
  }
}


// 댓글 수정버튼 -> 수정 상태로 변경 //
function editComment(id) {
  const content = document.getElementById("commentContent")
  content.style.visibility = "hidden"
  const inputContent = document.createElement("textarea")
  inputContent.setAttribute("id", "inputContent")
  inputContent.innerText = content.innerHTML

  const body = document.getElementById(`comment(${id})`)
  body.insertBefore(inputContent, content)

  const updateButton = document.getElementById("updateButton")
  updateButton.setAttribute("onclick", "updateComment()")
}


// 댓글 업데이트 정보 전달 //
async function updateComment() {
  var inputContent = document.getElementById("inputContent")
  const comment = await patchComment(id, inputContent.value);
  inputContent.remove() 
  const content = document.getElementById("commentContent")
  content.style.visibility = "visible"
  updateButton.setAttribute("onclick", "editComment()") 
}


// 댓글 수정 -> 수정 내용 적용 //
async function patchComment(id, content) {
  const commentData = {
      "content": content
  }

  const response = await fetch(`${backendBaseUrl}park/${park_id}/comment/${comment_id}/`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access")
      },
      body: JSON.stringify(commentData)
  }
  )

  if (response.status == 200) {
      // window.location.reload();
  } else {
      alert("댓글 작성자만 수정 가능합니다.")
  }
}


// 댓글 삭제 //
async function deleteComment(id) {
  const response = await fetch(`${backendBaseUrl}park/${park_id}/comment/${comment_id}/`, {
    method: "DELETE",
    headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access")
      }
  })

  if (response.status == 200) {
      // window.location.reload();
  } else {
      alert("댓글 작성자만 삭제 가능합니다.")
  }
}


// 공원 상세 정보 보기
function showParkDetail(id) {
  $("#parkDetail").empty()
  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}park/${id}/`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json");
    },
    success: function (response) {
      sessionStorage.setItem("park_info", JSON.stringify(response))
      window.location.replace(`${frontendBaseUrl}park_detail.html?id=${id}`);

    }
  })
}


// 공원 정보를 sessionStorage에 담아 detail 페이지에서 보여주고 sessionStorage 삭제하기
$(document).ready(function () {
  var x = JSON.parse(sessionStorage.getItem("park_info"))
  appendParkHtml(
    x["park_name"],
    x["addr"],
    x["check_count"],
    x["image"],
    x["list_content"],
    x["admintel"],
    x["main_equip"],
    x["template_url"],
    x["updated_at"],
    x["id"],
    x["bookmark"],
    x["username"],
    x["comments"]
  )

  var park = new naver.maps.LatLng(x["latitude"], x["longitude"]),
    map = new naver.maps.Map('map', {
      center: park.destinationPoint(0, 500),
      zoom: 15
    }),
    marker = new naver.maps.Marker({
      map: map,
      position: park
    });

  var contentString = [
    '<div class="iw_inner">',
    '   <h5>' + x["park_name"] + '</h5>',
    '   <a href="https://map.naver.com/v5/search/' + x["park_name"] +
    '?c=14134663.0407597,4519566.6272867,15,0,0,0,dh">길찾기</a>',
    '</div>'
  ].join('');

  var infowindow = new naver.maps.InfoWindow({
    content: contentString,
    maxWidth: 350,
    backgroundColor: "#eee",
    borderColor: "#2db400",
    borderWidth: 3,
    anchorSize: new naver.maps.Size(30, 30),
    anchorSkew: true,
    anchorColor: "#eee",
    pixelOffset: new naver.maps.Point(20, -20)
  });

  naver.maps.Event.addListener(marker, "click", function (e) {
    if (infowindow.getMap()) {
      infowindow.close();
    } else {
      infowindow.open(map, marker);
    }
  });
  // sessionStorage.removeItem("park_info")
})


// 댓글 시간 나타내기 
function time2str(date) {
  let today = new Date()
  let time = (today - date) / 1000 / 60  // 분

  if (time < 60) {
    return parseInt(time) + "분 전"
  }
  time = time / 60  // 시간

  if (time < 24) {
    return parseInt(time) + "시간 전"
  }
  time = time / 24

  if (time < 7) {
    return parseInt(time) + "일 전"
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
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
    alert("로그인이 필요합니다", response["message"])
  } else {
    if (response.status == 200) {
      showParkDetail(id)
    } else {
      alert("내용을 입력해주세요")
    }
  }
}


// 토글에 공원 목록 붙이기 //
function parkListHtml(id, park_name) {
  parkListTempHtml = `
			<li class="nav-item">
				<button class="nav-link active" aria-current="page" 
				style="border: none; background-color: transparent;" 
				onclick="showParkDetail(${id})">${park_name}</button>
				<hr/>
			</li>`
  $("#parkList").append(parkListTempHtml)
}


// 토글 공원 List 로드 //
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