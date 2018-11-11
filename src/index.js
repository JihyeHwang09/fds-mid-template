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
  detailImage: document.querySelector("#detail-image").content,
  cartItem: document.querySelector('#cart-item').content,
  cartRowItem: document.querySelector('#cart-row').content
};

const rootEl = document.querySelector('.root');

// fragment를 받아서 layout에 넣은 다음 rootEl에 그려주는 함수
function drawFragment(frag) {
  const layoutFrag = document.importNode(templates.layout, true);
  const mainEl = layoutFrag.querySelector(".main");
  const loginEl = layoutFrag.querySelector(".login");
  const bestEl = layoutFrag.querySelector(".best");
  const giftSetEl = layoutFrag.querySelector(".gift-set");

  // 로그인 버튼 클릭 -> 로그인 폼 화면으로 이동
  loginEl.addEventListener('click', e => {
    drawLoginForm();
  });
  // 베스트 버튼 클릭 -> 베스트 목록 화면으로 이동
  bestEl.addEventListener('click', e => {
    drawProductList('best');
  })
  // 선물 세트 버튼 클릭 -> 선물세트 목록 화면으로 이동
  giftSetEl.addEventListener('click', e => {
    drawProductList('gift-set');
  })



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






    // 왔던 곳으로 다시 돌아간다.
    // 멤버에 있는 로그인 버튼을 클릭했을 때 ->
    // 로그인 X상태 - 바로구매 버튼을 눌렀을 때 ->
    // 로그인 x 상태 -장바구니 페이지에서 구매 버튼을 눌렀을 때
    // if () {
    drawProductList();
    // } else {

    // }
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
  const { data } = await api.get('/options');
  let index = 0;
  // 4. 내용 채우기
  for (const product of productList) {

    // 1) 템플릿 복사
    const frag = document.importNode(templates.productItem, true);
    const totalEl = frag.querySelector('.list-total');
    // 2) 요소 선택
    const productItemEl = frag.querySelector('.product-item');
    const mainImageEl = frag.querySelector('.main-image');
    const titleEl = frag.querySelector('.list-title');
    const descriptionEl = frag.querySelector('.list-description');


    // 3) 필요한 데이터 불러오기 - X
    // 4) 내용 넣어주기
    mainImageEl.setAttribute("src", product.mainImgUrl);
    titleEl.textContent = product.title;
    descriptionEl.textContent = product.description;
    // console.log(totalEl);
    totalEl.textContent = data[index].price + "원";
    index += 2;
    //  5) 이벤트 리스너 등록하기
    productItemEl.addEventListener('click', e => {
      drawProductDetail(product.id);
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
  // 옵션 태그 선택하기
  const optionEl = frag.querySelector('.option');
  const quantityEl = frag.querySelector('.quantity')
  const cartFormEl = frag.querySelector(".cart-form");
  // 바로 구매하기 버튼 선택하기
  const buyNowEl = frag.querySelector('.buy-now');
  // 카트에 담기
  const addToCartEl = frag.querySelector('.add-to-cart');
  // 가격 요소 선택하기
  const totalEl = frag.querySelector('.total');

  // 3. 필요한 데이터 불러오기
  const {
    data: { title, description, mainImgUrl, detailImgUrls, options }
  } = await api.get(`/products/${productId}`, {
    params: {
      _embed: "options"
    }
  });


  // console.log("options",options);


  // 4. 내용 채우기
  mainImageEl.setAttribute("src", mainImgUrl);
  titleEl.textContent = title;
  descriptionEl.textContent = description;
  totalEl.textContent = options[0].price + "원";


  const frag2 = document.importNode(templates.detailImage, true);
  const detailImageEl = frag2.querySelector(".detail-image");
  detailImageEl.setAttribute("src", detailImgUrls[0]);
  detailImageListEl.appendChild(frag2);

  frag.querySelector('.option').addEventListener('change', e => {
    document.querySelector('.total').textContent = options[e.target.value - 1].price;
  })

  // 5. 이벤트 리스너 등록하기

  // 바로 구매하기 버튼을 클릭했을 때
  // 1) 로그인 여부 확인
  // 1-1) 로그인 o -> 주문/결제 페이지로 보내기
  // 1-2) 로그인 x -> 로그인 페이지로 보내기

  // buyNowEl.addEventListener('click', e => {
  //   e.preventDefault();
  //   // 로그인이 되어 있으면
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     // // 주문/결제 페이지로 보내는 코드
  //     drawCartList();

  //     //로그인이 되어있지 않으면
  //   } else {
  //     // 로그인 폼 페이지로 이동시키기
  //     drawLoginForm();
  //   }
  // });




  // 카트담기 버튼을 클릭했을 때
  // 이벤트가 일어나는 함수 안에서 서버와 통신하면 -> e앞에 async를 써줘야 함
  cartFormEl.addEventListener("submit", async e => {

    e.preventDefault();
    if (!document.querySelector('.option').value) {
      document.querySelector('.cart-form').checkValidity();
      return;
    }
    // 장바구니에 추가
    const token = localStorage.getItem('token');
    // 로그인이 되어 있으면
    if (token) {
      // // 사용자가 선택한 옵션 읽어오기
      // const optionId = e.target.elements.option.value;
      // // //   사용자가 입력한 구매 수량 읽어오기
      // const quantity = e.target.elements.quantity.value;

      // const
      // const res = await api.post(`/users/${userId}/cartItems`, {
      //   optionId
      //   quantity
      // });

      // post요청으로 cartItems 등록하기
      await api.post("/cartItems", {
        optionId: parseInt(document.querySelector('.option').value),
        quantity: parseInt(document.querySelector('.quantity').value),
        ordered: false
      });


      if (confirm('선택하신 상품이 카트에 추가되었습니다.\n 카트로 이동하시겠습니까?')) {
        // 확인 버튼 누르면 실행할 코드
        // 장바구니로 이동 시키는 코드
        drawCartList();
      }
      // 취소 버튼 누르면, 자동으로 그 상세 페이지에 머물러있는 상태이기 때문에
      // 따로 코드를 써줄 필요 X

      // 로그인을 하지 않았으면 -> 로그인 폼으로 이동시키기
    } else {
      confirm('카트에 담기는 로그인 후 사용가능한 서비스입니다. \n 로그인 화면으로 이동하시겠습니까?')
      drawLoginForm();
    }




  });
  // 6. 템플릿을 문서에 삽입
  drawFragment(frag);
}

async function drawCartList() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.cartItem, true);

  // 2. 요소 선택
  const cartTableEl = frag.querySelector('cart-table');
  const cartItemEl = frag.querySelector('.cart-item');
  const checkboxEl = frag.querySelector('.checkbox');
  const mainImageEl = frag.querySelector('main-image');
  const titleEl = frag.querySelector('.title');
  const optionEl = frag.querySelector('.option');
  const priceEl = frag.querySelector('.price');
  const quantityEl = frag.querySelector('.quantity');


  //  5) 이벤트 리스너 등록하기





  // 3. 필요한 데이터 불러오기
  // //get요청으로 해당 장바구니 가져오기
  // const { data: { cartItems } }
  // = await api.get('/cartItems', {
  //   params: {
  //       _expand: 'options',
  //       ordered: false
  //     }
  //   });

  // console.log(cartItems);
  // const params = new URLSearchParams();
  // cartItems.forEach(c => {
  //   params.append('id', c.optionId)
  // })
  // const { data: product } = await api.get('/products', {
  //   params
  // });
  // console.log(product);


  // const { data: cartItemList }
  // = await api.get("/cartItems", {
    //   params: {
      //     ordered: false,
      //     _expand: "product"
      //   }
  // });






  // 4. 내용 채우기
  // 장바구니에 추가된 내용 화면에 그리기
  // mainImageEl.setAttribute("src", product.mainImgUrl);
  // titleEl.textContent = product.title;
  // descriptionEl.textContent = product.description;
  // // console.log(totalEl);


  // totalEl.textContent = data[index].price + "원";
  // index += 2;


  // 5. 이벤트 리스너 등록하기



// 6. 템플릿을 문서에 삽입
// 장바구니 화면 그리기
drawFragment(frag);
}



// 페이지 로드 시 그릴 화면 설정
drawProductList();



