/**
 * 페이지 간 지속적인 음악 재생을 관리하는 스크립트
 * localStorage를 사용하여 오디오 상태를 저장하고 복원
 */

// 싱글톤 오디오 관리자 객체 생성
const AudioManager = {
    // 전역 오디오 요소 (모든 페이지에서 공유)
    audioElement: null,
    
    // 오디오 상태
    isPlaying: false,
    currentTime: 0,
    
    // 초기화 함수
    init: function() {
        console.log("AudioManager 초기화 시작");
        
        // localStorage에서 상태 복원
        this.currentTime = parseFloat(localStorage.getItem('audioCurrentTime') || '0');
        this.isPlaying = localStorage.getItem('audioPlaying') === 'true' || true; // 기본값을 true로 설정
        
        // 오디오 요소 가져오기 또는 생성
        this.audioElement = document.getElementById('background-music');
        
        if (this.audioElement) {
            console.log("기존 오디오 요소 사용");
            this.setupAudioElement();
        } else {
            console.warn("DOM에 오디오 요소가 없음");
        }
        
        // 페이지 언로드 시 상태 저장
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
        
        // 페이지 가시성 변경 시 처리 (탭 전환 등)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                // 페이지가 숨겨질 때 상태 저장
                this.saveState();
            } else {
                // 페이지가 다시 보일 때 상태 복원 시도
                this.restoreState();
            }
        });
        
        // 주기적으로 상태 저장 (1초마다)
        setInterval(() => {
            this.saveState();
        }, 1000);
        
        console.log("AudioManager 초기화 완료");
    },
    
    // 오디오 요소 설정
    setupAudioElement: function() {
        if (!this.audioElement) return;
        
        // 오디오 기본 설정
        this.audioElement.loop = true;
        this.audioElement.volume = 1.0;
        
        // 저장된 위치 복원
        if (this.currentTime > 0) {
            this.audioElement.currentTime = this.currentTime;
            console.log(`오디오 위치 복원: ${this.currentTime}`);
        }
        
        // 이벤트 리스너 추가
        this.audioElement.addEventListener('timeupdate', () => {
            if (!this.audioElement.paused) {
                this.currentTime = this.audioElement.currentTime;
                this.isPlaying = true;
            }
        });
        
        // 자동 재생을 강제로 시도
        this.forcePlay();
        
        // 추가적인 자동 재생 시도 (브라우저 정책 우회)
        setTimeout(() => {
            this.forcePlay();
        }, 500);
        
        // 일정 시간 후 다시 시도 (브라우저 정책 우회)
        setTimeout(() => {
            this.forcePlay();
        }, 2000);
    },
    
    // 강제 재생 시도
    forcePlay: function() {
        if (!this.audioElement) return;
        
        // 이전 상태가 재생 중이었다면 재생 시도
        if (this.isPlaying || true) { // 항상 재생 시도
            this.play();
        }
        
        // 사용자 인터랙션을 가장한 이벤트 발생
        const event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        document.dispatchEvent(event);
    },
    
    // 재생 시작
    play: function() {
        if (!this.audioElement) return;
        
        const playPromise = this.audioElement.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('오디오 재생 성공');
                    this.isPlaying = true;
                    this.audioElement.muted = false; // 음소거 해제 확인
                })
                .catch(error => {
                    console.error('오디오 재생 실패:', error);
                    
                    // 브라우저 정책 우회를 위한 음소거 상태로 재시도
                    this.audioElement.muted = true;
                    this.audioElement.play()
                        .then(() => {
                            console.log('음소거 상태로 오디오 재생 성공');
                            // 3초 후 소리 활성화 시도
                            setTimeout(() => {
                                this.audioElement.muted = false;
                            }, 3000);
                        })
                        .catch(e => {
                            console.error('음소거 상태로도 오디오 재생 실패:', e);
                            
                            // 추가 우회 시도: 오디오 속성 변경 후 재시도
                            this.audioElement.preload = 'auto';
                            this.audioElement.currentTime = this.currentTime;
                            this.audioElement.play().catch(err => {
                                console.error('모든 재생 시도 실패:', err);
                            });
                        });
                });
        }
    },
    
    // 현재 상태 저장
    saveState: function() {
        if (!this.audioElement) return;
        
        if (!this.audioElement.paused) {
            this.currentTime = this.audioElement.currentTime;
            this.isPlaying = true;
            
            localStorage.setItem('audioCurrentTime', this.currentTime);
            localStorage.setItem('audioPlaying', 'true');
            
            console.log(`오디오 상태 저장: 재생 중, 시간 = ${this.currentTime}`);
        } else {
            // 일시 정지 상태라도 재생 중으로 저장
            localStorage.setItem('audioPlaying', 'true');
        }
    },
    
    // 저장된 상태 복원
    restoreState: function() {
        if (!this.audioElement) return;
        
        const savedTime = parseFloat(localStorage.getItem('audioCurrentTime') || '0');
        const wasPlaying = localStorage.getItem('audioPlaying') === 'true' || true; // 기본값 true
        
        if (savedTime > 0) {
            this.currentTime = savedTime;
            this.audioElement.currentTime = savedTime;
        }
        
        if (wasPlaying || this.audioElement.paused) {
            this.play();
        }
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    AudioManager.init();
    
    // 사용자 인터랙션 이벤트 리스너 추가 (오디오 재생 정책 우회)
    const triggerAudio = function() {
        AudioManager.play();
    };
    
    // 모든 사용자 상호작용에서 오디오 재생 시도
    document.addEventListener('click', triggerAudio);
    document.addEventListener('keydown', triggerAudio);
    document.addEventListener('touchstart', triggerAudio);
    document.addEventListener('mousemove', triggerAudio);
    
    // 추가 자동 재생 시도
    setTimeout(() => {
        AudioManager.play();
    }, 1000);
});