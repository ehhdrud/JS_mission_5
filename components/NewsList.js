// do something!
const nav = () => {
  let ids = [
    "all",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ];

  let txts = [
    "전체보기",
    "비즈니스",
    "엔터테인먼트",
    "건강",
    "과학",
    "스포츠",
    "기술",
  ];

  let ul = document.createElement("ul");
  for (let i = 0; i < ids.length; i++) {
    let li = document.createElement("li");
    li.id = ids[i];
    li.classList.add("category-item");
    li.innerText = txt[i];
    ul.appendChild(li);
  }

  let nav = document.querySelector("nav");
  nav.classList.add = "catagory-list";
  nav.appendChild("ul");

  document.querySelector("#root").appendChild("nav");
};
