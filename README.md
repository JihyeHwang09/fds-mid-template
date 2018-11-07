# 초기 기획
---
> 컨셉: 건강식품 쇼핑몰
> 목표: 최소 요구사항 구현하기
---
### 최소 요구사항 구현하기
  - 사용자는 **로그인**을 할 수 있습니다.
  - 사용자는 **카테고리**별 **상품 목록 페이지**를 이용할 수 있습니다.
  - 사용자는 **상품 페이지**를 통해 상품에 대한 자세한 정보를 확인할 수 있습니다.
  - 사용자는 **장바구니에 상품을 담거나 장바구니에서 상품을 제거**할 수 있습니다.
  - 사용자는 장바구니에 담긴 항목 **전체를 주문**할 수 있습니다.
  - 사용자는 **주문 내역을 확인**할 수 있습니다.

### 추가 요구사항
  - 사용자는 **회원 가입**을 할 수 있습니다.
  - 사용자는 장바구니 항목의 **구매 수량을 수정**할 수 있습니다.
  - 사용자는 장바구니에 담긴 항목 중 주문하고 싶은 것만 **선택해서 주문**할 수 있습니다.
  - 사용자는 상품 목록에서 **페이지**를 넘기며 상품을 탐색할 수 있습니다.
  - 관리자는 별도의 **관리자 페이지**에서 상품을 추가/수정/삭제할 수 있습니다. (id가 1번인 사용자를 관리자로 간주합시다.)
---
## 페이지 구분
- 홈 페이지
- 로그인 페이지
- 상품 목록 페이지
  - 베스트
  - 기능별
  - 원료별
  - 라인별
- 상품 상세 정보 페이지
- 장바구니 페이지
- 주문 내역 페이지

## 페이지 구조
![페이지 구조](C:\Users\raye0\Desktop\중간 프로젝트(쇼핑몰)\페이지구조.jpg)
---
## 일자별 작업 예상 일정
- 1일차[11/7(수)]
  - 0. 초기 기획 세우기 - 페이지 구조
  - 1. 홈 페이지
  - 2. 로그인 페이지
  - 3. 상품 목록 페이지

- 2일차[11/8(목)]
  - 1. 상품 상세 정보 페이지
  - 2. 장바구니 페이지
  - 3. 주문 내역 페이지

- 3일차[11/9(금)]
  - 추가 요구사항 구현, 디버깅


---
## npm 명령

- `npm install` - 프로젝트 실행에 필요한 파일을 설치하는 명령. 프로젝틑 최초 실행 시 반드시 실행해주어야 합니다.
- `npm start` - 개발용 서버를 실행시키는 명령
- `npm run build` - Netlify 등의 호스팅 서비스에서 사용할 수 있는 HTML, CSS, JS 파일을 생성해주는 명령. `dist` 폴더에 파일이 생성됩니다.

## 저장소 복사하기

**Github의 fork 기능으로는 계정 당 저장소 하나밖에 복사하지 못합니다.** Fork 기능을 사용하지 않고 프로젝트를 복사하려면, 아래의 절차대로 해 주세요.

1. 복사하고 싶은 저장소를 `git clone` 명령을 사용해 내려받는다.
1. 내려받은 폴더로 이동한 후, `rm -rf .git` 명령을 실행한다.
1. `git init`, `git add .`, `git commit -m "..."` 명령을 차례로 실행한다. (저장소 초기화)
1. Github에서 새 저장소를 만든 후, 위에서 초기화한 저장소를 푸시한다.
