import '@babel/polyfill' // 이 라인을 지우지 말아주세요!

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL
})

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
});

const templates = {
  layout: document.querySelector("#layout").content,
  loginForm: document.querySelector("#login-form").content,
  productList: document.querySelector("#product-list").content,
  productItem: document.querySelector("#product-item").content,
  productDetail: document.querySelector("#product-detail").content,
  detailImage: document.querySelector("#detail-image").content
};

const rootEl = document.querySelector('.root');

// fragment를 받아서 layout에 넣은 다음 rootEl에 그려주는 함수
function drawFragment(frag) {
  const layoutFrag = document.importNode(templates.layout, true);
  const mainEl = layoutFrag.querySelector(".main");
  mainEl.appendChild(frag);
  rootEl.textContent = "";
  rootEl.appendChild(layoutFrag);
}


// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입

async function drawLoginForm() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.loginForm, true);
  // 2. 요소 선택
  const formEl = frag.querySelector('.login-form');
  // 3. 필요한 데이터 불러오기 - 필요없음
  // 4. 내용 채우기 - 필요 없음
  // 5. 이벤트 리스너 등록하기
  formEl.addEventListener("submit", async e => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    const res = await api.post("/users/login", {
      username,
      password
    });
    localStorage.setItem('token', res.data.token);
    // drawPostList();
  });
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = '';
  rootEl.appendChild(frag);
}

async function drawProductList(category) {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productList, true);

  // 2. 요소 선택
  const productListEl = frag.querySelector('.product-list');

  // 3. 필요한 데이터 불러오기
  const params = {}
  if (category) {
    params.category = category
  }
  const { data: productList } = await api.get('/products', {
    params
  })
  // 4. 내용 채우기
  for (const {
    id: productId, title, description, mainImgUrl
  } of productList) {
    // 1) 템플릿 복사
    const frag = document.importNode(templates.productItem, true);
    // 2) 요소 선택
    const productItemEl = frag.querySelector('.product-item');
    const mainImageEl = frag.querySelector('.main-image');
    const titleEl = frag.querySelector('.title');
    const descriptionEl = frag.querySelector('.description');

    // 3) 필요한 데이터 불러오기 - X
    // 4) 내용 넣어주기
    mainImageEl.setAttribute('src', mainImgUrl)
    titleEl.textContent = title
    descriptionEl.textContent = description
    //  5) 이벤트 리스너 등록하기
    productItemEl.addEventListener('click', e => {
      drawProductDetail(productId);
    })
    // 6. 템플릿을 문서에 삽입
    productListEl.appendChild(frag);
  }
  // 5. 이벤트 리스너 등록하기
  // 6. 템플릿을 문서에 삽입
  drawFragment(frag);
}

async function drawProductDetail(productId) {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productDetail, true);

  // 2. 요소 선택
  const mainImageEl = frag.querySelector(".main-image");
  const titleEl = frag.querySelector(".title");
  const descriptionEl = frag.querySelector(".description");
  const detailImageListEl = frag.querySelector(".detail-image-list");
  const cartFormEl = frag.querySelector(".cart-form");

  // 3. 필요한 데이터 불러오기
  const {
    data: { title, description, mainImgUrl, detailImgUrls }
  } = await api.get(`/products/${productId}`);

  // 4. 내용 채우기
  mainImageEl.setAttribute("src", mainImgUrl);
  titleEl.textContent = title;
  descriptionEl.textContent = description;
  for (const url of detailImgUrls) {
    const frag = document.importNode(templates.detailImage, true);

    const detailImageEl = frag.querySelector(".detail-image");

    detailImageEl.setAttribute("src", url);

    detailImageListEl.appendChild(frag);
  }

  // 5. 이벤트 리스너 등록하기

  // 6. 템플릿을 문서에 삽입
  drawFragment(frag);
}


// 페이지 로드 시 그릴 화면 설정
drawProductList();



