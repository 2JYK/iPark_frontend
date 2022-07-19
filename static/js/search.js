// 옵션 버튼 //
document.querySelectorAll(".button").forEach(
    button => button.innerHTML = "<div><span>" + button.textContent.trim().split("").join("</span><span>") + "</span></div>"
);


// 공원 검색 결과 //
function get_parks_html(id, park_name, image, check_count) {
    temp_html = `<div class="park-box" id="park" onclick="showParkDetail(${id})">
                    <div class="park-image">
                        <img src="${image}" alt="" style="width: 310px; height: 300px; margin-right: 10px;"/>
                    </div>
                    <div class="park-name">
                        <p>${park_name}</p>
                    </div>
                    <div class="park-check-count">
                        <p>조회수 : ${check_count}</p>
                    </div>
                </div>`
    $("#parks").append(temp_html)
}


// 인기 순 공원 나열 //
function popular_parks_html(id, park_name, image, check_count) {
    temp_html = `<div class="park-box" id="park" onclick="showParkDetail(${id})">
                    <div class="park-image">
                        <img src="${image}" alt="" style="width: 310px; height: 300px; margin-right: 10px;"/>
                    </div>
                    <div class="park-name">
                        <p>${park_name}</p>
                    </div>
                    <div class="park-check-count">
                        <p>조회수 : ${check_count}</p>
                    </div>
                </div>`
    $("#popular-parks").append(temp_html)
}


// 쿼리 파라미터를 통한 공원 정보 get //
function getParks(value) {
    $("#parks").empty()

    let query_param = ""
    if (value != undefined) {
        query_param = "?option=" + value
    }

    $.ajax({
        type: "GET",
        url: `${backend_base_url}park/option/` + query_param,
        data: {},
        success: function (response) {
            console.log(response)
            for (let i = 0; i < response.length; i++) {
                get_parks_html(
                    response[i].id,
                    response[i].park_name,
                    response[i].image,
                    response[i].check_count
                )
            }
        }
    });
}
getParks()


// 인기가 많은 공원 순 나열 //
function getPopularParks() {
    $.ajax({
        type: "GET",
        url: `${backend_base_url}park/popularity/`,
        data: {},
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                popular_parks_html(
                    response[i].id,
                    response[i].park_name,
                    response[i].image,
                    response[i].check_count
                )
            }
        }
    })
}
getPopularParks()