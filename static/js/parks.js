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
  id) {
  getParkComment(id, urlParkCommentPageNum)
  getParkBookmark(id)

  parkDetailTempHtml = `
    <!-- 첫번째 구간 : 이름, 북마크 -->
    <div class="park-name-mark">
      <div class="park-name">
        <h1>${park_name}</h1>
      </div>
      <div id="bookmark" class="bookmark">
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

    <div class="map-maker-info">지도에서 <img src="static/css/img/marker.png" style="height: 28px;"> 클릭해보세요 ! 길찾기가 가능합니다 </div>

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

    <!-- 주차장 추천 -->
    <br>
    <h6>공원 근처 주차장 <span class="parking-span">* 서울시 공영 주차장 기반 자료입니다.</span></h6>
    <div class="parking-box">
      <div class="parking-lots"></div>
    </div>
    <br>
    <div class="line"></div>

    <!-- 공원 댓글창 -->
    <div>
      <div class="park-comment">
        <form>
        <div class="comment-box" id="commentBox">
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
          <div class="comment-input-comment" id="commnetInputBox">
            <input style="display:none;"/></input>
            <input type="text" id="commentInputComment" onkeydown="enterPostComment(${id})" placeholder="댓글을 입력해주세요. (최대 200자)" maxlength="200" required /></input>
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

}

// 댓글 수정버튼 클릭 -> 수정 상태로 변경
function editComment(comment_id) {
  const editButton = document.getElementById(`updateButton(${comment_id})`)

  if (editButton.innerHTML == `<i class="fa-solid fa-pencil"></i>`) {
    editButton.innerHTML = `<i class="fa-solid fa-check"></i>`

    document.getElementById(`deleteButton(${comment_id})`).style.display = "block"
    document.getElementById(`commentUploadTime(${comment_id})`).style.display = "none"

    const comment = document.getElementById(`commentContent(${comment_id})`)
    comment.innerHTML = `<textarea class="textarea" onkeydown="enterPutComment(${id})" id="inputContent(${comment_id})">${comment.innerText}</textarea>`
    editButton.setAttribute("onclick", `putComment(${comment_id})`)

  } else {
    editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`
    editButton.setAttribute("onclick", `editComment(${comment_id})`)
  }
}

// 댓글 페이지네이션 
function pagination(commentTotalCount, paginationSize, listSize, parkCommentPage, id) {
  // 댓글이 없을 시 댓글박스 숨김처리
  if (commentTotalCount <= 0) {
    document.getElementById("commnetInputBox").innerHTML = `<input type="text" id="commentInputComment" placeholder="첫 댓글을 입력해주세요" required=""></input>`
    document.getElementById("commentBox").style.display = "none"
    document.getElementById("commentPaginationNum").style.display = "none"
  }

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
  )

  // 주차장
  if (x["parking"] == "") {
    temp_html = `<span>주차장 데이터가 없습니다.</span>`
    $(".parking-box").append(temp_html)
    $(".parking-box").css({ "justify-content": "center" })
  }
  for (let i = 0; i < x["parking"].length; i++) {
    temp_html = `<div class="parking-lot">
                    <span class="parking-name">${x["parking"][i]["parking_name"]}</span>
                    <br>
                    <span class="parking-addr">${x["parking"][i]["addr"]}</span>
                    <br>
                    <span class="parking-tel">${x["parking"][i]["tel"]}</span>
                    <br>
                    <span class="parking-operation-rule-nm">${x["parking"][i]["operation_rule_nm"]}</span>
                    <br>
                    <span class="parking-distance">약 ${x["parking"][i]["distance"].toFixed(3)} km</sapn>
                 </div>`
    $(".parking-lots").append(temp_html)
  }

  // 공원 지도 
  var park = new naver.maps.LatLng(x["latitude"], x["longitude"]),
    map = new naver.maps.Map("map", {
      center: park.destinationPoint(0, 180),
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
    '?c=14134663.0407597,4519566.6272867,15,0,0,0,dh" style="text-decoration: none; color: green;" target="_blank">길찾기</a>',
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


// 북마크 갯수 카운트
function changeBookmarkCount() {
  heart = document.getElementById("heart")
  heartCount = document.getElementById("bookmarkCnt")
  if (heart.classList.contains("fa-solid")) {
    heartCount.innerHTML = parseInt(heartCount.innerHTML) - 1
  } else {
    heartCount.innerHTML = parseInt(heartCount.innerHTML) + 1
  }
}