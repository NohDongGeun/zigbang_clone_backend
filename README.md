# 부동산 서비스 EROOM

![eroom사진](https://user-images.githubusercontent.com/62538580/118592040-439f4200-b7e0-11eb-80db-c635a9f856c8.png)

Url : https://master--dreamy-goodall-8f6677.netlify.app

## 사용 기술

### FRONTEND

- React
- Typescript
- Tailwind CSS
- Apollo
- Storybook

### BACKEND

- Nest.js
- TypeORM
- GraphQL
- PostgreSQL
- AWS S3

### API

- Kakao Map
- Daum Postcode
- Naver SENS
- Mailgun

## 기능

- 로그인 / 회원가입 (JWT)
- User 정보
- User 찜한목록
- 부동산 가입
- 방 CRUD
- Kakao Map 마커 클러스터링
- Kakao Roadview
- AWS S3 이미지 저장
- SMS 서비스
- 위치 검색
- 방 필터링

## 느낀점

### 설계의 중요성

프로젝트를 시작 할 때 일단 해보자라는 안일한 생각으로 시작했습니다.그러다 보니 컴포넌트를 관리하기 힘들어졌고 결국 프론트쪽을 새로 만들어야 했습니다.
문제점을 보안하기 위해 Atomic 디자인패턴의 구조와 Storybook을 추가했습니다.

### API 활용

EROOM 프로젝트에서 Kakao Map, Naver SENS, Daum Postcode, Mailgun 을 사용햇습니다.
API를 사용하면서 문서를 읽고 코드를 작성하는 습관을 들였습니다.

### 모바일 화면

처음 프로젝트 시작 시 모바일을 신경 쓰지 않아 자연스럽게 PC화면에 중심이 되었습니다.
뒤늦게 모바일을 적용하려고 하니 왜 개발자분들이 모바일 First로 개발을 하시는지 깨달았습니다.
다행히 Tailwind CSS 덕분에 모바일 화면을 만들 수 있었던 것 같습니다.

### 혼자 힘으로 개발하기

혼자 프로젝트를 진행하는게 얼마나 많은 경험치를 얻는지 깨달았습니다.
또한, '왜' 라는 생각을 가지면서 개발을 하게 되는 습관을 가진 계기가 된 거 같습니다.
