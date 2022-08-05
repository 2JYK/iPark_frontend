// 즐겨찾기 페이지 user별 북마크 불러오기
async function getBookmark() {
	token = {
		"content-type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Authorization": "Bearer " + localStorage.getItem("access"),
	}
	const response = await fetch(`${backendBaseUrl}/park/bookmark/`, {
		method: "GET",
		headers: token
	})

	response_json = await response.json()
	return response_json
}
getBookmark()


// 북마크 로드
async function loadBookmark() {
	const responseJson = await getBookmark()

	const username = document.getElementById("username")
	username.innerHTML = responseJson["username"]

	const bookmarkBoxes = document.querySelector(".boxes")
	bookmarkBoxes.innerHTML = ""

	responseJson["bookmark_list"].forEach(data => {
		const bookmarkBox = document.createElement("div")
		bookmarkBox.className = "park-box"
		bookmarkBox.innerHTML = `
			
			<div class="wrap">
				<div>
					<h4 class="park-name" onclick="showParkDetail(${data.park_id})">${data.name}</h4>
				</div>
				<div class="content">
					<div class="park-img">
						<img alt="mdo" class="image" onclick="showParkDetail(${data.park_id})" src="${data.image}" 
						width="200px" height="180px" style="border-radius:5%;">
					</div>
					<div class="park-desc">
						<span onclick="showParkDetail(${data.park_id})">${data.desc}</span>
					</div>
				</div>
				<div class="delete">
					<button onclick="deleteBookmark(this.id)" id="${data.bookmark_id}" class="delete-btn">삭제</button>
				</div>	
			</div>
    `
		bookmarkBoxes.append(bookmarkBox)
	})
}
loadBookmark()


// 북마크 삭제
async function deleteBookmark(bookmark_id) {
	const response = await fetch(`${backendBaseUrl}/park/bookmark/?id=${bookmark_id}`, {
		method: "DELETE",
		headers: {
			"Authorization": "Bearer " + localStorage.getItem("access")
		}
	})

	response_json = await response.json()
	if (response.status == 200) {
		window.location.reload()
	}
}
