//NewList함수를 async를 걸어 비동기적으로 실행한다.
const NewsList = async (data) => {
  //<div class="news-list-container">를 생성하고 newsListContainerDiv 변수에 넣어준다.
  const newsListContainerDiv = document.createElement("div");
  newsListContainerDiv.className = "news-list-container";

  //<article class="news-list">를 생성하여 newsListArticle 변수에 넣어주고, Nav.js에서 정의한 'data.category'를 data-category라는 속성을 만들어 넣어주고, 위 문단에서 정의한 newsListContainerDiv에 붙여준다.
  const newsListArticle = document.createElement("article");
  newsListArticle.className = "news-list";
  newsListArticle.dataset.category = data.category;
  newsListContainerDiv.appendChild(newsListArticle);

  //getScrollObserver 함수를 실행하여 반환값을 scrollObserver 변수에 넣어주고, 맨 위에서 정의한 newsListContainerDiv에 넣어준다.
  //(getScrollObserver 함수: <div class="scroll-Observer">를 가져오는 함수)
  const scrollObserver = getScrollObserver();
  newsListContainerDiv.appendChild(scrollObserver);

  //intersectionObserverFunc 함수를 실행하여 intersection Observer API를 사용하여 관찰 대상의 변화를 관찰하고 그에 따른 작업을 진행시킨다.
  intersectionObserverFunc(newsListArticle, scrollObserver);

  //newsListContainerDiv 변수 반환!
  return newsListContainerDiv;
};

//getNewsList 함수는 axios로 데이터 정보를 가져와 뉴스 정보를 (section 태그 및 그 아래 요소)들을 불러온다.
const getNewsList = async (page, category) => {
  //생성한 5개의 새로운 뉴스들을 담을 객체와 pageSize, apiKey, url을 초기화
  const newsListArr = [];
  const pageSize = 5;
  // const apiKey = "d07c46a4af5548649977196532728ed8";
  const apiKey = "30c0709466ed425a9882e34b927fe375";
  const url = `https://newsapi.org/v2/top-headlines?country=kr&category=${
    category === "all" ? "" : category
  }&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

  //에러 발생을 방지하기 위한 예외처리 구문
  //try: 실행할 구문
  //catch: 에러 발생 시 실행할 구문
  try {
    //axios.get(url)를 통해 newsAPI로부터 기사 정보를 가져와 response 변수에 넣어주고, 해당 데이터의 data.articles이라는 정보를 article 변수에 할당한다.
    const response = await axios.get(url);
    const articles = response.data.articles;

    //article 변수의 요소들를 순회하며 newsItemSection 변수에 <section class="news-item"> 태그와 그 하위요소를 만들고 기사 정보를 담고 있는 article 변수의 데이터들을 넣어준다.
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
      //5개의 뉴스 기사를 담고있는 newsItemSection 변수를 newsListArr 객체에 넣어준다.
      newsListArr.push(newsItemSection);
    });
    //newsListArr를 리턴!
    return newsListArr;
  } catch (error) {
    console.log(error);
  }
};

//getScrollObserver 함수는 <div class="scroll-observer">을 생성하고 속성값과 하위 요소들을 정의하여 해당 div를 리턴!
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
//파라미터는 newsListArticle, scrollObserver를 사용한다.
const intersectionObserverFunc = (newsListArticle, scrollObserver) => {
  //IntersectionObserver의 콜백함수는 async를 통해 비동기로 동작한다.
  const callback = async (entries) => {
    //for of문을 통해 관찰중인 대상 모두를 순회한다.
    for (const entry of entries) {
      //scrollObserver가 뷰포트와 교차된다면
      if (entry.isIntersecting) {
        //scrollObserver의 dataset.page를 nextPage 변수에 넣어주고
        //newsListArticle의 dataset.category를 category 변수에 넣어준다. 그리고
        const nextPage = parseInt(entry.target.dataset.page);
        const category = newsListArticle.dataset.category;

        //getNewsList함수를 실행시켜서 newsList 변수에 넣어주고
        //페이지를 로드했으니 scrollObserver의 dataset.page를 1 증가시킨다.
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

export default NewsList;
