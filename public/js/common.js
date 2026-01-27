document.addEventListener('DOMContentLoaded', function () {
    init();
});
window.addEventListener("load", function () {
    adjustPosition();
});
//非jQuery
function initFontSize() {
    var size = (sessionStorage.getItem('fontSize')) ? sessionStorage.getItem('fontSize') : 'm-size-font';
    changeFontSize(size);
}

//非jQuery
function changeFontSize(fontSizeClassName) {
    let html = document.querySelector('body');
    if (html.classList.length > 0) {
        html.classList.remove(html.classList);
    }
    html.classList.add(fontSizeClassName);

    let targetList = document.querySelectorAll('[data-font]');
    targetList.forEach(function (target) {
        target.classList.remove('active');
    });
    let target = document.querySelector('[data-font="' + fontSizeClassName + '"]');
    target.classList.add('active');
    sessionStorage.setItem('fontSize', fontSizeClassName);
}

//非jQuery
function addListeners() {
    let targetList = document.querySelectorAll('[data-font]');
    targetList.forEach(function (target) {
        target.addEventListener('click', function () { changeFontSize(target.dataset.font) });
    });
}

function init() {
    initFontSize();
    addListeners();
    fixedHeader();
}

//非jQuery
//画面上部にリンクメニュー表示
function fixedHeader() {
    const header = document.getElementById('top-head');
    const logo = header.querySelector('img');

    let r = header.getBoundingClientRect();
    let header_yPos = r.top + window.scrollY;
    // Nav Fixed
    window.addEventListener('scroll', function () {
        if (window.scrollY > header_yPos) {
            header.classList.add('fixed');
            logo.classList.add('smaller');
        } else {
            header.classList.remove('fixed');
            logo.classList.remove('smaller');
        }
    })

    // Nav Toggle Button
    document.getElementById('nav-toggle').addEventListener('click', () => {
        header.classList.toggle('open');
    });

}

//非jQuery
function adjustPosition() {
    //アンカー位置に合わせて調節
    const header = document.getElementsByTagName('header')[0];
    if (header === null) {
        return false;
    }

    const headerHeight = header.clientHeight;
    const anchors = document.querySelectorAll('[href^="#"]');

    //ページ内の遷移
    //固定ヘッダーのため、ページ内遷移をjavascriptで制御
    anchors.forEach((elm) => {
        elm.addEventListener('click', (e) => {
            //通常の遷移イベントをキャンセル
            e.preventDefault();
            //属性値としてhrefを取得
            //hrefプロパティだとURL全体の取得になってしまう
            let href = elm.getAttribute("href");
            let target;
            if (href == "#" || href == "") {
                target = document.getElementsByTagName('html')[0];
            } else {
                target = document.getElementById(href.slice(1));
            }
            if (target === null) {
                return false;
            }
            const rect = target.getBoundingClientRect();
            const offset = rect.top + window.pageYOffset - headerHeight;
            window.scrollTo(0, offset);
        });
        return false;
    });

    const urlHash = location.hash;
    if (urlHash) {
        if (urlHash.indexOf("#") != -1) {
            //ハッシュタグを除いた文字列でタグ取得
            const anchorElm = document.getElementById(urlHash.slice(1));
            if (anchorElm === null) {
                return false;
            }
            const rect = anchorElm.getBoundingClientRect();
            const offset = rect.top + window.pageYOffset - headerHeight;
            window.scrollTo(0, offset)
        }
    }
};

//非jQuery(jQueryのfadeInと似せた表現)
function fadeIn(elem, duration, display = 'block') {
    const delay = 40; // fps=25
    return new Promise(async (resolve, reject) => {
        if (arguments.length > 0) {
            const elem = arguments[0];
            if (elem.style.display === 'none' || elem.style.display === '') {
                const duration = arguments.length === 2 ? arguments[1] : 500;
                const display = arguments.length === 3 ? arguments[2] : 'block';
                elem.style.display = display;

                const coef = 1 / (duration / delay);
                elem.style.opacity = 0;
                var opacity = Number(elem.style.opacity);
                var animation = setInterval(() => {
                    opacity += coef;
                    elem.style.opacity = opacity;
                    if (opacity >= 1) {
                        clearInterval(animation);
                        resolve(true);
                    }
                }, delay);
            }
        }
    });
}

//非jQuery(jQueryのfadeOutと似せた表現)
function fadeOut(elem, duration, display = 'none') {
    const delay = 40; // fps=25
    return new Promise(async (resolve, reject) => {
        if (arguments.length > 0) {
            const elem = arguments[0];
            if (elem.style.display !== 'none') {
                const duration = arguments.length === 2 ? arguments[1] : 500;

                const coef = 1 / (duration / delay);
                elem.style.opacity = 1.0;
                var opacity = Number(elem.style.opacity);
                var animation = setInterval(() => {
                    opacity -= coef;
                    elem.style.opacity = opacity;
                    if (opacity <= 0) {
                        elem.style.display = 'none';
                        clearInterval(animation);
                        resolve(true);
                    }
                }, delay);
            }
        }
    });
}
