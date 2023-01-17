import { Nav, NewsList } from "./components/index.js";

//window.onload 함수를 이용해서 페이지가 로드되면 자동 실행되는 함수를 정의한다. 페이지의 모든 요소가 로드되어야만 호출된다.
//window.onload 함수는 <div id="root">의 요소를 가져와서
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
      //set메소드는 async를 통해 비동기로 동작하며 target 객체에 값을 할당할 때 (Nav에 클릭이벤트가 발생했을 때) 작동한다.
      set: async function (target, prop, value) {
        //Reflect.set을 통해 트랩할 할당작업을 그대로 진행시킨다. (Reflect가 없다면 category는 계속 all로 유지된다)
        //NewsList함수에 proxyData를 매개변수로 넣어 newsListElement에 할당한다.
        //.news-list-container인 요소를 가져와 newsListContainer 변수에 할당한다.
        Reflect.set(target, prop, value);
        const newsListElement = await NewsList(proxyData);

        const newsListContainer = rootElement.querySelector(
          ".news-list-container"
        );
        newsListContainer.replaceWith(newsListElement);
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
