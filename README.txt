## ASCII Art 및 Matrix Rain 테스트 웹사이트 사용 설명서

안녕하세요! 이 웹사이트는 ASCII Art와 Matrix Rain 애니메이션을 보여주는 테스트 사이트입니다.

### 이미지 설정 방법

이미지 파일들이 다음 경로와 이름으로 이미 설정되어 있습니다:
   
   ```
   C:\Users\user\Desktop\인공지능 노트북용\Claude\3) test\data\image\
   ```

현재 사용 중인 이미지 파일:
   - image1.png
   - image2.png
   - image3.png

웹사이트는 data/image 폴더에 있는 이미지 파일들을 자동으로 인식하고 ASCII Art 배경으로 사용합니다.

### 웹사이트 실행 방법

1. 터미널에서 프로젝트 폴더로 이동한 뒤 간단한 웹 서버를 실행합니다.
   예) Python이 설치되어 있다면 `python3 -m http.server` 명령을 사용합니다.
2. 이렇게 실행한 서버 주소(`http://localhost:8000` 등)에서 `index.html`을 열어주세요.
   파일을 직접 더블 클릭해 여는 경우 일부 브라우저에서 보안 정책 때문에
   ASCII Art 텍스트가 로드되지 않을 수 있습니다.
3. 웹사이트가 열리면 ASCII Art 탭이 먼저 표시됩니다.
4. "Matrix Rain 애니메이션" 탭을 클릭하여 푸른색 Matrix Rain 애니메이션을 볼 수 있습니다.

### 참고사항

- ASCII Art 애니메이션은 WebKit 기반 브라우저(Chrome, Safari, Edge)에서 가장 잘 작동합니다.
- Matrix Rain 애니메이션은 모든 최신 브라우저에서 정상적으로 작동합니다.
- 폰트가 제대로 로드되지 않으면 기본 폰트로 대체됩니다.

즐거운 시간 되세요!

### 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.
