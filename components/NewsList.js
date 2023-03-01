// 비동기적으로 동작하는 함수 NewList 정의 (App.js에 따라 data에는 proxyData가 할당)
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

// axios를 이용한 뉴스 정보 획득
const getNewsList = async (page, category) => {
  const newsListArr = [];
  const pageSize = 5;
  const apiKey = "30c0709466ed425a9882e34b927fe375";
  const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
    category === "all" ? "" : category
  }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

  // try-catch를 통한 예외처리
  try {
    const response = await axios.get(url);
    const articles = response.data.articles;

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
      newsListArr.push(newsItemSection);
    });
    return newsListArr;
  } catch (error) {
    console.log(error);
  }
};

//getScrollObserver() 함수는 <div class="scroll-observer">를 생성하고 속성값과 하위 요소들을 정의한다.
//해당 함수의 리턴값은 윗단에서 실행되어 scrollObserver 변수로 들어간다.
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

//intersectionObserverFunc 함수에서 콜백함수를 정의하고 scrollObserver을 관찰하여 관찰 대상의 상태에 따라 콜백함수를 실행한다.
const intersectionObserverFunc = (newsListArticle, scrollObserver) => {
  //IntersectionObserver의 콜백함수는 async를 통해 비동기적으로 동작한다.
  const callback = async (entries) => {
    for (const entry of entries) {
      //scrollObserver가 뷰포트와 교차된다면
      if (entry.isIntersecting) {
        //scrollObserver의 dataset.page를 nextPage 변수에 넣어주고
        //newsListArticle의 dataset.category를 category 변수에 넣어주고
        //getNewsList() 함수를 실행시켜서 불러온 뉴스 정보들을 newsList 변수에 넣어주고 forEach문을 통해 appendChild!
        //페이지를 로드했으니 scrollObserver의 dataset.page를 1 증가시킨다.
        const nextPage = parseInt(entry.target.dataset.page);
        const category = newsListArticle.dataset.category;
        const newsList = await getNewsList(nextPage, category);
        newsList.forEach((data) => {
          newsListArticle.appendChild(data);
        });
        entry.target.dataset.page = nextPage + 1;
      }
    }
  };
  //관찰!
  const observer = new IntersectionObserver(callback, { threshold: 1.0 });
  observer.observe(scrollObserver);
};

// 모듈 내보내기
export default NewsList;
