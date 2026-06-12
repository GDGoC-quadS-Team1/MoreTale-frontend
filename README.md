<br>

<div align="center">
    <div>
        <h2><b>MORETALE</b></h2>
        <p><i>More Language, More Tale!</i></p>
    </div>
</div>

<br>

<h1 align="center">MORETALE Frontend</h1>

우리 가족의 언어로 이야기가 시작되고 완성되는 공간.

**MORETALE Frontend**는 AI 동화 생성부터 도서관, 단어장, 퀴즈, 리워드 시스템까지 모든 기능을 직관적인 흐름과 즐거운 인터랙션으로 연결합니다.

다문화 가정 어린이들이 언어의 장벽을 넘어 가족과 함께 이야기를 읽고, 듣고, 배우며 성장할 수 있도록 이중언어 기반의 사용자 경험을 제공합니다.

<br>

<div align="center">

<a href="https://react.dev/">
<kbd>
<img src="https://github.com/user-attachments/assets/d756eaca-d3b3-4ca4-9957-8ce2627d0115" height="60"/>
</kbd>
</a>

<a href="https://www.typescriptlang.org/">
<kbd>
<img src="https://github.com/user-attachments/assets/4618ac2b-dfea-404d-9924-68e937385c7e" height="60"/>
</kbd>
</a>

<a href="https://styled-components.com/">
<kbd>
<img src="https://github.com/user-attachments/assets/e432c43c-d71a-4aae-8909-208c0d8ca20e" height="60"/>
</kbd>
</a>

<a href="https://vitejs.dev/">
<kbd>
<img src="https://github.com/user-attachments/assets/053493ca-6598-4dc6-a412-d81c6c9385db" height="60"/>
</kbd>
</a>

<a href="https://vercel.com/">
<kbd>
<img src="https://github.com/user-attachments/assets/37eb8365-0f73-499a-b297-b767fe4956d6" height="60"/>
</kbd>
</a>

</div>

<div align="center">

<h4>React | TypeScript | Styled Components | Vite | Vercel</h4>

</div>


---

## 👥 Developer

<div align="center">

| <img src="https://github.com/lyeonj.png" width="120"/><br><a href="https://github.com/lyeonj"><b>Yeonjae Lee</b></a> |
|:----------------------------------------------------------------------------------------------------------------------------:|
|                                             <i>Sookmyung Women's University</i>                                              |
|                                                        Member, Frontend                                                         |

</div>

---

## 📌 Overview

MORETALE Frontend는 사용자 인증, 프로필 관리, AI 동화 생성, 도서관, 퀴즈, 단어장, TTS 재생, 꿀단지 보상 시스템 등 사용자가 직접 경험하는 모든 기능을 제공하는 React 기반 웹 애플리케이션입니다.

Backend와 연동하여 사용자 요청을 처리하고, 생성된 동화, 퀴즈, 단어장, 음성 콘텐츠를 직관적인 UI와 인터랙션으로 제공합니다.
또한 이중언어 동화 읽기, 퀴즈 풀이, 단어 학습, 리워드 획득 과정을 하나의 사용자 경험으로 자연스럽게 연결합니다.

MORETALE은 다문화 가정 어린이와 부모가 함께 사용할 수 있는 이중언어 동화 생성 서비스를 목표로 합니다.

Frontend는 언어의 장벽 없이 이야기를 읽고, 듣고, 배우며 성장할 수 있는 사용자 경험을 제공하는 역할을 수행합니다.

---

## ⚒️ Detailed Tech Stack

| Role       | Type                                                                                                                                                                                                                                                                                                                                          |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Language     | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white) |
| Framework    | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black) |
| Build Tool   | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white) |
| Styling      | ![Styled Components](https://img.shields.io/badge/Styled--Components-DB7093?style=flat-square&logo=styled-components&logoColor=white) |
| Routing      | ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat-square&logo=ReactRouter&logoColor=white) |
| API Client   | ![Fetch API](https://img.shields.io/badge/Fetch%20API-000000?style=flat-square&logo=javascript&logoColor=white) |
| Authentication | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=JSONWebTokens&logoColor=white) ![Google OAuth](https://img.shields.io/badge/Google%20OAuth-4285F4?style=flat-square&logo=Google&logoColor=white) |
| Deployment   | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white) |

---

## ✨ Core Features

### 🔐 Authentication

> Google OAuth2 기반 로그인을 지원합니다.

- Google OAuth2 로그인 연동
- 로그인 상태 관리 및 JWT 저장
- Access Token 인증 처리
- 사용자 인증 상태 유지
- 로그인, 로그아웃 및 탈퇴 기능 제공

### 👤 User & Profile

> 사용자의 정보를 설정하고 관리할 수 있는 프로필 기능을 제공합니다.

- 사용자 프로필 생성 및 수정
- 주 언어 및 보조 언어 설정
- 사용자 맞춤 동화 생성을 위한 프로필 정보 입력

### 📖 Tale

> AI가 생성한 동화를 읽고 학습할 수 있는 동화 경험을 제공합니다.

- AI 동화 생성 요청
- 생성 진행 상태 확인
- 생성된 동화 조회
- 표지 및 일러스트 기반 동화 감상
- 언어별 문장 TTS 음성 듣기
- Web Speech API 기반 단어 음성 듣기
- 단어 저장 및 삭제

### 🔤 Vocabulary

> 동화 속 단어를 학습할 수 있도록 단어장 기능을 관리합니다.

- 동화별 단어 저장 및 조회
- 단어 의미 및 번역 정보 확인
- Web Speech API 기반 단어 음성 듣기

### 🧠 Quiz

> 생성된 동화를 기반으로 퀴즈 기능을 제공합니다.

- 동화 기반 퀴즈 풀이
- 퀴즈 문제 및 선택지 확인
- 사용자 정답 제출
- 정답 여부 및 채점 결과 확인

### 🍯 Honey Jar

> 사용자의 활동에 따른 보상을 확인할 수 있는 꿀단지 기능을 제공합니다.

- 꿀단지 보유량 확인
- 동화 읽기 및 퀴즈 풀이 결과와 연동
- 학습 동기 부여를 위한 리워드 경험 제공

---

## 🚀 Deployment

> MORETALE Frontend는 Vercel 기반으로 배포됩니다.

### Flow

```text
GitHub Repository
  ↓
Vercel
  ↓
Vite Build
  ↓
Production Deployment
```

### Pipeline
GitHub Repository와 Vercel을 연동하여 배포를 자동화했습니다.

`main` 브랜치에 변경 사항이 반영되면 Vercel에서 자동으로 프로젝트를 빌드하고 배포합니다.
배포된 애플리케이션은 최신 버전으로 즉시 반영되며, 사용자는 별도의 업데이트 없이 새로운 기능과 개선 사항을 이용할 수 있습니다.

### Environment Configuration
Vercel 환경 변수를 활용하여 API 서버 주소 및 서비스 설정을 관리합니다.

빌드 시 환경 변수(VITE_API_BASE_URL)를 주입하여 개발 환경과 운영 환경을 분리하고, Backend 서버와 안전하게 통신할 수 있도록 구성했습니다.

---

## 🛫 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/GDGoC-quadS-Team1/MoreTale-frontend.git
cd MoreTale-frontend
```

### 2. Install Dependencies

프로젝트 실행에 필요한 패키지를 설치합니다.

```bash
npm install
```

### 3. Create Environment File

루트 디렉터리에 `.env` 파일을 생성하고 필요한 값을 입력합니다.<br/>
주요 환경변수는 다음과 같습니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Run the Application

개발 서버를 실행합니다.

```bash
npm run dev
```

### 5. Build the Project

프로덕션 빌드를 생성합니다.<br/>
빌드 결과물은 dist 디렉터리에 생성됩니다.

```bash
npm run build
```

### 6. Preview Production Build

빌드 결과를 로컬에서 확인할 수 있습니다.

```bash
npm run preview
```

### 7. Check the Application

애플리케이션이 정상적으로 실행되면 아래 주소로 접근할 수 있습니다.

```text
http://localhost:5173
```

---

## 📂 Folder Structure

```text
MoreTale-frontend
├── public
│   └── favicon.svg
│
├── src
│   ├── apis
│   │   ├── user.ts
│   │   ├── tale.ts
│   │   ├── stories.ts
│   │   ├── library.ts
│   │   ├── vocabulary.ts
│   │   └── quiz.ts
│   │
│   ├── assets
│   │   ├── fonts
│   │   │   └── Pretendard-*.ttf
│   │   └── images
│   │
│   ├── components
│   │   ├── profile
│   │   │   ├── ProfileForm.tsx
│   │   │   └── ProfileEditModal.tsx
│   │   ├── BookCard.tsx
│   │   ├── Header.tsx
│   │   ├── InputField.tsx
│   │   ├── Slogan.tsx
│   │   └── YellowButton.tsx
│   │
│   ├── lib
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── speechSynthesis.ts
│   │   └── taleGenerationSession.ts
│   │
│   ├── pages
│   │   ├── tale
│   │   │   ├── IntroPage.tsx
│   │   │   ├── PromptPage.tsx
│   │   │   ├── LanguagePage.tsx
│   │   │   ├── LoadingPage.tsx
│   │   │   ├── CompletePage.tsx
│   │   │   └── ReadPage.tsx
│   │   │
│   │   ├── library
│   │   │   ├── LibraryPage.tsx
│   │   │   ├── VocaListPage.tsx
│   │   │   └── VocabularyPage.tsx
│   │   │
│   │   ├── quiz
│   │   │   ├── QuizListPage.tsx
│   │   │   └── QuizPlayPage.tsx
│   │   │
│   │   ├── LoginPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── ProfileComplete.tsx
│   │   ├── HomePage.tsx
│   │   └── MyPage.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   ├── index.css
│   └── vite-env.d.ts
│
├── .env (not included in github repo)
├── index.html
├── vite.config.ts
├── vercel.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── README.md
```

---

## ✅ Main Contributions
