const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"
console.log("접속한 user_id : ", parseJwt('access').user_id)


// 로그인한 user.id 찾는 함수 //
function parseJwt(token) {
  var base64Url = localStorage.getItem("access").split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(
    function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

  return JSON.parse(jsonPayload);
};


// 게시글 POST
async function article_post() {
  const image = document.getElementById("popup-body-file").files
  const select = document.getElementById("popup-body-choice").value
  tag = parseInt(select)
  const title = document.getElementById("popup-body-title").value
  const content = document.getElementById("popup-body-content").value
  const formData = new FormData()

  console.log("user :", parseJwt('access').user_id)
  console.log("이미지 :", image)
  console.log("태그 :", tag)
  console.log("태그 :", typeof (tag))
  console.log("제목 :", title)
  console.log("내용 :", content)

  formData.append("image", image[0])
  formData.append("tag", tag)
  formData.append("title", title)
  formData.append("content", content)

  const response = await fetch(`${backend_base_url}community/`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + localStorage.getItem("access"),
    },
    method: "POST",
    body: formData
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