const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"
console.log("ㅡㅡㅡㅡㅡ 접속 완료 ㅡㅡㅡㅡㅡ")

// 게시글 POST
async function article_post() {
  const image = document.getElementById("popup-body-file").files
  const select = document.getElementById("popup-body-choice").value
  tag = parseInt(select)
  const title = document.getElementById("popup-body-title").value
  const content = document.getElementById("popup-body-content").value
  const formData = new FormData()

  console.log("이미지 :", image)
  console.log("태그 :", tag)
  console.log("태그 :", typeof (tag))
  console.log("제목 :", title)
  console.log("내용 :", content)

  formData.append("image", image)
  formData.append("tag", tag)
  formData.append("title", title)
  formData.append("content", content)

  const response = await fetch(`${backend_base_url}community/`, {
    method: "POST",
    body: formData
  })
  response_json = await response.json()
  if (response.status == 200) {
    alert("게시글 작성 완료")
  }
  else {
    alert(response_json["message"])
  }
}