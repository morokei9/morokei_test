// 페이지 초기화 및 설정
$(document).ready(function() {
    // CSS 파일 링크
    $('head').append('<link rel="stylesheet" href="styles.css">');
    
    // 커스텀 폰트 미리 로드
    preloadFont();
    
    // Matrix Rain 애니메이션 초기화 (바로 시작)
    setTimeout(function() {
        initMatrix();
        window.matrixInitialized = true;
    }, 200);
    
    // 비디오 및 오디오 자동 재생 설정
    initMediaPlayback();
    
    // 페이지 로드 완료 후 비디오 무한 재생 추가 보장 (강화된 버전)
    $(window).on('load', function() {
        // 비디오 요소들 선택
        const centerVideo = document.getElementById('center-video');
        const believeVideo = document.getElementById('believe-video'); // ID 변경
        
        // 비디오 요소 설정 및 재생 시도하는 함수
        function setupVideos() {
            if (centerVideo) {
                centerVideo.loop = true;
                centerVideo.autoplay = true;
                centerVideo.muted = true; // 브라우저 정책 때문에 처음엔 음소거 필요
                centerVideo.setAttribute('playsinline', '');
                
                // 재생 시도
                centerVideo.play().catch(e => console.log('중앙 비디오 재생 실패:', e));
            }
            
            if (believeVideo) {
                believeVideo.loop = true;
                believeVideo.autoplay = true;
                believeVideo.muted = true;
                believeVideo.setAttribute('playsinline', '');
                
                // 재생 시도
                believeVideo.play().catch(e => console.log('believe 비디오 재생 실패:', e));
            }
        }
        
        // 비디오 재생 상태 모니터링 및 재시작 함수
        function monitorVideoPlayback() {
            if (centerVideo && centerVideo.paused) {
                console.log('중앙 비디오 일시 정지 상태 감지 - 다시 재생');
                centerVideo.play().catch(e => {});
            }
            
            if (believeVideo && believeVideo.paused) {
                console.log('believe 비디오 일시 정지 상태 감지 - 다시 재생');
                believeVideo.play().catch(e => {});
            }
        }
        
        // 초기 설정
        setupVideos();
        
        // 1초, 2초, 5초 후에도 다시 시도 (브라우저 정책 우회)
        setTimeout(setupVideos, 1000);
        setTimeout(setupVideos, 2000);
        setTimeout(setupVideos, 5000);
        
        // 주기적으로 재생 상태 모니터링 (1초마다)
        setInterval(monitorVideoPlayback, 1000);
        
        // 사용자 클릭 감지하여 비디오 재생 시도
        $(document).on('click touchstart', function() {
            if (centerVideo) centerVideo.play().catch(e => {});
            if (believeVideo) believeVideo.play().catch(e => {});
        });
    });
    
    // ASCII Art 텍스트 설정 (letter1.txt와 letter2.txt 내용 사용)
    loadLetterContents();
    
    // 랜덤 알파벳은 글자 로드 후 생성
    // 음악 재생 버튼 제거하고 자동 재생 강화
    // 페이지 클릭 시 음악 자동 재생 시도
    $(document).on('click', function() {
        const audio = document.getElementById('background-music');
        if (audio) {
            audio.muted = false;
            audio.volume = 1.0;
            audio.play().then(() => {
                console.log('클릭으로 오디오 재생 시작');
            }).catch(error => {
                console.error('클릭 재생 실패:', error);
            });
        }
    });
    
    // 오디오 재생 상태를 주기적으로 저장하는 함수
    function saveAudioState() {
        const audio = document.getElementById('background-music');
        if (audio && !audio.paused) {
            localStorage.setItem('audioCurrentTime', audio.currentTime);
            localStorage.setItem('audioPlaying', 'true');
        }
    }
    
    // 1초마다 오디오 상태 저장
    setInterval(saveAudioState, 1000);
    
    // 비디오 및 오디오 자동 재생 설정 함수
    function initMediaPlayback() {
        // 비디오 요소 가져오기
        const centerVideo = document.getElementById('center-video');
        const believeVideo = document.getElementById('believe-video'); // ID 변경
        // 오디오 요소 가져오기
        const audio = document.getElementById('background-music');
        
        // 비디오 재생이 끝나면 다시 시작하는 이벤트 리스너 추가 및 반복 재생 모니터링
        if (centerVideo) {
            // 비디오가 종료되면 다시 재생하도록 이벤트 리스너 추가
            centerVideo.addEventListener('ended', function() {
                console.log('중앙 비디오 종료 감지 - 다시 재생 시작');
                this.currentTime = 0;
                this.play();
            }, false);
            
            // 비디오 재생 상태 주기적 확인
            setInterval(function() {
                if (centerVideo.paused) {
                    console.log('중앙 비디오 일시 정지 감지 - 재생 다시 시작');
                    centerVideo.play();
                }
            }, 2000);
        }
        
        if (believeVideo) {
            // 비디오가 종료되면 다시 재생하도록 이벤트 리스너 추가
            believeVideo.addEventListener('ended', function() {
                console.log('believe 비디오 종료 감지 - 다시 재생 시작');
                this.currentTime = 0;
                this.play();
            }, false);
            
            // 비디오 재생 상태 주기적 확인
            setInterval(function() {
                if (believeVideo.paused) {
                    console.log('believe 비디오 일시 정지 감지 - 재생 다시 시작');
                    believeVideo.play();
                }
            }, 2000);
        }
        
        // 페이지 로드 시 이전 오디오 상태 복원
        if (audio) {
            // localStorage에서 저장된 오디오 상태 가져오기
            const savedTime = parseFloat(localStorage.getItem('audioCurrentTime') || '0');
            const wasPlaying = localStorage.getItem('audioPlaying') === 'true';
            
            // 오디오 요소 초기 설정
            audio.loop = true;
            audio.autoplay = true;
            audio.volume = 1.0;
            
            // 저장된 위치가 있으면 설정
            if (savedTime > 0) {
                audio.currentTime = savedTime;
                console.log('저장된 오디오 위치 복원:', savedTime);
            }
            
            // 오디오 시간 업데이트 이벤트 리스너 추가
            audio.addEventListener('timeupdate', function() {
                if (!audio.paused) {
                    localStorage.setItem('audioCurrentTime', audio.currentTime);
                    localStorage.setItem('audioPlaying', 'true');
                }
            });
        }
        
        // 페이지 로드 후 자동 재생을 위한 사용자 상호작용 이벤트 핸들러
        const startMediaPlayback = function() {
            // 중앙 비디오 재생 설정
            if (centerVideo) {
                centerVideo.muted = false; // 음소거 해제 (크롬 정책을 위해)
                centerVideo.autoplay = true; // 자동 재생 활성화
                centerVideo.loop = true; // 반복 재생 활성화
                centerVideo.play().then(() => {
                    console.log('중앙 비디오 재생 시작');
                }).catch(error => {
                    console.error('중앙 비디오 재생 실패:', error);
                    // 실패 시 다시 시도 (음소거 상태로)
                    centerVideo.muted = true;
                    centerVideo.play().then(() => {
                        console.log('음소거 상태로 중앙 비디오 재생 시작');
                        // 5초 후 음소거 해제 시도
                        setTimeout(() => {
                            centerVideo.muted = false;
                        }, 5000);
                    });
                });
            }
            
            // 하단 비디오 재생 설정 (소리 없이)
            if (bottomVideo) {
                bottomVideo.muted = true; // 음소거 유지
                bottomVideo.autoplay = true; // 자동 재생 활성화
                bottomVideo.loop = true; // 반복 재생 활성화
                bottomVideo.play().then(() => {
                    console.log('하단 비디오 재생 시작');
                }).catch(error => {
                    console.error('하단 비디오 재생 실패:', error);
                    // 실패 시 다시 시도
                    setTimeout(() => {
                        bottomVideo.play().catch(e => console.error('하단 비디오 재생 재시도 실패:', e));
                    }, 2000);
                });
            }
            
            // 오디오 재생 설정
            if (audio) {
                audio.muted = false; // 음소거 해제
                audio.autoplay = true; // 자동 재생 활성화
                audio.loop = true; // 반복 재생 활성화
                audio.volume = 1.0; // 볼륨 최대로
                
                // 강제로 재생 시도
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('오디오 재생 시작');
                    }).catch(error => {
                        console.error('오디오 재생 실패:', error);
                        
                        // 음소거 상태에서 재시도
                        audio.muted = true;
                        audio.play().then(() => {
                            console.log('음소거 상태로 오디오 재생 시작');
                            
                            // 사용자 인터랙션을 감지한 후 음소거 해제
                            setTimeout(() => {
                                audio.muted = false;
                                console.log('음소거 해제 시도');
                            }, 3000);
                        }).catch(e => {
                            console.error('음소거 상태로도 오디오 재생 재시도 실패:', e);
                            
                            // 마지막 시도
                            setTimeout(() => {
                                audio.muted = false;
                                audio.play().catch(err => console.error('최종 오디오 재생 시도 실패:', err));
                            }, 5000);
                        });
                    });
                }
            }
            
            // 이벤트 리스너 제거 (한 번만 실행)
            document.removeEventListener('click', startMediaPlayback);
            document.removeEventListener('keydown', startMediaPlayback);
            document.removeEventListener('touchstart', startMediaPlayback);
        };
        
        // 사용자 상호작용 이벤트에 재생 함수 연결
        document.addEventListener('click', startMediaPlayback);
        document.addEventListener('keydown', startMediaPlayback);
        document.addEventListener('touchstart', startMediaPlayback);
        
        // 페이지 로드 직후 시도 (자동 재생 정책이 허용하는 경우)
        startMediaPlayback();
    }
    
    // letter1.txt와 letter2.txt 내용 가져와서 ASCII Art에 적용하는 함수
    function loadLetterContents() {
        Promise.all([
            fetch('letters/letter1.txt').then(res => res.text()),
            fetch('letters/letter2.txt').then(res => res.text())
        ]).then(([letter1Text, letter2Text]) => {
            $('.art-1').text(letter1Text);
            $('.art-2').text(letter2Text);
            generateRandomLetters();
        }).catch(error => {
            console.error('Error loading letters:', error);
            const warn = '파일을 로드할 수 없습니다. 로컬 웹 서버에서 실행해 보세요.';
            $('.art-1').text(warn);
            $('.art-2').text(warn);
        });
    }
    // 랜덤 알파벳 생성 함수 (art-3용)
    function generateRandomLetters() {
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let randomText = "";
        
        // 약 500,000자 정도의 랜덤 텍스트 생성 (대폭 증가)
        for (let i = 0; i < 500000; i++) {
            const randomChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            randomText += randomChar;
            
            // 띄어쓰기 간격 줄여서 더 많은 문자 표시
            if (i % 20 === 0) {
                randomText += " ";
            }
            if (i % 200 === 0) {
                randomText += "\n";
            }
        }
        
        // 기존 letter1.txt, letter2.txt 내용을 여러 번 반복 (이미지 완전히 표시되도록)
        const letter1Text = $('.art-1').text();
        const letter2Text = $('.art-2').text();
        
        // Image 1과 Image 2 모두 글자 수 늘림
        $('.art-1').text(letter1Text.repeat(100)); // Image 1의 글자 수 유지
        $('.art-2').text(letter2Text.repeat(15));  // Image 2 글자 수 3배 증가
        
        // 랜덤 알파벳 텍스트 적용 - 더 많은 텍스트 생성 (1,000,000자)
        for (let i = 500000; i < 1000000; i++) {
            const randomChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            randomText += randomChar;
            
            // 띄어쓰기 간격 줄여서 더 많은 문자 표시
            if (i % 20 === 0) {
                randomText += " ";
            }
            if (i % 200 === 0) {
                randomText += "\n";
            }
        }
        $('#random-letters').text(randomText);
    }
    
    // 커스텀 폰트 미리 로드 함수
    function preloadFont() {
        // 폰트 직접 로드를 위한 전역 변수 선언
        window.matrixFontLoaded = false;
        
        // CSS에서 폰트를 사용할 수 있도록 스타일 요소 추가
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'CustomMatrix';
                src: url('fonts/font.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
                font-display: block;
            }
            
            /* 화면에 보이지 않는 요소에 폰트를 미리 적용 */
            .font-preloader {
                position: absolute;
                top: -9999px;
                left: -9999px;
                font-family: 'CustomMatrix', monospace;
                opacity: 0;
                z-index: -1;
            }
        `;
        document.head.appendChild(style);
        
        // 이미지로 폰트 프리로드 (대체 방법)
        const img = new Image();
        img.src = 'fonts/font.ttf';
        
        // 화면에 보이지 않는 요소 추가
        const preloader = document.createElement('div');
        preloader.className = 'font-preloader';
        preloader.textContent = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        document.body.appendChild(preloader);
        
        // 폰트 로드 상태 확인 함수 
        function checkFontLoaded() {
            // 강제로 폰트 로드 처리 (3초 후)
            setTimeout(() => {
                if (!window.matrixFontLoaded) {
                    console.log('강제로 폰트 로드 상태를 true로 설정합니다');
                    window.matrixFontLoaded = true;
                    
                    // 매트릭스가 이미 초기화되었다면 폰트 업데이트
                    if (window.matrixInitialized && window.matrixContext) {
                        window.matrixContext.font = '24px CustomMatrix, monospace';
                    }
                    
                    // art-3에도 폰트 적용
                    $('.art-3').css('font-family', 'CustomMatrix, monospace');
                }
            }, 1000);
        }
        
        // FontFace API를 사용한 폰트 로드
        if ('FontFace' in window) {
            try {
                const fontFace = new FontFace('CustomMatrix', 'url(fonts/font.ttf)');
                fontFace.load().then(function(loadedFace) {
                    document.fonts.add(loadedFace);
                    console.log('FontFace API: 커스텀 폰트가 로드되었습니다!');
                    window.matrixFontLoaded = true;
                    
                    // 매트릭스가 이미 초기화되었다면 폰트 업데이트
                    if (window.matrixInitialized && window.matrixContext) {
                        window.matrixContext.font = '24px CustomMatrix, monospace';
                    }
                    
                    // art-3에도 폰트 적용
                    $('.art-3').css('font-family', 'CustomMatrix, monospace');
                }).catch(function(err) {
                    console.warn('FontFace API 로드 실패:', err);
                    checkFontLoaded();
                });
            } catch (e) {
                console.warn('FontFace API 사용 불가:', e);
                checkFontLoaded();
            }
        } else {
            checkFontLoaded();
        }
    }
    
    // Matrix Rain 애니메이션 설정
    function initMatrix() {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        
        // 전역 변수에 컨텍스트 저장 (폰트 업데이트용)
        window.matrixContext = ctx;
        
        // 캔버스 크기 설정
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // 알파벳 소문자와 대문자 (a-z, A-Z) 설정
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const characters = alphabet.split("");
        
        const fontSize = 28; // 폰트 크기 더 증가
        const columns = Math.floor(canvas.width / (fontSize * 0.8)); // 열 간격 조절
        
        // 각 열의 y 위치 추적
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        // 각 열의 색상 변화 추적 (더 다양한 색상 효과를 위해)
        const colors = [];
        for (let x = 0; x < columns; x++) {
            // 푸른색 계열 값
            colors[x] = Math.random() * 50 + 150; // 150-200 사이의 값
        }
        
        // 폰트 관련 변수
        let fontCheckAttempts = 0;
        const maxFontCheckAttempts = 50; // 최대 시도 횟수
        
        // 폰트 로드 상태 표시 함수
        function checkAndUpdateFont() {
            // 전역 변수로 관리되는 폰트 로드 상태 확인
            if (window.matrixFontLoaded) {
                return true;
            }
            
            // 직접 확인
            if (document.fonts && document.fonts.check('1em CustomMatrix')) {
                window.matrixFontLoaded = true;
                console.log('직접 확인: 폰트가 로드되었습니다!');
                return true;
            }
            
            // 시도 횟수 증가
            fontCheckAttempts++;
            
            // 최대 시도 횟수 도달 시 기본 폰트 사용
            if (fontCheckAttempts >= maxFontCheckAttempts) {
                console.warn('폰트 로드 시간 초과, 기본 폰트 사용');
                return true;
            }
            
            return false;
        }
        
        // 그리기 함수
        function draw() {
            // 약간 투명한 검은색 배경으로 잔상 효과 생성
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // 더 긴 잔상 효과를 위해 투명도 조정
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 글자 스타일 (커스텀 폰트 적용)
            let fontStatus = checkAndUpdateFont();
            if (window.matrixFontLoaded) {
                ctx.font = fontSize + 'px CustomMatrix, monospace';
            } else {
                // 폰트가 아직 로드되지 않았으면 monospace 사용
                ctx.font = fontSize + 'px monospace';
            }
            
            // 각 열에 대해
            for (let i = 0; i < drops.length; i++) {
                // 랜덤 문자 선택
                const text = characters[Math.floor(Math.random() * characters.length)];
                
                // 색상 설정 (첫 번째 문자는 밝은 파란색, 나머지는 어두운 파란색 계열로)
                const isFirstChar = (drops[i] <= 1);
                if (isFirstChar) {
                    ctx.fillStyle = "rgba(180, 180, 255, 0.9)"; // 밝은 파란색으로 변경
                } else {
                    // 파란색 계열로 설정
                    ctx.fillStyle = "rgba(" + Math.floor(colors[i]/8) + ", " + Math.floor(colors[i]/8) + ", " + Math.floor(colors[i]) + ", 0.9)";
                }
                
                // 텍스트 그리기
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                // 바닥에 도달하거나 무작위로 다시 시작
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                    // 새로운 색상 값 설정
                    colors[i] = Math.random() * 50 + 150;
                }
                
                // y 좌표 증가
                drops[i]++;
            }
        }
        
        // 애니메이션 속도 조절
        setInterval(draw, 80); // 더 빠른 속도로 변경
    }
    
    // 창 크기 변경 시 캔버스 크기 조정
    $(window).on('resize', function() {
        if (window.matrixInitialized) {
            const canvas = document.getElementById('matrix-canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});