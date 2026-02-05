function setMaxQuality() {

    let res, vol;
    chrome.storage.local.get(['res'], (result) => {
        if(!result.res) {
            res = '1080p';
        }
        else {
            res = result.res;
        }
        
        console.log(res + "로 화질 자동변경");
    })

    chrome.storage.local.get(['vol'], (result) => {
        if(!result.vol) {
            vol = 1;
        }
        else {
            vol = Number(result.vol)/100;
        }
        console.log("소리크기 : " + vol);
    })

    // 1. 설정(톱니바퀴) 버튼 클릭
    const settingBtn = document.querySelector('.pzp-pc-setting-button');
    if (!settingBtn) return;
    settingBtn.click();
    console.log("설정 버튼 클릭");

    // 2. 메뉴가 열리는 시간을 벌기 위해 0.1초 대기
    setTimeout(() => {
        // 3. '해상도' 메뉴 항목 찾아서 클릭 (올려주신 클래스명 기준)
        const qualityMenu = document.querySelector('.pzp-setting-intro-quality');
        if (qualityMenu) {
        qualityMenu.click();

        // 4. 다시 0.1초 뒤에 1080p 옵션 선택
        setTimeout(() => {
            const items = document.querySelectorAll('.pzp-ui-setting-quality-item');
            const target = Array.from(items).find(el => el.textContent.includes(res));
            
            if (target) {
            target.click();
            console.log(res + "로 변경 완료");
            }

        }, 100);
        }
        const video = document.querySelector('video');
        video.volume = vol;
    }, 100);
}

// 2. 재생 버튼을 감시하는 함수
function watchPlayButton() {
    
    const video = document.querySelector('video');

    if(video) {
        console.log("비디오 발견");
        video.addEventListener('play', () => {
            console.log("영상 재생 감지, 화질 설정 시작");
            let delay;

            chrome.storage.local.get(['savedDelay'], (result) => {
                delay = result.savedDelay || 1000;
                console.log(delay + "ms 후에 화질을 변경합니다.");
            })
            
            // 영상이 재생되자마자 메뉴를 누르면 에러가 날 수 있으니 delay만큼 대기
            setTimeout(setMaxQuality, delay);
        }, { once: true }); // 화질 설정은 처음에 한 번만 하면 되니까요!
    }
    
}

let vidFound = false;
const searchInterval = setInterval(()=> {
    const vid = document.querySelector('video');
    if(vid) {
        vidFound = true;
        watchPlayButton();
        clearInterval(searchInterval);
    }
}, 200);
//window.addEventListener('load', watchPlayButton);