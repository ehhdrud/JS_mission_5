import { Nav, NewsList } from "./components/index.js";

//window.onload 함수를 이용해서 페이지가 로드되면 자동 실행되는 함수를 정의한다. 페이지의 모든 요소가 로드되어야만 호출된다.
window.onload = async function () {
  //id=root인 요소를 가져와서 rootElement 변수에 할당한다.
  const rootElement = document.querySelector("#root");

  //프록시 객체를 생성하여 proxyData변수에 할당한다.
  //프록시 객체의 target에는 카테고리에 관한 정보가 들어있는 객체가, handler에는 set메소드가 정의된 객채가 들어있다.
  const proxyData = new Proxy(
    {
      category: "all",
    },
    {
      //set메소드는 async를 통해 비동기로 동작하며 target 객체에 값을 할당할 때 작동한다. ❓❓❓❓❓이게 언제지?
      set: async function (target, prop, value) {
        //Reflect.set을 통해 객체(target)의 프로퍼티(prop)에 값(value)을 할당한다. 성공 시 true, 실패 시 false를 반환한다.
        //NewsList함수에 proxyData를 매개변수로 넣어 newsListElement에 할당한다. ❓❓❓❓❓await는 어떻게 작동?
        //윗 문장으로부터 생성된 NewsList HTML 요소들 중 class = "news-list-container" 인 요소를 가져와 container 변수에 할당한다.
        Reflect.set(target, prop, value);
        const newsListElement = await NewsList(proxyData);
        const container = rootElement.querySelector(".news-list-container");

        //(카테고리가 할당되는 상태일때)
        //.news-list-container가 없는 상태(첫번째 로딩)라면 생성된 뉴스리스트인 newsListElement 변수를 #root에 이어 붙여주고
        //.news-list-container가 있는 상태(첫번째 이후의 로딩)라면 .news-list-container를 생성된 뉴스리스트인 newsListElement 변수로 바꾼다.
        if (container === null) {
          rootElement.appendChild(newsListElement);
        } else {
          container.replaceWith(newsListElement);
          //❓❓❓❓❓
          return;
        }
      },
    }
  );

  // proxyData를 파라미터로 하여 Nav함수를 실행하여 반환값을 navElement 변수에 할당하고 rootElement에 붙인다.
  const navElement = Nav(proxyData);
  rootElement.appendChild(navElement);

  // proxyData를 파라미터로 하여 NewsList함수를 실행하여 반환값을 newsListElement 변수에 할당하고 rootElement에 붙인다.
  const newsListElement = await NewsList(proxyData);
  rootElement.appendChild(newsListElement);
};
