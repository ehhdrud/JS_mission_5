import axios from "axios";

const NewsList = async (data) => {
  const newsListContainerDiv = document.createElement("div");
  newsListContainerDiv.className = "news-list-container";

  const newsListArticle = document.createElement("article");
  newsListArticle.className = "news-list";
  newsListArticle.dataset.category = data.category;
  newsListContainerDiv.appendChild(newsListArticle);

  const newsListElement = await getNewsList(data);
  newsListElement.forEach((item) => {
    newsListArticle.appendChild(item);
  });

  const scrollObserverElement = getScrollObserver();
  newsListContainerDiv.appendChild(scrollObserverElement);

  intersectionObserver(newsListArticle, scrollObserverElement);
};

const getNewsList = async (page = 1, category) => {
  // const newsArr = [];
  const apiKey = "30c0709466ed425a9882e34b927fe375";
  const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
    category === "all" ? "" : category
  }&page=${page}&pageSize=8&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
  } catch (error) {
    console.log(error);
  }
};
/*
  try {
    const response = await axios.get(url);
    const articles = response.data.articles;

    articles.forEach((data) => {
      if (data.urlToImage === null) {
        data.urlToImage = "../img/noimg.gif";
      }

      if (data.description === null) {
        data.description = "내용없음";
      }

      const newsItem = document.createElement("section");
      newsItem.className = "news-item";
      newsItem.insertAdjacentHTML(
        "beforeend",
        `
                <div class="thumbnail">
                    <a href=${data.url} target="_blank" 
                    rel="noopener noreferrer">
                        <img
                        src=${data.urlToImage}
                        alt="thumbnail" />
                    </a>
                </div>
                <div class="contents">
                    <h2>
                        <a href=${data.url} target="_blank" 
                        rel="noopener noreferrer">
                        ${data.title}
                        </a>
                    </h2>
                    <p>
                    ${data.description}
                    </p>
                </div>
            `
      );
      newsArr.push(newsItem);
    });
    return newsArr;
  }
*/
const getScrollObserver = () => {
  const scrollObserverDiv = document.createElement("div");
  scrollObserverDiv.className = "scroll-observer";
  scrollObserverDiv.dataset.page = "1";
  const img = document.createElement("img");
  img.src = "./img/ball-triangle.svg";
  img.alt = "Loading...";
  scrollObserverDiv.appendChild(img);
};

const intersectionObserver = (newsListArticle, scrollObserverElement) => {
  const callback = async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const nextPage = parseInt(entry.target.dataset["page"]);
        const category = newsListArticle.dataset.category;

        const newsList = await getNewsList(nextPage, category);
        entry.target.dataset["page"] = nextPage + 1;

        if (newsList.length > 0) {
          newsList.forEach((data) => {
            newsListArticle.appendChild(data);
          });
          continue;
        }
        observer.unobserve(entry.target);
        entry.target.remove();
      }
    }
  };
  const observer = new IntersectionObserver(callback, { threshold: 1.0 });
  observer.observe(scrollObserverElement);
};
