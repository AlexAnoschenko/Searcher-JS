var mainInput = document.getElementById("mainInput");

const url =
  "https://cors-anywhere.herokuapp.com/https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=buy&place_name=";
const method = "GET";
var city;

mainInput.addEventListener("keydown", startSearch);

function startSearch(e) {
  city = mainInput.value.trim();
  if (e.keyCode === 13) {
    if (city.length > 0) {
      return main();
    } else {
      return;
    }
  } else {
    return;
  }
}

function main() {
  const request = fetch(url + city);

  const jsonStream = request.then(responce => {
    return responce.json();
  });

  jsonStream.then(data => {
    console.log(data);
  });
}
