var mainInput = document.getElementById("mainInput");
var mainListing = document.getElementById("main-listing");
var footerUl = document.getElementById("pagination");

const url =
  "https://cors-anywhere.herokuapp.com/https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=buy&place_name=";
const method = "GET";
var city;

favoriveArr = [];
let listingObj = null;
var favorButton = false;
var maxPages = null;
var selectPage = 1;
var prevPage = null;
var nextPage = null;

mainInput.addEventListener("keydown", startSearch);
document.getElementById("modal").addEventListener("click", closeModal);
document.getElementById("mainButton").addEventListener("click", buildFavorite);
document.getElementById("searchButton").addEventListener("click", searchButton);
footerUl.addEventListener("click", changePage);
document.getElementById("footer").addEventListener("click", goFirstLast);

function startSearch(e) {
  city = mainInput.value.trim();
  if (e.keyCode === 13) {
    mainListing.innerHTML = "";
    if (city.length > 0) {
      main();
    }
  }
}

function getData(pageArg) {
  if (pageArg == undefined) {
    return fetch(url + city)
      .then(responce => {
        return responce.json();
      })
      .then(listing => {
        listingObj = listing.response.listings;
        maxPages =
          listing.response.total_pages > 50 ? 50 : listing.response.total_pages;
      });
  } else {
    return fetch(url + city + pageArg)
      .then(responce => {
        return responce.json();
      })
      .then(listing => {
        listingObj = listing.response.listings;
        maxPages =
          listing.response.total_pages > 50 ? 50 : listing.response.total_pages;
      });
  }
}

async function main() {
  await getData();
  buildContent(listingObj, mainListing);
  createPage();
}

function getId(itemData) {
  firstWord = "detail/";
  lastWord = "/title";
  var startIndex = itemData.lister_url.indexOf(firstWord);
  var endIndex = itemData.lister_url.indexOf(lastWord);

  var gotId = itemData.lister_url.slice(
    startIndex + firstWord.length,
    endIndex
  );
  return gotId;
}

function createPage() {
  if (footerUl.innerHTML === "") {
    footerUl.innerHTML = "";
    for (let i = 1; i < 6; i++) {
      var page = document.createElement("li");
      page.classList = "pages";
      page.innerHTML = i;
      if (i === 1) {
        page.classList.add("active");
        page.classList.add("disabled");
      }
      footerUl.appendChild(page);
    }
    firstLast();
    document.getElementById("first").disabled = true;
  } else {
    scrollPage();
  }
}

function scrollPage() {
  footerUl.innerHTML = "";
  if (selectPage === 1) {
    for (let i = 1; i < 6; i++) {
      var page = document.createElement("li");
      page.classList = "pages";
      page.innerHTML = i;
      if (i === 1) {
        page.classList.add("active");
        page.classList.add("disabled");
      }
      footerUl.appendChild(page);
    }
    firstLast();
    document.getElementById("first").disabled = true;
  } else if (selectPage === 2) {
    for (let i = 1; i < 6; i++) {
      var page = document.createElement("li");
      page.classList = "pages";
      page.innerHTML = i;
      if (i === 2) {
        page.classList.add("active");
        page.classList.add("disabled");
      }
      footerUl.appendChild(page);
    }
    firstLast();
  } else if (selectPage === maxPages - 1) {
    for (let i = maxPages - 4; i < maxPages + 1; i++) {
      var page = document.createElement("li");
      page.classList = "pages";
      page.innerHTML = i;
      if (i === maxPages - 1) {
        page.classList.add("active");
        page.classList.add("disabled");
      }
      footerUl.appendChild(page);
    }
    firstLast();
  } else if (selectPage === maxPages) {
    for (let i = maxPages - 4; i < maxPages + 1; i++) {
      var page = document.createElement("li");
      page.classList = "pages";
      page.innerHTML = i;
      if (i === maxPages) {
        page.classList.add("active");
        page.classList.add("disabled");
      }
      footerUl.appendChild(page);
    }
    firstLast();
    document.getElementById("last").disabled = true;
  } else {
    prevPage = selectPage - 2;
    nextPage = selectPage + 3;

    for (let i = prevPage; i < nextPage; i++) {
      var page = document.createElement("li");
      page.classList = "pages";
      page.innerHTML = i;
      if (i === +selectPage) {
        page.classList.add("active");
        page.classList.add("disabled");
      }
      footerUl.appendChild(page);
    }
    firstLast();
  }
}

async function goFirstLast(e) {
  if (e.target.tagName !== "UL") {
    mainListing.innerHTML = "";
    if (e.target.tagName === "INPUT") {
      if (e.target.value === "<<") {
        selectPage = 1;
        await getData("&page=1");
        buildContent(listingObj, mainListing);
        scrollPage();
      } else if (e.target.value === ">>") {
        selectPage = maxPages;
        await getData(`&page= + ${maxPages}`);
        buildContent(listingObj, mainListing);
        scrollPage();
      }
    }
  }
}

function firstLast() {
  var firstPage = document.createElement("input");
  firstPage.type = "button";
  firstPage.id = "first";
  firstPage.classList = "firstLast";
  firstPage.value = "<<";
  footerUl.insertBefore(firstPage, footerUl.children[0]);

  var lastPage = document.createElement("input");
  lastPage.type = "button";
  lastPage.id = "last";
  lastPage.classList = "firstLast";
  lastPage.value = ">>";
  footerUl.appendChild(lastPage);
}

async function changePage(e) {
  if (e.target.tagName === "LI") {
    mainListing.innerHTML = "";
    selectPage = +e.target.innerHTML;
    var pageValue = e.target.innerHTML;
    var pageUrl = "&page=" + pageValue;

    await getData(pageUrl);
    buildContent(listingObj, mainListing);
    scrollPage();
  }
}

function showModal(e) {
  var target = e.currentTarget;

  document.getElementById("modal").style.display = "block";
  document.getElementById("filter").style.display = "block";

  var modalContent = document.createElement("div");
  modalContent.id = "modal-content";
  document.getElementById("modal").appendChild(modalContent);

  var modalImg = document.createElement("div");
  var modalTitle = document.createElement("div");
  var modalBath = document.createElement("div");
  var modalBed = document.createElement("div");

  modalImg.classList = "modal-img";
  modalTitle.classList = "modal-title";
  modalBath.classList = "modal-bath";
  modalBed.classList = "modal-bed";

  modalContent.appendChild(modalImg);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalBath);
  modalContent.appendChild(modalBed);

  var modalButton = document.createElement("input");
  modalButton.id = "modal-button";
  modalButton.type = "button";
  modalButton.value = "Save";
  modalContent.appendChild(modalButton);
  modalButton.addEventListener("click", addFavor);

  for (let i = 0; i < listingObj.length; i++) {
    if (target.getAttribute("itemId") == getId(listingObj[i])) {
      modalContent.setAttribute("itemId", getId(listingObj[i]));
      modalImg.innerHTML = "<img src=" + listingObj[i].img_url + ">";
      modalTitle.innerHTML = "<span>" + listingObj[i].title + "</span>";
      modalBath.innerHTML =
        "<span>Bathroom: " + listingObj[i].bathroom_number + "</span>";
      modalBed.innerHTML =
        "<span>Bedroom: " + listingObj[i].bedroom_number + "</span>";
    }
  }
}

function closeModal(e) {
  if (e.target.tagName !== "INPUT") {
    document.getElementById("modal").innerHTML = "";
    document.getElementById("modal").style.display = "none";
    document.getElementById("filter").style.display = "none";
  }
}

function addFavor() {
  for (let i = 0; i < listingObj.length; i++) {
    if (
      document.getElementById("modal-content").getAttribute("itemId") ===
      getId(listingObj[i])
    ) {
      if (
        localStorage.getItem("favorite") !== null &&
        localStorage.getItem("favorite") !== []
      ) {
        favoriveArr = JSON.parse(localStorage.getItem("favorite"));
        favoriveArr.push(listingObj[i]);
        localStorage.setItem("favorite", JSON.stringify(favoriveArr));
      } else {
        favoriveArr.push(listingObj[i]);
        localStorage.setItem("favorite", JSON.stringify(favoriveArr));
      }
    }
  }
}

function searchButton() {
  document.getElementById("favorite-list").style.display = "none";
  document.getElementById("favorite-list").remove();
  mainListing.style.display = "block";
  document.getElementById("footer").style.display = "block";
}

function buildFavorite() {
  mainListing.style.display = "none";
  document.getElementById("footer").style.display = "none";
  var favoriteList = document.createElement("ul");
  favoriteList.id = "favorite-list";
  document.getElementById("content").appendChild(favoriteList);
  var favorite = JSON.parse(localStorage.getItem("favorite"));
  buildContent(favorite, favoriteList);
}

function buildContent(usingData, usingList) {
  for (let i = 0; i < usingData.length; i++) {
    var newLi = document.createElement("li");
    usingList.appendChild(newLi);

    var itemBlock = document.createElement("div");
    itemBlock.classList = "item-block";
    usingList.children[i].appendChild(itemBlock);
    itemBlock.addEventListener("click", showModal);
    itemBlock.setAttribute("itemId", getId(usingData[i]));

    var imgBlock = document.createElement("div");
    imgBlock.classList = "img-block";
    var contentBlock = document.createElement("div");
    contentBlock.classList = "content-block";
    var infoBlock = document.createElement("div");
    infoBlock.classList = "info-block";

    usingList.children[i].children[0].appendChild(imgBlock);
    imgBlock.innerHTML = "<img src=" + usingData[i].img_url + ">";

    usingList.children[i].children[0].appendChild(contentBlock);
    var titleBlock = document.createElement("div");
    var summaryBlock = document.createElement("div");
    contentBlock.appendChild(titleBlock);
    titleBlock.classList = "title-block";
    titleBlock.innerHTML = "<span>" + usingData[i].title + "</span>";
    contentBlock.appendChild(summaryBlock);
    summaryBlock.classList = "summary-block";
    summaryBlock.innerHTML = "<span>" + usingData[i].summary + "</span>";

    usingList.children[i].children[0].appendChild(infoBlock);
    var priceBlock = document.createElement("div");
    infoBlock.appendChild(priceBlock);
    priceBlock.classList = "price-block";
    priceBlock.innerHTML = "<span>" + usingData[i].price_formatted + "</span>";
  }
}

window.addEventListener("scroll", async () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;

  if (Math.ceil(scrolled) === scrollable) {
    console.log("bottom");
    selectPage += 1;
    var pageUrl = "&page=" + selectPage;
    await getData(pageUrl);
    loadContent();
    scrollPage();
  }
});

function loadContent() {
  for (let i = 0; i < listingObj.length; i++) {
    var newLi = document.createElement("li");
    mainListing.appendChild(newLi);

    var itemBlock = document.createElement("div");
    itemBlock.classList = "item-block";
    newLi.insertBefore(itemBlock, null);
    itemBlock.addEventListener("click", showModal);
    itemBlock.setAttribute("itemId", getId(listingObj[i]));

    var imgBlock = document.createElement("div");
    imgBlock.classList = "img-block";
    var contentBlock = document.createElement("div");
    contentBlock.classList = "content-block";
    var infoBlock = document.createElement("div");
    infoBlock.classList = "info-block";

    itemBlock.insertBefore(imgBlock, null);
    imgBlock.innerHTML = "<img src=" + listingObj[i].img_url + ">";

    itemBlock.insertBefore(contentBlock, null);
    var titleBlock = document.createElement("div");
    var summaryBlock = document.createElement("div");
    contentBlock.appendChild(titleBlock);
    titleBlock.classList = "title-block";
    titleBlock.innerHTML = "<span>" + listingObj[i].title + "</span>";
    contentBlock.appendChild(summaryBlock);
    summaryBlock.classList = "summary-block";
    summaryBlock.innerHTML = "<span>" + listingObj[i].summary + "</span>";

    itemBlock.insertBefore(infoBlock, null);
    var priceBlock = document.createElement("div");
    infoBlock.appendChild(priceBlock);
    priceBlock.classList = "price-block";
    priceBlock.innerHTML = "<span>" + listingObj[i].price_formatted + "</span>";
  }
}
