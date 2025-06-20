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

### 쇼츠(Shorts) 생성 스크립트

`generate_shorts.py` 스크립트는 `data/image` 폴더의 이미지를 이용해 9:16 세로 비디오를 생성합니다. 실행하면 `song` 폴더에 있는 음악 중 하나를 무작위로 배경음악으로 선택하고, 결과물은 `results` 폴더에 `YYYYMMDD_HHMMSS.mp4` 형식으로 저장됩니다.

필요한 파이썬 패키지(`moviepy`)와 외부 프로그램 `ffmpeg`가 설치되어 있어야 하며, 다음과 같이 실행할 수 있습니다:

```
python3 generate_shorts.py
```

생성되는 영상은 각 이미지가 5초씩 표시되며 페이드 인/아웃과 가벼운 줌인 효과가 적용됩니다. 음악은 `song` 폴더에서 무작위로 선택되며 음량은 낮춰서 사용됩니다.

### 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.
