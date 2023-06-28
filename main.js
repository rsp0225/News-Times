/*
  https://app.newscatcherapi.com/dashboard/
  this api will be expired in 30 days 
*/
const API_KEY = "YdPObq0n5-or2g5_OUus3hHTActkNDLH_sShupdOLIY";

let articles = [];
let page = 1;
let totalPage = 1;

let url = new URL(
  "https://api.newscatcherapi.com/v2/latest_headlines?countries=US&page_size=10"
);

let menus = document.querySelectorAll("#menu-list button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsByTopic(e))
);

const getNews = async () => {
  try {
    let header = new Headers();
    header.append("x-api-key", API_KEY);

    // 8. Attach the page 
    url.searchParams.set("page", page); 

    let response = await fetch(url, { headers: header });
    let data = await response.json();

    if (response.status == 200) {
      if (data.total_hits == 0) {
        console.log("A", data);
        page = 0;
        totalPage = 0;
        renderPagenation();
        throw new Error(data.status);
      }

      console.log("B", data);
      articles = data.articles;
      console.log("articles", articles);
      totalPage = data.total_pages;
      render();
      renderPagenation();
    } else {
      page = 0;
      totalPage = 0;
      renderPagenation();
      throw new Error(data.message);
    }
  } catch (e) {
    console.log("Error Types:", e.name);
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    renderPagenation();
  }
};

const getLatestNews = () => {
  // Reset page to 1 with each new search
  page = 1; 
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&page_size=10`
  );
  getNews();
};

const getNewsByTopic = (event) => {
  let topic = event.target.textContent.toLowerCase();
  page = 1;
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&page_size=10&topic=${topic}`
  );
  getNews();
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const searchNews = () => {
  let keyword = document.getElementById("search-input").value;
  page = 1;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let resultHTML = articles
    .map((news) => {
      return `<div class="news row">
        <div class="col-lg-4">
            <img class="news-img"
                src="${
                  news.media ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }" 
            />
        </div>
        
        <div class="col-lg-8">
            <a class="title" target="_blank" href="${news.link}">
              ${news.title}
            </a>
            
            <p>${
              news.summary == null || news.summary == ""
                ? "No Content"
                : news.summary.length > 200
                ? news.summary.substring(0, 200) + "..."
                : news.summary
            }</p>
            
            <div>${news.rights || "no source"}  
              ${moment(news.published_date).fromNow()}
            </div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = resultHTML;
};

const renderPagenation = () => {
  /*
    1. Show 1 to 5.
    2. Show 6 to 10 => Need "last" and "first".
    3. If the "first" is greater than or equal to 6, add the "prev" button.
    4. If the "last" is not the last page, add the "next" button.
    5. If the last is 5 or fewer pages, then "last" should equal "total page."
    6. If there are 5 or fewer pages, then "first" should equal 1.
  */

  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;

  if (last > totalPage) {
    // If the last group has 5 or fewer
    last = totalPage;
  }

  // If the first group has 5 or fewer
  let first = last - 4 <= 0 ? 1 : last - 4; 

  if (first >= 6) {
    pagenationHTML = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                       </li>`;
  }

  if (last < totalPage) {
    pagenationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalPage})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const pageClick = (pageNum) => {
  //7.Setting click event 
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};

const errorRender = (message) => {
  document.getElementById(
    "news-board"
  ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

getLatestNews();

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};
