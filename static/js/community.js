// 로그인하지 않은 유저 업로드 금지
const modal = document.getElementById("modalOpen")
modal.addEventListener('click', () => {
  if (parseJwt("access") == null) {
    alert("로그인한 사용자만 이용할 수 있습니다")
    location.reload()
  }
})


// 모달
$(function () {
  const body = document.querySelector("body");
  $("#modalOpen").click(function () {
    body.style.overflow = "hidden"  // 스크롤 방지
    $("#popup").css('display', 'flex').hide().fadeIn();
  })

  $("#close").click(function () {
    body.style.overflow = "initial" // 스크롤 방지 해제
    modalClose();
  })

  function modalClose() {
    $("#popup").fadeOut();
  }
})


// HTML 정규식
function removeHTML(text) {
  text = text.innerHTML.replace(/<[^>]*>?/ig, '\n');  // <br> 태그 변환
  // <, >, & 역정규식 변환
  text = text.replaceAll("&lt;", '<')
  text = text.replaceAll("&gt;", '>')
  text = text.replaceAll("&amp;", '&')

  return text
}


// 모달 onclick
function openModal() {
  const body = document.querySelector("body")
  body.style.overflow = "hidden"  // 스크롤 방지
  $("#popup").css("display", "flex").hide().fadeIn()

  //수정 모달 안에 원래 있던 내용 넣어주기
  const oldTitle = document.getElementById("articleTitle")
  const oldContent = document.getElementById("articleContent")
  const putTitle = removeHTML(oldTitle)
  const putContent = removeHTML(oldContent)
  const oldImage = document.getElementById("articleImage")
  const inputTitle = document.getElementById("popupBodyTitle")
  const inputContent = document.getElementById("popupBodyContent")

  inputTitle.value = putTitle
  inputContent.value = putContent

  if (oldImage) {
  document.getElementById("preview").src = oldImage.src
  }

  $("#close").click(function () {
    body.style.overflow = "initial" // 스크롤 방지 해제
    modalClose()
  })
  function modalClose() {
    $("#popup").fadeOut()
  }
}


// 사진 미리보기 함수
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader()
    reader.onload = function (e) {
      document.getElementById("preview").src = e.target.result
    }
    reader.readAsDataURL(input.files[0])
  } else {
    document.getElementById("preview").src = ""
  }
}