# News Viewer

무한 스크롤을 지원하는 News Viewer를 구현한다.

- News View는 Nav, NewList 컴포넌트로 구성
- Nav 컴포넌트가 카테고리를 선택하면 NewsList 컴포넌트는 News API를 통해 뉴스를 취득해 렌더링
- Axios와 async/await를 이용한 비동기 서버 통신 구현
- 사용자가 뉴스의 마지막까지 스크롤하면 다음 뉴스를 취득해 기존 뉴스 뒤에 추가
- 카테고리가 변경되면 NewsList 컴포넌트는 새롭게 뉴스를 취득해 리렌더링
- 카테고리는 Proxy와 옵저버 패턴을 통해 전역 상태로 관리
