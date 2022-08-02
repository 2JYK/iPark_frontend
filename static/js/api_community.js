// 게시글 POST
async function article_post() {
  const image = document.getElementById("popup_body_file").files
  const select = document.getElementById("popup_body_tag").value
  const park = document.getElementById("popup_body_park").value
  tag = parseInt(select)
  const title = document.getElementById("popup_body_title").value
  const content = document.getElementById("popup_body_content").value
  const formData = new FormData()

  formData.append("tag", tag)
  formData.append("park", park)
  formData.append("title", title)
  formData.append("content", content)
  if (image.length == 1) {
    formData.append("image", image[0])
  }
  const response = await fetch(`${backendBaseUrl}community/`, {
    method: "POST",
    body: formData,
    headers: TOKEN
  })
  response_json = await response.json()
  if (response.status == 200) {
    alert("게시글 작성 완료")
    location.reload();
  }else if (title.length > 35){
    alert("제목은 35자 이하로 작성해주세요.")
  }
  else {
    alert(response_json["message"])
  }
}


// 공원 선택옵션
function option_values() {
  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}community/park_option/`,
    data: {},
    success: function (response) {
      park_id = response
      for(let i = 0; i < park_id.length; i++) {
        temp_html = `
        <option value="${park_id[i].id}">${park_id[i].park_name}</option>
        `
        $(".popup-body-park").append(temp_html)
      }
    }
  });
} option_values()


// 게시글 get
async function get_pagination_list(id, url) {

  //내가 쓴 게시물 클릭 시 id=3 지정
  three = sessionStorage.getItem("id")
  if (three == 3) {
    id = three
  }
  sessionStorage.removeItem("id")

  let tag_param = ""
  if (id !== undefined) {
    tag_param = "id=" + id
  } else if (id == undefined) {
    tag_param = ""
  }

  // url 판별, 이전, 다음 버튼 눌렀을 때 해당하는 url 받아오고 최초접속, 1페이지 인 경우 null
  if (url == null) {
    url = `${backendBaseUrl}community/?page_size=13&${tag_param}`
    if (String(id).indexOf("http") == 0) {
      url = id
    }
  }

  let token = {}
  if (id == 3 || String(id).indexOf("http") == 0) {
    token = {
      'content-type': "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
    }
    if (parseJwt("access") == undefined) {
      token = {}
    }
    if (parseJwt("access") == undefined && id == 3) {
      alert("로그인을 해주세요.")
      location.reload();
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: token
  })
  response_json = await response.json()

  // 게시물 뿌리는 div 선택
  const tbody = document.querySelector(".tbody");
  tbody.innerHTML = "" // 기존내용 초기화

  response_json["results"].forEach(data => {
    let time_post = new Date(data.created_at_time)
    let time_before = time2str(time_post)

    let tag = data.tag
    let tag_name = data.tag_name

    if (tag == 1) {
      tag_name = "커뮤니티"
    } else if (tag == 2) {
      tag_name = "나눔마켓"
    }

    // append를 이용하기 위해서 div 생성
    const article = document.createElement('tr')
    // class 명 지정
    article.className = 'item-mygallery';

    if (tag_name == "커뮤니티") {
      tag_color = "lightsteelblue";
    } else if (tag_name == "나눔마켓") {
      tag_color = "lightcoral"
    }

    // innerHTML로 원하는 형태로 데이터 출력
    article.innerHTML = `
      <td class="${tag_color}" style="color: ${tag_color};">${tag_name}</td>
      <td style="text-align: left;"> <a class="article-title" href="/community_detail.html?${data.id}">
      ${data.title}
      </a> </td>
      <td>${data.username}</td>
      <td>${time_before}</td>
      <td>${data.check_count}</td>
      `
    tbody.append(article)
  })

  // 이전버튼 생성할 div 선택
  const previous_div = document.querySelector(".previous")
  previous_div.innerHTML = "" // div 내부 초기화
  // 다음버튼 생성할 div 선택
  const next_div = document.querySelector(".next")
  next_div.innerHTML = "" // div 내부 초기화
  // 구분선 생성할 div 선택
  const hr_div = document.querySelector(".hr")
  hr_div.innerHTML = "" // 내부 초기화

  // 이전 버튼 생성
  if (response_json["previous"] != null) {
    const previous_btn = document.createElement("span")
    previous_btn.classNAme = "previous_btn";
    previous_btn.innerHTML = `
          <button type="button" onclick='get_pagination_list("${response_json["previous"]}")'> ◀ Prev </button>`;
    previous_div.append(previous_btn)
  }

  // 구분선 생성
  if (response_json["previous"] != null && response_json["next"] != null) {
    const hr = document.createElement("span")
    hr.className = "hr";
    hr.innerHTML = " | "
    hr_div.append(hr)
  }

  // 다음 버튼 생성
  if (response_json["next"] != null) {
    const next_btn = document.createElement("span")
    next_btn.classNAme = "next_btn";
    next_btn.innerHTML = `
          <button type="button" onclick='get_pagination_list("${response_json["next"]}")'> Next ▶ </button>`;
    next_div.append(next_btn)
  }
} get_pagination_list()


// 검색 GET
function getSearchArticles() {
  $("#best").empty()
  const search = document.getElementById("search").value

  query_param = `?keyword=${search}`

  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}community/search/${query_param}`,
    data: {},
    success: function (response) {
      let postings = response
      for (let i = 0; i < postings.length; i++) {

        let time_post = new Date(postings[i].created_at_time)
        let time_before = time2str(time_post)

        let tag = postings[i].tag
        let tag_name = postings[i].tag_name

        if (tag == 1) {
          tag_name = "커뮤니티"
        } else {
          tag_name = "나눔마켓"
        }

        if (tag_name == "커뮤니티") {
          tag_color = "lightsteelblue";
        } else if (tag_name == "나눔마켓") {
          tag_color = "lightcoral"
        }

        append_temp_html(
          postings[i].id,
          tag_name,
          postings[i].title,
          postings[i].username,
          time_before,
          postings[i].check_count
        )
      }
      function append_temp_html(id, tag_name, title, username, updated_at, check_count) {
        let tag = "lightsteelblue";
        if (tag_name == "커뮤니티") {
        } else if (tag_name == "나눔마켓") {
          tag = "lightcoral"
        }

        temp_html = `<tr>
                      <td class="${tag_color}" style="color: ${tag_color};">${tag_name}</td>
                      <td style="text-align: left;">
                      <a class="article-title" href="/community_detail.html?${id}">
                      ${title}</a>
                      </td>
                      <td>${username}</td>
                      <td>${updated_at}</td>
                      <td>${check_count}</td>
                    </tr>`
        $('#best').append(temp_html)
      }
    }
  });
} 