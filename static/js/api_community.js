// 게시글 POST
async function article_post() {
  const image = document.getElementById("popup-body-file").files
  const select = document.getElementById("popup-body-choice").value
  tag = parseInt(select)
  const title = document.getElementById("popup-body-title").value
  const content = document.getElementById("popup-body-content").value
  const formData = new FormData()

  formData.append("tag", tag)
  formData.append("title", title)
  formData.append("content", content)
  if (image.length == 1) {
    formData.append("image", image[0])
  }
  const response = await fetch(`${backend_base_url}community/`, {
    method: "POST",
    body: formData,
    headers: TOKEN
  })
  response_json = await response.json()
  console.log(response_json)
  if (response.status == 200) {
    alert("게시글 작성 완료")
    location.reload();
  }
  else {
    alert(response_json["message"])
  }
}


// 게시글 GET
function getArticles(id) {
  $('#tbody').empty()
  let query_param = ''
  if (id != undefined) {
    query_param = '?id=' + id
  }

  let token = {}
  if (id == 3) {
    token = TOKEN
  }

  $.ajax({
    type: 'GET',
    url: `${backend_base_url}community/` + query_param,
    data: {},
    headers: token,
    success: function (response) {
      let postings = response
      for (let i = 0; i < postings.length; i++) {

        let time_post = new Date(postings[i].created_at_time)
        let time_before = time2str(time_post)

        let tag = postings[i].tag
        let tag_name = postings[i].tag_name

        if (tag == 1) {
          tag_name = "커뮤니티"
        } else if (tag == 2) {
          tag_name = "나눔마켓"
        }

        append_temp_html(
          tag_name,
          postings[i].title,
          postings[i].username,
          time_before,
          postings[i].check_count
        )
      }
      function append_temp_html(tag_name, title, username, updated_at, check_count) {
        let tag = "lightsteelblue";
        if (tag_name == "커뮤니티") {
        } else if (tag_name == "나눔마켓") {
          tag = "lightcoral"
        }
        temp_html = `      <tr>
        <td class="${tag}" style="color: ${tag};">${tag_name}</td>
        <td style="text-align: left;">${title}</td>
        <td>${username}</td>
        <td>${updated_at}</td>
        <td>${check_count}</td>
      </tr>`
        $('#tbody').append(temp_html)
      }
    }
  });
} getArticles()


// 검색 GET
function getSearchArticles() {
  $('#tbody').empty()
  query_param = '?keyword=' + $("#search").val()
  $.ajax({
    type: 'GET',
    url: `${backend_base_url}community/search/` + query_param,
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

        append_temp_html(
          tag_name,
          postings[i].title,
          postings[i].username,
          time_before,
          postings[i].check_count
        )
      }
      function append_temp_html(tag_name, title, username, updated_at, check_count) {
        let tag = "lightsteelblue";
        if (tag_name == "커뮤니티") {
        } else if (tag_name == "나눔마켓") {
          tag = "lightcoral"
        }

        temp_html = `      <tr>
        <td class="${tag}" style="color: ${tag};">${tag_name}</td>
        <td style="text-align: left;">${title}</td>
        <td>${username}</td>
        <td>${updated_at}</td>
        <td>${check_count}</td>
      </tr>`

        $('#tbody').append(temp_html)

      }
    }
  });
}