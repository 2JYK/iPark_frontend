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
  id, bookmark, user, comments) {

  parkDetailTempHtml = `
			<!-- 첫번째 구간 : 이름, 북마크 -->
			<div class="park-name-mark">
				<div>
					<div class="park-name">${park_name}</div>
				</div>
				<div>
					<div class="bookmark">
						<button type="button" onclick="postBookmark()">북마크</button>
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
					<div class="main-equip">${main_equip}</div>
				</div>
        <div>
          <div class="admintel">${admintel}</div>
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
					<div class="comment-pagination">
						<!-- <div class="comment-pagination-left-button">
							<button type="button">
								<
							</button>
						</div> -->
						<div class="comment-pagination-num" id="comment-pagination-num">
              <!-- 페이지 네이션 번호 구간 -->
						</div>
						<!-- <div class="comment-pagination-right-button">
							<button type="button">
								>
							</button>
						</div> -->
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
			<div class="comment" id="comment(${comments[j].id})">
				<div class="comment-username">
					<p>${comments[j].user}</p>
				</div>
				<div class="comment-comment" id="commentContent(${comments[j].id})">
          ${comments[j].comment}
        </div>
				<div class="comment-upload-time">
					<p>${time_before}</p>
				</div>
				<div class="comment-edit">
					<button type="button" id="updateButton(${comments[j].id})" onclick="editComment(${comments[j].id})">
						edit
					</button>
				</div>
				<div class="comment-delete">
					<button type="button" onclick="deleteComment(${comments[j].id})">
						<i class="fa-regular fa-trash-can"></i>
					</button>
				</div>
			</div>
		`)
  }
}


// 댓글 수정버튼 -> 수정 상태로 변경 
function editComment(comment_id) {
  const editButton = document.getElementById(`updateButton(${comment_id})`)

  if (editButton.innerText == "edit") {
    editButton.innerText = "submit"
    editButton.setAttribute("onclick", `putComment(${comment_id})`)

    const comment = document.getElementById(`commentContent(${comment_id})`)
    comment.innerHTML = `<textarea id="inputContent(${comment_id})">${comment.innerText}</textarea>`

    const updateButton = document.getElementById(`updateComment(${comment_id})`)
    updateButton.setAttribute("onclick", `putComment(${comment_id})`)

  } else {
    editButton.innerText = "edit"
    editButton.setAttribute("onclick", `editComment(${comment_id})`)
  }
}


// 댓글 페이지네이션
function pagination(commentTotalCount, paginationSize, listSize, park_comment_page, id) {
  let totalPageSize = Math.ceil(commentTotalCount / listSize)
  let firstBottomNumber = park_comment_page - park_comment_page % paginationSize + 1
  let lastBottomNumber = park_comment_page - park_comment_page % paginationSize + paginationSize

  if (lastBottomNumber > totalPageSize) lastBottomNumber = totalPageSize
  const paginationNum = document.querySelector(".comment-pagination-num")

  for (let i = firstBottomNumber; i <= lastBottomNumber; i++) {
    if (i == park_comment_page) {
      paginationNum.innerHTML += `<span class="comment-pagination-num cur-page" id="park_comment_page(${i})" onclick="showParkDetail('${id}', '${i}')"> ${i} </span>`

    } else {
      paginationNum.innerHTML += `<span class="comment-pagination-num" id="park_comment_page(${i})" onclick="showParkDetail('${id}', '${i}')"> ${i} </span>`
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
    x["bookmark"],
    x["username"],
    x["comments"],
    x["comment_total_count"]
  )

  // 공원 댓글 페이지네이션 
  pagination(x["comment_total_count"], 10, 10, urlParkCommentPageNum, x["id"])

  // 공원 지도 
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
    '   <h5 style="color: green;">' + x["park_name"] + '</h5>',
    '   <a href="https://map.naver.com/v5/search/' + x["park_name"] +
    '?c=14134663.0407597,4519566.6272867,15,0,0,0,dh" style="text-decoration: none; color: green;">길찾기</a>',
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


// 토글에 공원 목록 붙이기
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


// 공원 옵션 버튼 
document.querySelectorAll(".button").forEach(
  button => button.innerHTML = "<div><span>" + button.textContent.trim().split("").join("</span><span>") + "</span></div>"
);


// 공원 검색 결과 
function get_parks_html(id, park_name, image, check_count) {
  temp_html = `<div class="park-box" id="park" onclick="showParkDetail(${id})">
                <div class="park-image">
                    <img src="${image}" alt="" style="width: 310px; height: 300px; margin-right: 10px;"/>
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
                    <img src="${image}" alt="" style="width: 310px; height: 300px; margin-right: 10px;"/>
                </div>
                <div class="park-name">
                    <p>${park_name}</p>
                </div>
                <div class="park-check-count">
                    <p>조회수 : ${check_count}</p>
                </div>
              </div>`
  $("#popular-parks").append(temp_html)
}


// 옵션값을 여러 개 받음 
var values = document.querySelectorAll("#park-option a")
var valueList = []
values.forEach(value => {
  value.addEventListener("click", () => {
    valueList.push(value.title)
  })
})

var zones = document.querySelectorAll("#park-zone a")
var zoneList = []
zones.forEach(zone => {
  zone.addEventListener("click", () => {
    valueList.push(zone.title)
  })
})


// 버튼 클릭 시 색상 변경
var optionButton = document.querySelectorAll("#button, #button div")
function optionClick(event) {
  event.target.classList.add("clicked");
}

function init() {
  for (var i = 0; i < optionButton.length; i++) {
    optionButton[i].addEventListener("click", optionClick);
  }
}
init();
