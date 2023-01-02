const NewsList = () => {
  let category = "all";
  let page = 0;
  const pageSize = 5;
  const apiKey = "30c0709466ed425a9882e34b927fe375";
  let url;

  //newsListContainer 생성
  let newsListContainer = document.createElement("div");
  newsListContainer.classList.add("news-list-container");
  document.querySelector("#root").appendChild(newsListContainer);

  //article 생성
  let article = document.createElement("article");
  article.classList.add("news-list");
  newsListContainer.appendChild(article);

  const showPost = (posts) => {
    posts.forEach((post) => {
      const section = document.createElement("section");
      section.classList.add("news-item");
      section.innerHTML = `
            <div class="thumbnail">
              <a href=${post.url} target="_blank" rel="noopener noreferrer">
                <img
                  src=${post.urlToImage}
                  alt="thumbnail" />
              </a>
            </div>
            <div class="contents">
              <h2>
                <a href=${post.url} target="_blank" rel="noopener noreferrer">
                  ${post.title}
                </a>
              </h2>
              <p>
                ${post.description}
              </p>
            </div>
            `;
      article.appendChild(section);
    });
  };

  //scrollObserver 생성
  let scrollObserver = document.createElement("div");
  scrollObserver.classList.add("scroll-observer");
  newsListContainer.appendChild(scrollObserver);

  const spinner = document.createElement("img");
  spinner.src = "img/ball-triangle.svg";
  spinner.alt = "Loading...";

  // callback 함수 정의
  const callback = (entries, io) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        page++;
        console.log(page);
        url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
          category === "all" ? "" : category
        }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
        try {
          const response = await axios.get(url);
          await showPost(response.data.articles);
          scrollObserver.appendChild(spinner);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  // option 설정
  const option = {
    threshold: 0.8,
  };

  // IntersectionsObserver 생성
  const io = new IntersectionObserver(callback, option);

  // target 관찰
  io.observe(scrollObserver);
};

export default NewsList;
