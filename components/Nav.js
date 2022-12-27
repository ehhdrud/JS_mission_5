// do something!

/*
import { store } from "./store.js";
import { observe } from "./observer.js";
*/

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
    li.innerText = txts[i];
    ul.appendChild(li);
  }
  let categoryItem = document.querySelectorAll(".category-item");
  categoryItem[0].classList.add("active");

  let nav = document.querySelector("nav");
  nav.classList.add = "catagory-list";
  nav.appendChild("ul");

  for (let i = 0; i < categoryItem.length; i++) {
    categoryItem[i].addEventListener("click", (event) => {
      categoryItem[i].classList.add("active");
      for (let j = 0; j < categoryItem.length; j++) {
        if (categoryItem[j] != event.target)
          categoryItem[j].classList.remove("active");
      }
      /*
      const categoryId = event.target.id;
      store.setState({ category: categoryId });
      */
    });
  }

  document.querySelector("#root").appendChild("nav");
};
