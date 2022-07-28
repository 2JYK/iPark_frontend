// 전역 변수
TOKEN = {
  "Access-Control-Allow-Origin": "*",
  "Authorization": "Bearer " + localStorage.getItem("access"),
}


// 로그인하지 않은 유저 업로드 금지
const modal = document.getElementById("modal-open")
modal.addEventListener('click', () => {
  if (parseJwt("access") == null) {
    alert("로그인을 해주세요.")
    location.reload();
  }
})


// 접속 유저 id 확인
if (parseJwt("access") != null) {
  console.log("접속한 user_id : ", parseJwt("access").user_id)
} else {
  console.log("로그인을 하지 않은 상태")
}


// 모달
$(function () {
  $("#modal-open").click(function () {
    $("#popup").css('display', 'flex').hide().fadeIn();
  });

  $("#close").click(function () {
    modalClose();
  });

  function modalClose() {
    $("#popup").fadeOut();
  }
});

// 모달 onclick
function open_modal() {
  $("#popup").css('display', 'flex').hide().fadeIn();

  //수정 모달 안에 원래 있던 내용 넣어주기
  const old_title = document.getElementById("article_title")
  const old_content = document.getElementById("article_content")
  const input_title = document.getElementById("popup-body-title")
  const input_content = document.getElementById("popup-body-content")
  input_title.value = old_title.innerHTML
  input_content.value = old_content.innerHTML

  $("#close").click(function () {
    modalClose();
  });
  function modalClose() {
    $("#popup").fadeOut();
  }
}