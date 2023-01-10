const NewsList = async (data) => {
  const newsListContainerDiv = document.createElement("div");
  newsListContainerDiv.className = "news-list-container";

  const newsListArticle = document.createElement("article");
  newsListArticle.className = "news-list";
  newsListArticle.dataset.category = data.category;
  newsListContainerDiv.appendChild(newsListArticle);

  const newsList = await getNewsList(data);
  newsList.forEach((item) => {
    newsListArticle.appendChild(item);
  });

  const scrollObserverElement = getScrollObserver();
  newsListContainerDiv.appendChild(scrollObserverElement);

  intersectionObserver(newsListArticle, scrollObserverElement);

  return newsListContainerDiv;
};

const getNewsList = async (page, category) => {
  const newsListArr = [];
  const pageSize = 5;
  const apiKey = "30c0709466ed425a9882e34b927fe375";
  const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
    category === "all" ? "" : category
  }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const article = response.data.articles;

    article.forEach((data) => {
      const newsItemSection = document.createElement("section");
      newsItemSection.className = "news-item";
      newsItemSection.insertAdjacentHTML(
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
      newsListArr.push(newsItemSection);
    });
    return newsListArr;
  } catch (error) {
    console.log(error);
  }
};

const getScrollObserver = () => {
  const scrollObserverDiv = document.createElement("div");
  scrollObserverDiv.className = "scroll-observer";
  scrollObserverDiv.dataset.page = "1";
  const img = document.createElement("img");
  img.src = "./img/ball-triangle.svg";
  img.alt = "Loading...";
  scrollObserverDiv.appendChild(img);
  return scrollObserverDiv;
};

const intersectionObserver = (newsListArticle, scrollObserverElement) => {
  const callback = async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const nextPage = parseInt(entry.target.dataset.page);
        const category = newsListArticle.dataset.category;

        const newsList = await getNewsList(nextPage, category);
        entry.target.dataset.page = nextPage + 1;

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

export default NewsList;
