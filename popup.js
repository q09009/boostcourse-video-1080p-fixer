const slider = document.querySelector('#delay-range');
const display = document.querySelector('#delay-value');
const resolution = document.querySelector('#res');

//팝업이 열릴때 저장된 값 세팅
chrome.storage.local.get(['savedDelay'], (result) => {
    if(result.savedDelay) {
        slider.value = result.savedDelay;
        display.innerText = result.savedDelay;
    }
});

chrome.storage.local.get(['res'], (result) => {
    if(result.res) {
        resolution.value = result.res;
    }
});

slider.addEventListener('input', () => {
    const val = slider.value;
    display.innerText = val/1000 + "초";

    chrome.storage.local.set({ savedDelay: val }, () => {
        console.log("딜레이 저장 완료: " + val);
    });
})

resolution.addEventListener('input', () => {
    const val = resolution.value;

    chrome.storage.local.set({ res: val }, () => {
        console.log("화질 저장 완료: " + val);
    })
});