import { Nav, NewsList } from "./components/index.js";

//window.onload 함수를 이용해서 페이지가 로드되면 자동 실행되는 함수를 정의한다. 페이지의 모든 요소가 로드되어야만 호출된다.
window.onload = async function () {
  const rootElement = document.getElementById("root");

  const proxyData = new Proxy(
    {
      category: "all",
    },
    {
      set: async function (target, prop, value) {
        Reflect.set(target, prop, value);
        const newsListElement = await NewsList(proxyData);
        const container = rootElement.querySelector(".news-list-container");

        if (container === null) {
          rootElement.appendChild(newsListElement);
        } else {
          container.replaceWith(newsListElement);
          return;
        }
      },
    }
  );

  const navElement = Nav(proxyData);
  rootElement.appendChild(navElement);

  const newsListElement = await NewsList(proxyData);
  rootElement.appendChild(newsListElement);
};
