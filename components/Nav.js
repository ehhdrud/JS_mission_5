// Nav 함수 정의 (App.js에 따라 data에는 proxyData가 할당)
const Nav = (data) => {
  // <nav class="category-list"> 생성
  const categoryListNav = document.createElement("nav");
  categoryListNav.className = "category-list";

  // <nav class="category-list">의 하위 태그 생성
  categoryListNav.innerHTML = `
      <ul>
         <li id="all" class="category-item active">전체보기</li>
         <li id="business" class="category-item">비즈니스</li>
         <li id="entertainment" class="category-item">엔터테인먼트</li>
         <li id="health" class="category-item">건강</li>
         <li id="science" class="category-item">과학</li>
         <li id="sports" class="category-item">스포츠</li>
         <li id="technology" class="category-item">기술</li>
      </ul>  
   `;

  // 특정 <li> 요소에 click 이벤트가 발생하면 active라는 클래스를 추가해주고 id값을 data.category에 할당
  const categoryItemLi = categoryListNav.querySelectorAll(".category-item");
  categoryItemLi.forEach((element) => {
    element.addEventListener("click", (event) => {
      categoryItemLi.forEach((element) => {
        element.classList.remove("active");
      });
      event.target.classList.add("active");
      //App.js -> 프록시 -> handler 객체 -> set 메서드 👉 해당 할당 동작 시 trap.
      data.category = event.target.id;
    });
  });

  // 완성된 <nav class="category-list"> 반환
  return categoryListNav;
};

// 모듈 내보내기
export default Nav;
