// 모듈 가져오기
import { Nav, NewsList } from "./components/index.js";

// window.onload 함수를 이용해서 페이지의 모든 요소가 로드되면 자동 실행되는 함수를 정의
window.onload = async function () {
  //"root" 아이디를 가진 요소를 가져와서 rootElement 변수에 할당
  const rootElement = document.querySelector("#root");

  //프록시 객체를 생성하여 proxyData 변수에 할당
  const proxyData = new Proxy(
    // 첫번째 인자인 target에는 카테고리에 관한 정보가 들어있는 객체를 할당
    {
      category: "all",
    },
    // 두번째 인자인 handler에는 set메소드가 정의된 객채를 할당
    {
      // set메소드는 async를 이용해 비동기로 동작하며 target 객체에 값을 할당할 때, 즉 Nav에 클릭이벤트가 발생했을 때 작동
      set: async function (target, prop, value) {
        // Reflect.set을 통해 타겟 객체의 상태를 변경
        Reflect.set(target, prop, value);
        // NewsList함수에 proxyData를 매개변수로 넣어 실행하고, 완료 시 결과물을 newsListElement 변수에 할당
        // "news-list-container" 클래스를 가진 요소를 가져와 newsListContainer 변수에 할당하고 기존 요소는 제거
        const newsListElement = await NewsList(proxyData);
        const newsListContainer = rootElement.querySelector(
          ".news-list-container"
        );
        newsListContainer.replaceWith(newsListElement);
      },
    }
  );

  // proxyData를 매개변수 값으로 넣고 Nav함수를 실행한 결과물을 rootElement 변수의 자식요소로 할당
  const navElement = Nav(proxyData);
  rootElement.appendChild(navElement);

  // proxyData를 매개변수 값으로 넣은 NewsList함수를 실행하고, 완료 시 결과물을 rootElement 변수의 자식요소로 할당
  const newsListElement = await NewsList(proxyData);
  rootElement.appendChild(newsListElement);
};
