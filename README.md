# Wedding Shoot Day Guide

2026년 6월 15일 웨딩 촬영 당일에 휴대폰으로 확인할 수 있는 React 체크리스트 앱입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

이 프로젝트는 `vite.config.js`에 `base: '/wedding-shoot/'`가 설정되어 있어 `https://uk960214.github.io/wedding-shoot/` 형태의 GitHub Pages 배포에 맞춰져 있습니다.

1. GitHub 저장소의 `Settings > Pages`로 이동합니다.
2. `Build and deployment` 소스를 `GitHub Actions`로 설정합니다.
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드 후 Pages에 배포합니다.

## 주요 기능

- 일정 카드별 체크리스트와 `localStorage` 저장
- 현재 시간 또는 직접 선택한 시간 기준의 현재/다음 일정 강조
- 중복 시간대에서는 더 구체적인 핵심 일정 우선 표시
- 전날 체크, 짐 체크, 주소·핵심 메모 탭
- 카카오맵 검색 링크
- 인쇄/PDF용 스타일
