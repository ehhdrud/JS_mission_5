// do something!

import { store } from "./store.js";
import { observe } from "./observer.js";

function NewsList() {
  let container = document.createElement("div");
  container.classList.add("news-list-container");
  document.querySelector("#root").appendChild(container);

  let article = document.createElement("article");
  article.classList.add("news-list");
  container.appendChild(article);

  let scrollObserver = document.createElement("div");
  scrollObserver.classList.add("scroll-observer");
  container.appendChild(scrollObserver);

  const spinner = function spinnerGenerator() {
    const img = document.createElement("img");
    img.src = "img/ball-triangle.svg";
    img.alt = "Loading...";
    return img;
  };

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

  let page = 0;
  let category = "all";
  const pageSize = 5;
  const apiKey = "30c0709466ed425a9882e34b927fe375";
  let url;

  function reset() {
    const resetElement = document.querySelector(".news-list");
    resetElement.innerHTML = "";
  }

  observe(async () => {
    category = store.state.category;
    page = 0;
    reset();
  });

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

  const option = {
    root: null,
    rootMargin: "0px",
    tresshold: 0.5,
  };

  const io = new IntersectionObserver(callback, option);

  io.observe(scrollObserver);
}
export default NewsList;
