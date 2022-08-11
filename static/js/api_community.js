// 게시글 POST
async function articlePost() {
  const image = document.getElementById("popupBodyFile").files
  const select = document.getElementById("popupBodyTag").value
  const park = document.getElementById("popupBodyPark").value
  tag = parseInt(select)
  const title = document.getElementById("popupBodyTitle").value
  const titleHTML = removeHTMLText(title)
  const content = document.getElementById("popupBodyContent").value
  const formData = new FormData()

  formData.append("tag", tag)
  formData.append("park", park)
  formData.append("title", titleHTML)
  formData.append("content", content)

  if (image.length == 1) {
    formData.append("image", image[0])
  }

  const response = await fetch(`${backendBaseUrl}/community/`, {
    method: "POST",
    body: formData,
    headers: TOKEN
  })

  response_json = await response.json()
  if (response.status == 200) {
    location.reload();
  } else if (title.length > 35) {
    alert("제목은 35자 이하로 작성해주세요.")
  } else {
    alert(response_json["message"])
  }
}


// 공원 선택옵션
function optionValues() {
  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}/community/park_option/`,
    data: {},
    success: function (response) {
      park_id = response
      for (let i = 0; i < park_id.length; i++) {
        temp_html = `
        <option value="${park_id[i].id}">${park_id[i].park_name}</option>
        `
        $(".popup-body-park").append(temp_html)
      }
    }
  })
} optionValues()


// 게시글 get
async function getPaginationList(id, url) {

  //내가 쓴 게시물 클릭 시 id=3 지정
  three = sessionStorage.getItem("id")
  if (three == 3) {
    id = three
  }
  sessionStorage.removeItem("id")

  let tag_param = ""
  if (id !== undefined) {
    tag_param = "id=" + id
    history.pushState(null, null, tag_param)
  } else if (id == undefined) {
    tag_param = ""
  }

  // url 판별, 이전, 다음 버튼 눌렀을 때 해당하는 url 받아오고 최초접속, 1페이지 인 경우 null
  if (url == null) {
    url = `${backendBaseUrl}/community/?page_size=13&${tag_param}`
    if (String(id).indexOf("http") == 0) {
      url = id
    }
  }

  let token = {}
  if (id == 3 || String(id).indexOf("http") == 0) {
    token = {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
    }
    if (parseJwt("access") == undefined) {
      token = {}
    }
    if (parseJwt("access") == undefined && id == 3) {
      alert("로그인한 사용자만 이용할 수 있습니다")
      location.reload()
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: token
  })
  response_json = await response.json()

  // 게시물 뿌리는 div 선택
  const tbody = document.querySelector(".tbody")
  tbody.innerHTML = "" // 기존내용 초기화

  response_json["results"].forEach(data => {
    let timePost = new Date(data.created_at_time)
    let timeBefore = time2str(timePost)

    let tag = data.tag
    let tagName = data.tagName

    if (tag == 1) {
      tagName = "커뮤니티"
    } else if (tag == 2) {
      tagName = "나눔마켓"
    }

    // append를 이용하기 위해서 div 생성
    const article = document.createElement("tr")
    // class 명 지정
    article.className = "item-mygallery"

    if (tagName == "커뮤니티") {
      tagColor = "lightsteelblue"
    } else if (tagName == "나눔마켓") {
      tagColor = "lightcoral"
    }

    // innerHTML로 원하는 형태로 데이터 출력
    article.innerHTML = `
      <td class="${tagColor}" style="color: ${tagColor};">${tagName}</td>
      <td style="text-align: left;"> <a class="article-title" href="/community_detail.html?${data.id}">
      ${data.title}
      </a> </td>
      <td>${data.username}</td>
      <td>${timeBefore}</td>
      <td>${data.check_count}</td>
      `
    tbody.append(article)
  })

  // 이전버튼 생성할 div 선택
  const previousDiv = document.querySelector(".previous")
  previousDiv.innerHTML = "" // div 내부 초기화
  // 다음버튼 생성할 div 선택
  const nextDiv = document.querySelector(".next")
  nextDiv.innerHTML = "" // div 내부 초기화
  // 구분선 생성할 div 선택
  const hrDiv = document.querySelector(".hr")
  hrDiv.innerHTML = "" // 내부 초기화

  // 이전 버튼 생성
  if (response_json["previous"] != null) {
    const previousBtn = document.createElement("span")
    previousBtn.className = "previousBtn"
    previousBtn.innerHTML = `
          <button type="button" onclick='getPaginationList("${response_json["previous"]}")'> ◀ Prev </button>`;
    previousDiv.append(previousBtn)
  }

  // 구분선 생성
  if (response_json["previous"] != null && response_json["next"] != null) {
    const hr = document.createElement("span")
    hr.className = "hr"
    hr.innerHTML = " | "
    hrDiv.append(hr)
  }

  // 다음 버튼 생성
  if (response_json["next"] != null) {
    const nextBtn = document.createElement("span")
    nextBtn.className = "nextBtn"
    nextBtn.innerHTML = `
          <button type="button" onclick='getPaginationList("${response_json["next"]}")'> Next ▶ </button>`;
    nextDiv.append(nextBtn)
  }
} getPaginationList()


// 검색 GET
function getSearchArticles() {
  $("#best").empty()
  const search = document.getElementById("search").value

  query_param = `?keyword=${search}`

  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}/community/search/${query_param}`,
    data: {},
    success: function (response) {
      let postings = response
      for (let i = 0; i < postings.length; i++) {

        let timePost = new Date(postings[i].created_at_time)
        let timeBefore = time2str(timePost)

        let tag = postings[i].tag
        let tagName = postings[i].tagName

        if (tag == 1) {
          tagName = "커뮤니티"
        } else {
          tagName = "나눔마켓"
        }

        if (tagName == "커뮤니티") {
          tagColor = "lightsteelblue"
        } else if (tagName == "나눔마켓") {
          tagColor = "lightcoral"
        }

        append_temp_html(
          postings[i].id,
          tagName,
          postings[i].title,
          postings[i].username,
          timeBefore,
          postings[i].check_count
        )
      }
      function append_temp_html(id, tagName, title, username, updated_at, check_count) {
        let tag = "lightsteelblue"
        if (tagName == "커뮤니티") {
        } else if (tagName == "나눔마켓") {
          tag = "lightcoral"
        }

        temp_html = `<tr>
                      <td class="${tagColor}" style="color: ${tagColor};">${tagName}</td>
                      <td style="text-align: left;">
                      <a class="article-title" href="/community_detail.html?${id}">
                      ${title}</a>
                      </td>
                      <td>${username}</td>
                      <td>${updated_at}</td>
                      <td>${check_count}</td>
                    </tr>`
        $("#best").append(temp_html)
      }
    }
  })
} 