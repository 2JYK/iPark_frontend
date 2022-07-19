// 전역 변수
TOKEN = {
	"Access-Control-Allow-Origin": "*",
	"Authorization": "Bearer " + localStorage.getItem("access"),
}

const backendBaseUrl = "http://127.0.0.1:8000/"
const frontendBaseUrl = "http://127.0.0.1:5500/"


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
	park_name, addr, check_count, image, map,
	list_content, admintel, main_equip, template_url, updated_at,
	id, bookmark, username, comments) {

	tempHtml = `
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
				<div>
					<div class="image">
						<img class="img" src="${image}" alt="${park_name}"/>
					</div>
				</div>
				<div>
					<div class="folium-map" id="map_cc438948e3d2987d6030cf0c93c897b8">${map}</div>
				</div>
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
	$("#parkDetail").append(tempHtml)

	// 공원 상세보기 댓글
	for (let j = 0; j < comments.length; j++) {
		let time_post = new Date(comments[j].updated_at)
		let time_before = time2str(time_post)
		$(`#comments${id}`).append(`
			<div class="comment">
				<div class="comment-username">
					<p>${comments[j].username}</p>
				</div>
				<div class="comment-comment">
					<p>${comments[j].comment}</p>
				</div>
				<div class="comment-upload-time">
					<p>${time_before}</p>
				</div>
				<div class="comment-edit">
					<button type="button onclick="editComment(${comments[j].id})">
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


// 공원 상세 정보 보기
window.onload = function showPark(event, park_id = 1) {
	console.log("공원번호", park_id)
	$.ajax({
		type: "GET",
		url: `${backendBaseUrl}park/${park_id}/`,
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Content-type", "application/json");
		},
		success: function (response) {
			appendParkHtml(
				response.park_name,
				response.addr,
				response.check_count,
				response.image,
				response.map,
				response.list_content,
				response.admintel,
				response.main_equip,
				response.template_url,
				response.updated_at,
				response.id,
				response.bookmark,
				response.username,
				response.comments,
			)
		}
	})
}


// 로그인하지 않은 유저 댓글 작성 금지
const commentButton = document.getElementById("commentButton")
commentButton.addEventListener("click", () => {
	if (parseJwt("access") == null) {
		alert("로그인을 해주세요.")
		location.reload();
	}
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
async function postComment(park_id = 1) {
	const comment = document.getElementById("commentInputComment").value
	const commentData = {
		"comment": comment
	}

	const response = await fetch(`${backendBaseUrl}park/${park_id}/comment/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + localStorage.getItem("access")
		},
		body: JSON.stringify(commentData)
	})

	if (response.status == 200) {
		window.location.reload();
		return response

	} else {
		alert(response.status)
	}
}