// 전역 변수
TOKEN = {
  "Access-Control-Allow-Origin": "*",
  "Authorization": "Bearer " + localStorage.getItem("access"),
}


// 로그인하지 않은 유저 업로드 금지
const modal = document.getElementById("modalOpen")
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
  const body = document.querySelector('body');
  $("#modalOpen").click(function () {
    body.style.overflow = "hidden"  // 스크롤 방지
    $("#popup").css('display', 'flex').hide().fadeIn();
  });

  $("#close").click(function () {
    body.style.overflow = "initial" // 스크롤 방지 해제
    modalClose();
  });

  function modalClose() {
    $("#popup").fadeOut();
  }
});


// 모달 onclick
function openModal() {
  const body = document.querySelector('body');
  body.style.overflow = "hidden"  // 스크롤 방지
  $("#popup").css('display', 'flex').hide().fadeIn();

  //수정 모달 안에 원래 있던 내용 넣어주기
  const oldTitle = document.getElementById("articleTitle")
  const oldContent = document.getElementById("articleContent")
  const inputTitle = document.getElementById("popupBodyTitle")
  const inputContent = document.getElementById("popupBodyContent")
  inputTitle.value = oldTitle.innerHTML
  inputContent.value = oldContent.innerHTML

  document.getElementById("preview").src = document.getElementById("articleImage").src;

  $("#close").click(function () {
    body.style.overflow = "initial" // 스크롤 방지 해제
    modalClose();
  });
  function modalClose() {
    $("#popup").fadeOut();
  }
}


function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("preview").src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    document.getElementById("preview").src = "";
  }
}