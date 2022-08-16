// 쿼리 파라미터를 통한 공원 정보 get 
function getParks(title) {
  $("#parks").empty()

  let option_param = ""
  for (let i = 0; i < valueList.length; i++) {
    if (valueList[i] != undefined) {
      option_param += "param=" + valueList[i] + "&"
    }
  }

  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}/park/option/` + "?" + option_param,
    data: {},

    error: function () {
      temp_html = `<span>조건에 맞는 검색결과가 없습니다.</span>`
      $(".parks").append(temp_html)
      $(".parks").css({ "justify-content": "center" })
    },

    success: function (response) {
      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          get_parks_html(
            title,
            response[i].id,
            response[i].park_name,
            response[i].image,
            response[i].check_count
          )
          document.getElementById("resultCount").innerHTML = "(" + response.length + ")"
        }
      }
      else {
        document.getElementById("resultCount").innerHTML = "(" + 0 + ")"
      }
    }
  })
}


function getParkByName() {
  const parkName = "param=" + document.getElementById("search").value + "&"
  $("#parks").empty()

  $.ajax({
    type: "GET",
    url: `${backendBaseUrl}/park/option/` + "?" + parkName,
    data: {},

    error: function () {
      temp_html = `<span>조건에 맞는 검색결과가 없습니다.</span>`
      $(".parks").append(temp_html)
      $(".parks").css({ "justify-content": "center" })
    },

    success: function (response) {
      if (response) {
        for (let i = 0; i < response.length; i++) {
          get_park_by_name(
            response[i].id,
            response[i].park_name,
            response[i].image,
            response[i].check_count
          )
          document.getElementById("resultCount").innerHTML = "(" + response.length + ")"
        }
      }
      else {
        document.getElementById("resultCount").innerHTML = "(" + 0 + ")"
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
