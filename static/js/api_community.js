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
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer " + localStorage.getItem("access"),
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