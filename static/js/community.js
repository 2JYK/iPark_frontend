// 로그인한 user.id 찾는 함수
function parseJwt(token) {
  var base64Url = localStorage.getItem("access")
  if (base64Url != null) {
    base64Url = base64Url.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(window.atob(base64).split("").map(
      function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
      return JSON.parse(jsonPayload);
    }
  };


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