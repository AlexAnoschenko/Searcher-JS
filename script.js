var mainInput = document.getElementById("mainInput");
var mainListing = document.getElementById("main-listing");

const url =
  "https://cors-anywhere.herokuapp.com/https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=buy&place_name=";
const method = "GET";
var city;
var getData;

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
  const request = fetch(url + city)
    .then(responce => {
      return responce.json();
    })
    .then(listing => {
      console.log(listing);
      for (let i = 0; i < listing.response.listings.length; i++) {
        var newLi = document.createElement("li");
        mainListing.appendChild(newLi);

        var itemBlock = document.createElement("div");
        itemBlock.id = "item-block";
        mainListing.children[i].appendChild(itemBlock);

        var imgBlock = document.createElement("div");
        imgBlock.id = "img-block";
        var contentBlock = document.createElement("div");
        contentBlock.id = "content-block";
        var infoBlock = document.createElement("div");
        infoBlock.id = "info-block";

        mainListing.children[i].children[0].appendChild(imgBlock);
        imgBlock.innerHTML =
          "<img src=" + listing.response.listings[i].img_url + ">";

        mainListing.children[i].children[0].appendChild(contentBlock);
        var titleBlock = document.createElement("div");
        var summaryBlock = document.createElement("div");
        contentBlock.appendChild(titleBlock);
        titleBlock.id = "title-block";
        titleBlock.innerHTML =
          "<span>" + listing.response.listings[i].title + "</span>";
        contentBlock.appendChild(summaryBlock);
        summaryBlock.id = "summary-block";
        summaryBlock.innerHTML =
          "<span>" + listing.response.listings[i].summary + "</span>";

        mainListing.children[i].children[0].appendChild(infoBlock);
        var priceBlock = document.createElement("div");
        infoBlock.appendChild(priceBlock);
        priceBlock.id = "price-block";
        priceBlock.innerHTML =
          "<span>" + listing.response.listings[i].price_formatted + "</span>";
      }
    });
}
