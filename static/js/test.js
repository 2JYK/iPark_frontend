async function getPaginationList(id, url) {
    //내가 쓴 게시물 클릭 시 id=3 지정
    three = sessionStorage.getItem("id")
    if (three == 3) {
        id = three
    }
    sessionStorage.removeItem("id")

    let tag_param = ""

    // window.location.href = `${frontendBaseUrl}/community.html?${tag_param}`
    // const receivedData = location.href.split('?')[1];

    if (id !== undefined) {
        tag_param = "id=" + id
    } else if (id == undefined) {
        tag_param = ""
    }

    // history.pushState(null, null, tag_param)


    // url 판별, 이전, 다음 버튼 눌렀을 때 해당하는 url 받아오고 최초접속, 1페이지 인 경우 null
    if (url == null) {
        url = `${backendBaseUrl}/community/?page_size=13&${tag_param}`
        if (String(id).indexOf("http") == 0) {
            url = id
        }
    }
}