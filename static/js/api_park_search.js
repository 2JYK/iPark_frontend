// 쿼리 파라미터를 통한 공원 정보 get 
function getParks() {
    var optionButton = document.getElementsByClassName("option")
    for (var i = 0; i < optionButton.length; i++) {
      optionButton[i].classList.remove("clicked")
    }
  
    var zoneButton = document.getElementsByClassName("option")
    for (var i = 0; i < zoneButton.length; i++) {
      zoneButton[i].classList.remove("clicked")
    }
  
    $("#parks").empty()
  
    let option_param = ""
    for (let i = 0; i < valueList.length; i++) {
      if (valueList[i] != undefined) {
        option_param += "param=" + valueList[i] + "&"
      }
    }
  
    let zone_param = ""
    for (let i = 0; i < zoneList.length; i++) {
      if (zoneList[i] != undefined) {
        zone_param += "param=" + zoneList[i] + "&"
      }
    }
  
    valueList = []
    zoneList = []
  
    $.ajax({
      type: "GET",
      url: `${backendBaseUrl}/park/option/` + "?" + option_param + zone_param,
      data: {},
  
      error: function () {
        temp_html = `<span>조건에 맞는 검색결과가 없습니다.</span>`
        $(".parks").append(temp_html)
        $(".parks").css({ "justify-content": "center" })
      },
  
      success: function (response) {
        for (let i = 0; i < response.length; i++) {
          get_parks_html(
            response[i].id,
            response[i].park_name,
            response[i].image,
            response[i].check_count
          )
        }
      }
    })
  }
  
  
  // 인기가 많은 공원 순 나열
  function getPopularParks() {
    $.ajax({
      type: "GET",
      url: `${backendBaseUrl}/park/popularity/`,
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