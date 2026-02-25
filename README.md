# LifeLab Frontend
react + Vite  + TailwindCSS 기반 프로젝트

# 실행 방법
1. 레포 클론
   git clond <레포주소>
2. 폴더 이동
   cd lifelab-fe
3. 의존성 설치
   npm install
4. 개발 서버 실행
   npm run dev (표시되는 localhost 주소로 접속)

# 기술 스택
- react
- Vite
- TailwindCSS
- (후에) TypeScript

# 브랜치 전략
main → 배포 브랜치 (초기세팅 이후로 건들지 말것!!!)
develop → 통합 개발 브랜치 
feature/기능명 → 개인 작업 브랜치


### 협업 규칙
1. main 브랜치에 push 금지, develop에 직접 push 지양하기!
2. PR로만 병합하기

# 커밋 메세지 규칙
| 타입       | 의미                |
| -------- | ----------------- |
| feat     | 기능 추가             |
| fix      | 버그 수정             |
| style    | 스타일 변경 (기능 변화 없음) |
| refactor | 리팩토링              |
| docs     | 문서 수정             |

