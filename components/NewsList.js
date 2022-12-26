// do something!

import { store } from "./store.js";
import { observe } from "./observer.js";

function NewsList() {
  //사용할 변수 선언부
  let page = 0;
  let category = "all";
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

  //article 하위 요소들을 생성하는 함수 'showPost' 정의
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

  //scrollOberserver 생성
  let scrollObserver = document.createElement("div");
  scrollObserver.classList.add("scroll-observer");
  newsListContainer.appendChild(scrollObserver);

  const spinner = function spinnerGenerator() {
    const img = document.createElement("img");
    img.src = "img/ball-triangle.svg";
    img.alt = "Loading...";
    return img;
  };

  //scrollOberver가 뷰포트와 교파되면 5개의 새로운 뉴스를 'showPost'하도록 구현
  //관찰자 객체 생성
  const io = new IntersectionObserver(callback, option);

  //callback 정의
  const callback = (entries, io) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        page++;
        url = `https://newsapi.org/v2/top-headlines?country=kr
        &category=${category === "all" ? "" : category}
        &page=${page}
        &pageSize=${pageSize}
        &apiKey=${apiKey}`;
        try {
          const response = await axios.get(url);
          await showPost(response.data.articles);
          scrollObserver.appendChild(spinner);
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  //option 정의
  const option = {
    tresshold: 0.5,
  };

  //관찰자 객체를 통해 scrollObserver를 감시
  io.observe(scrollObserver);

  //news-list를 리셋하는 함수를 정의하고, observe❓❓❓❓❓
  function reset() {
    const resetElement = document.querySelector(".news-list");
    resetElement.innerHTML = "";
  }

  observe(async () => {
    category = store.state.category;
    page = 0;
    reset();
  });
}
export default NewsList;
