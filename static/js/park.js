// document.ready 페이지네이션 함수 실행시 주는 인자값에 사용함 
const urlParams = new URLSearchParams(window.location.search)
let urlParkCommentPageNum = urlParams.get("park_comment_page")
if (!urlParkCommentPageNum) {
  urlParkCommentPageNum = 1
}


// 공원 상세정보 html 구간
function appendParkHtml(
  park_name, addr, check_count, image,
  list_content, admintel, main_equip, template_url, updated_at,
  id, bookmarks, comments) {

  parkDetailTempHtml = `
    <!-- 첫번째 구간 : 이름, 북마크 -->
    <div class="park-name-mark">
      <div class="park-name">
        <h1>${park_name}</h1>
      </div>
      <div class="bookmark">
        <i id="heart" class="fa-regular fa-heart" type="button" onclick="postBookmark(${id})"></i>
        <span class="bookmark-cnt">${bookmarks.length}</span>
      </div>
    </div>

    <!-- 두번째 구간 : 조회수, 주소  -->
    <div class="check-count-addr">
      <p class="check-count">조회수 : ${check_count}</p>
      <p class="addr">${addr}</p>
    </div>
    <div class="line"></div>

    <!-- 세번째 구간 : 이미지, 지도-->
    <div class="park-image-map">
      <div class="img">
        <img class="img" src="${image}" alt="${park_name}"/>
      </div>
      <div class="map" id="map"></div>
    </div>

    <!-- 네번째 구간 : 설명  -->
    <div class="park-description">
      <div class="list-content">${list_content}</div>
      <div class="main-equip">${main_equip}</div>
      <div class="admintel">${admintel}</div>
    </div>

    <!-- 다섯째 구간 : url, 정보업데이트시간 -->
    <div class="park-url-updated">
      <div class="template-url">
        <a href="${template_url}" class="template-url"><i class="fas fa-hand-point-right fa-fw fa-1x fa-beat-fade"></i>
        ${park_name} 홈페이지 </a>
      </div>
      <div class="updated-at">${updated_at}</div>
    </div>
    <div class="line"></div>

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
        <div class="comment-pagination">
          <div class="comment-pagination-num" id="commentPaginationNum">
            <!-- 페이지 네이션 번호 구간 -->
          </div>
        </div>

        <!-- 댓글 입력창 -->
        <div class="comment-input-box">
          <div class="comment-input-comment">
            <input type="text" id="commentInputComment" placeholder="댓글을 입력해주세요" required /></input>
          </div>
          <div class="comment-input-button">
            <button class="btn btn-outline-secondary" type="button" id="commentButton" onclick="postComment(${id})">등록</button>
          </div>
        </div>
        </form>
      </div>
    </div>
  `
  $("#parkDetail").append(parkDetailTempHtml)

  // 공원 상세보기 댓글
  for (let j = 0; j < comments.length; j++) {
    let timePost = new Date(comments[j].updated_at)
    let timeBefore = time2str(timePost)

    // 사용자가 댓글 작성자인지를 확인하여 수정,삭제 버튼이 보이게하기 위함
    if (comments[j].user_id) {
      if(parseJwt("access") == null) {
        $(`#comments${id}`).append(`
          <div class="comment" id="comment">
            <div class="comment-username">
              ${comments[j].user}
            </div>
            <div class="comment-comment" id="commentContent">
              ${comments[j].comment}
            </div>
            <div class="comment-upload-time" id="commentUploadTime">
              ${timeBefore}
            </div>
          </div>
        `)
      }

    } else if (comments[j].user_id == parseJwt("access").user_id) {
      $(`#comments${id}`).append(`
			<div class="comment" id="comment(${comments[j].id})">
				<div class="comment-username">
					${comments[j].user}
				</div>
				<div class="comment-comment" id="commentContent(${comments[j].id})">
          ${comments[j].comment}
        </div>
				<div class="comment-upload-time" id="commentUploadTime(${comments[j].id})">
					${timeBefore}
				</div>
        <div class="comment-buttons" id="parkCommentButtons">
          <button class="comment-edit" type="button" id="updateButton(${comments[j].id})" onclick="editComment(${comments[j].id})">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="comment-delete" type="button" id="deleteButton(${comments[j].id})" onclick="deleteComment(${comments[j].id})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div> 
			</div>
		`)

    } else if (comments[j].user_id != parseJwt("access").user_id) {
      $(`#comments${id}`).append(`
        <div class="comment" id="comment">
          <div class="comment-username">
            ${comments[j].user}
          </div>
          <div class="comment-comment" id="commentContent">
            ${comments[j].comment}
          </div>
          <div class="comment-upload-time" id="commentUploadTime">
            ${timeBefore}
          </div>
        </div>
      `)
    } 
  }
}

// 댓글 수정버튼 클릭 -> 수정 상태로 변경 //
function editComment(comment_id) {
  const editButton = document.getElementById(`updateButton(${comment_id})`)

  if (editButton.innerHTML == `<i class="fa-solid fa-pencil"></i>`) {
    editButton.innerHTML = `<i class="fa-solid fa-check"></i>`
    editButton.setAttribute("onclick", `putComment(${comment_id})`)

    document.getElementById(`deleteButton(${comment_id})`).style.display = 'block'
    document.getElementById(`commentUploadTime(${comment_id})`).style.display = 'none'

    const comment = document.getElementById(`commentContent(${comment_id})`)
    comment.innerHTML = `<textarea class="textarea" id="inputContent(${comment_id})">${comment.innerText}</textarea>`

    const updateButton = document.getElementById(`updateComment(${comment_id})`)
    updateButton.setAttribute("onclick", `putComment(${comment_id})`)

  } else {
    editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`
    editButton.setAttribute("onclick", `editComment(${comment_id})`)
  }
}

// 댓글 페이지네이션 //
function pagination(commentTotalCount, paginationSize, listSize, parkCommentPage, id) {
  let totalPageSize = Math.ceil(commentTotalCount / listSize)
  let firstBottomNumber = parkCommentPage - parkCommentPage % paginationSize + 1
  let lastBottomNumber = parkCommentPage - parkCommentPage % paginationSize + paginationSize

  if (lastBottomNumber > totalPageSize) lastBottomNumber = totalPageSize
  const paginationNum = document.querySelector(".comment-pagination-num")

  for (let i = firstBottomNumber; i <= lastBottomNumber; i++) {
    if (i == parkCommentPage) {
      paginationNum.innerHTML += `<span class="comment-pagination-num cur-page" id="parkCommentPage(${i})" onclick="showParkDetail('${id}', '${i}')"> ${i} </span>`

    } else {
      paginationNum.innerHTML += `<span class="comment-pagination-num" id="parkCommentPage(${i})" onclick="showParkDetail('${id}', '${i}')"> ${i} </span>`
    }
  }
}


// 공원 상세 페이지 로드시 세션스토리지에 담은 park_info 값 html에 적용 
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
    x["bookmarks"],
    x["comments"],
  )

  // 공원 댓글 페이지네이션 
  pagination(x["comment_total_count"], 10, 10, urlParkCommentPageNum, x["id"])

  // 공원 지도 
  var park = new naver.maps.LatLng(x["latitude"], x["longitude"]),
    map = new naver.maps.Map("map", {
      center: park.destinationPoint(0, 500),
      zoom: 15
    }),
    marker = new naver.maps.Marker({
      map: map,
      position: park
    })

  var contentString = [
    '<div class="iw-inner">',
    '   <h5 style="color: green;">' + x["park_name"] + '</h5>',
    '   <a href="https://map.naver.com/v5/search/' + x["park_name"] +
    '?c=14134663.0407597,4519566.6272867,15,0,0,0,dh" style="text-decoration: none; color: green;">길찾기</a>',
    '</div>'
  ].join("")

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
  })

  naver.maps.Event.addListener(marker, "click", function (e) {
    if (infowindow.getMap()) {
      infowindow.close()
    } else {
      infowindow.open(map, marker)
    }
  })
  // sessionStorage.removeItem("park_info")
})


// 토글에 공원 목록 붙이기
function parkListHtml(id, park_name) {
  parkListTempHtml = `
			<li class="nav-item">
				<button class="nav-link active" aria-current="page" 
				style="border: none; background-color: transparent;" 
				onclick="showParkDetail(${id})">${park_name}</button>
				<hr>
			</li>`
  $("#parkList").append(parkListTempHtml)
}


// 공원 검색 결과 
function get_parks_html(id, park_name, image, check_count) {
  temp_html = `<div class="park-box" id="park" onclick="showParkDetail(${id})">
                <div class="park-image">
                    <img src="${image}" alt="${park_name}" style="width: 190px; height: 180px; margin-right: 10px;"/>
                </div>
                <div class="park-name">
                    <p>${park_name}</p>
                </div>
                <div class="park-check-count">
                    <p>조회수 : ${check_count}</p>
                </div>
              </div>`
  $("#parks").append(temp_html)
}


// 인기 순 공원 나열 
function popular_parks_html(id, park_name, image, check_count) {
  temp_html = `<div class="park-box" id="park" onclick="showParkDetail(${id})">
                <div class="park-image">
                    <img src="${image}" alt="${park_name}" style="width: 190px; height: 180px; margin-right: 10px;"/>
                </div>
                <div class="park-name">
                    <p>${park_name}</p>
                </div>
                <div class="park-check-count">
                    <p>조회수 : ${check_count}</p>
                </div>
              </div>`
  $("#popularParks").append(temp_html)
}


// 옵션값을 여러 개 받음 
var values = document.querySelectorAll("#parkOption a")
var valueList = []
values.forEach(value => {
  value.addEventListener("click", () => {
    if (!valueList.includes(value.title)) {
      valueList.push(value.title)
    } else {
      for (let i = 0; i < valueList.length; i++) {
        if (valueList[i] == value.title) {
          valueList.splice(i, 1)
          i--
        }
      }
    }
  })
})


var zones = document.querySelectorAll(".park-zone a")
var zoneList = []
zones.forEach(zone => {
  zone.addEventListener("click", () => {
    if (!zoneList.includes(zone.title)) {
      zoneList.push(zone.title)
    } else {
      for (let i = 0; i < zoneList.length; i++) {
        if (zoneList[i] == zone.title) {
          zoneList.splice(i, 1)
          i--
        }
      }
    }
  })
})


// 공원 옵션 버튼 
document.querySelectorAll(".button").forEach(
  button => button.innerHTML = button.textContent
)


// 버튼 클릭 시 색상 변경
var optionButton = document.querySelectorAll("#button")
function optionClick(event) {
  event.target.classList.toggle("clicked");
}

function controlColor() {
  for (var i = 0; i < optionButton.length; i++) {
    optionButton[i].addEventListener("click", optionClick);
  }
}
controlColor()


// 북마크 여부 확인
window.onload = function changeBookmark() {
  const userid = parseJwt("access").user_id
  const bookmarks = JSON.parse(sessionStorage.getItem("park_info"))["bookmarks"]
  const userlist = []

  bookmarks.forEach(data => {
    userlist.push(data["user"])
  })

  if (userlist.includes(userid)) {
    const heart = document.getElementById("heart")
    heart.classList.add("fa-solid")
  }
}