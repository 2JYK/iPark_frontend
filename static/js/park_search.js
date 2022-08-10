// 공원 검색 결과 (옵션 버튼 사용)
function get_parks_html(title, id, park_name, image, check_count) {
  temp_html = `<div class="park-box ${title}" id="park" onclick="showParkDetail(${id})">
                <div class="park-image">
                    <img src="${image}" alt="${park_name}" style="width: 190px; height: 180px; margin-right: 10px;"/>
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


// 공원 검색 결과 (검색창 사용)
function get_park_by_name(id, park_name, image, check_count) {
  temp_html = `<div class="park-box" id="park" onclick="showParkDetail(${id})">
                <div class="park-image">
                    <img src="${image}" alt="${park_name}" style="width: 190px; height: 180px; margin-right: 10px;"/>
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


// 인기 순 공원 나열 
function popular_parks_html(id, park_name, image, check_count) {
  temp_html = `<div class="park-box" id="park" onclick="showParkDetail(${id})">
                <div class="park-image">
                    <img src="${image}" alt="${park_name}" style="width: 190px; height: 180px; margin-right: 10px;"/>
                </div>
                <div class="park-name">
                    <p>${park_name}</p>
                </div>
                <div class="park-check-count">
                    <p>조회수 : ${check_count}</p>
                </div>
              </div>`
  $("#popularParks").append(temp_html)
}


// 옵션값을 여러 개 받음 
var values = document.querySelectorAll("#parkOption a")
var valueList = []
values.forEach(value => {
  value.addEventListener("click", () => {
    if (!valueList.includes(value.title)) {
      valueList.push(value.title)
    } else {
      for (let i = 0; i < valueList.length; i++) {
        if (valueList[i] == value.title) {
          valueList.splice(i, 1)
          i--
        }
      }
    }
  })
})


// 공원 옵션 버튼 
document.querySelectorAll(".button").forEach(
  button => button.innerHTML = button.textContent
)


// 버튼 클릭 시 색상 변경, 클릭한 옵션에 따른 공원 검색 결과 제시
var optionButton = document.querySelectorAll("#button")
function controlColor() {
  for (var i = 0; i < optionButton.length; i++) {
    const classes = optionButton[i].classList
    const button = optionButton[i]

    button.addEventListener("click", () => {
      classes.toggle("clicked")
      getParks(button.title)
    })
  }
}
controlColor()