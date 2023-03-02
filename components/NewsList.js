// 비동기적으로 뉴스리스트를 생성하는 함수 NewList 정의 (App.js에 따라 data에는 proxyData가 할당)
const NewsList = async (data) => {
  // <div class="news-list-container"> 생성
  const newsListContainerDiv = document.createElement("div");
  newsListContainerDiv.className = "news-list-container";

  // <article class="news-list"> 생성
  const newsListArticle = document.createElement("article");
  newsListArticle.className = "news-list";
  // 전역으로 관리되는 data.category를 data-category라는 사용자 정의 속성에 할당하고 <article class="news-list">의 자식 요소로 할당
  newsListArticle.dataset.category = data.category;
  newsListContainerDiv.appendChild(newsListArticle);

  // getScrollObserver() 함수의 결과물인 <div class="scroll-Observer">8를 <div class="news-list-container">의 자식 요소로 할당
  const scrollObserver = getScrollObserver();
  newsListContainerDiv.appendChild(scrollObserver);

  // intersection Observer API를 이용해 관찰 대상의 변화를 관찰 후 그에 따르는 작업을 처리
  intersectionObserverFunc(newsListArticle, scrollObserver);

  // 완성된 <div class="news-list-container"> 반환
  return newsListContainerDiv;
};

// 비동기적으로 뉴스 정보를 획득하는 함수 getNewsList 정의
const getNewsList = async (page, category) => {
  const newsListArr = [];
  const pageSize = 5;
  const apiKey = "30c0709466ed425a9882e34b927fe375";
  const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
    category === "all" ? "" : category
  }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

  // try-catch를 통한 예외처리
  try {
    // axios.get을 통해 데이터를 요청, 데이터를 response 변수에 할당
    const response = await axios.get(url);
    // 데이터의 data.articles 프로퍼티를 articles 변수에 할당
    const articles = response.data.articles;

    // articles 변수의 요소들을 순회하며 <section class = "news-item"> 생성
    articles.forEach((data) => {
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
      // 완성된 <section class = "news-item">를 newsListArr 배열에 할당
      newsListArr.push(newsItemSection);
    });
    // 완성된 newsListArr 배열을 반환
    return newsListArr;
  } catch (error) {
    console.log(error);
  }
};

// getScrollObserver() 함수 정의
const getScrollObserver = () => {
  // <div class="scroll-observer"> 생성
  const scrollObserverDiv = document.createElement("div");
  scrollObserverDiv.className = "scroll-observer";
  // data-page라는 속성을 추가하여 "1" 할당
  scrollObserverDiv.dataset.page = "1";
  // <img src = "~" alt = "~"> 생성
  const img = document.createElement("img");
  img.src = "./img/ball-triangle.svg";
  img.alt = "Loading...";
  // <img src = "~" alt = "~">를 <div class="scroll-observer">의 자식 요소로 할당
  scrollObserverDiv.appendChild(img);
  // 완성된 <div class="scroll-observer"> 반환
  return scrollObserverDiv;
};

// intersectionObserverFunc() 함수 정의

const intersectionObserverFunc = (newsListArticle, scrollObserver) => {
  // 비동기로 동작하는 callback 정의
  const callback = async (entries) => {
    for (const entry of entries) {
      // scrollObserver가 뷰포트와 교차된다면
      if (entry.isIntersecting) {
        // scrollObserverDiv.dataset.page를 nextPage 변수에 할당
        const nextPage = parseInt(entry.target.dataset.page);
        // newsListArticle.dataset.category를 category 변수에 할당
        const category = newsListArticle.dataset.category;
        // getNewsList() 함수를 통해 완성된 newsListArr 배열을 newsList 변수에 할당
        const newsList = await getNewsList(nextPage, category);
        // forEach문을 통해 배열의 각 요소를 newsListArticle의 자식 요소로 할당
        newsList.forEach((data) => {
          newsListArticle.appendChild(data);
        });
        // 페이지를 로드했으니 scrollObserverDiv.dataset.page를 1 증가
        entry.target.dataset.page = nextPage + 1;
      }
    }
  };

  // 관찰 대상이 100% 보여야 callback 함수가 실행되는 관찰자 객체를 생성해 observer 변수에 할당
  const observer = new IntersectionObserver(callback, { threshold: 1.0 });
  // scrollObserver 변수를 관찰
  observer.observe(scrollObserver);
};

// 모듈 내보내기
export default NewsList;
