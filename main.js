class MainSlider {
    constructor(slider, paginationButtons1, paginationButtons2, wrappers, pageNow, pauseButton, playButton) {
        this.slider = slider;
        this.paginationButtons1 = paginationButtons1;
        this.paginationButtons2 = paginationButtons2;
        this.wrappers = wrappers;
        this.pageNow = pageNow;
        this.pauseButton = pauseButton;
        this.playButton = playButton;

        [this.gradientLeft, this.gradientRight] = document.getElementsByClassName('pagination-gradient');

        this.length = this.wrappers.length - 2;
        this.frontPadIndex = 0;
        this.backPadIndex = this.wrappers.length - 1;

        this.slideInterval = 2000;
        
        this.currentIndex = 1;

        this.playing = true;
        this.timer = setInterval(() => this.slideNext(), this.slideInterval);
    }

    resetTimer() {
        if (this.playing) {
            clearInterval(this.timer);
            this.timer = setInterval(() => this.slideNext(), this.slideInterval);
        }
    }

    pauseToggle() {
        if (this.playing) {
            clearInterval(this.timer);
            this.playing = false;
            this.pauseButton.style.display = 'none';
            this.playButton.style.display = 'block';
        } else {
            this.timer = setInterval(() => this.slideNext(), this.slideInterval);
            this.playing = true;
            this.pauseButton.style.display = 'block';
            this.playButton.style.display = 'none';
        }
    }

    slideContentBox(index) {
        const paginationButtonContent = document.getElementById('pagination-button-content');
        const paginationButtonContentHalfWidth = paginationButtonContent.offsetWidth / 2;
        const paginationButtonContentLeft = paginationButtonContent.getBoundingClientRect().x;
        const paginationButtonContentRight = paginationButtonContent.getBoundingClientRect().right;

        const ContentboxLeft = paginationButtonContent.getBoundingClientRect().x;
        const ContentboxRight = paginationButtonContent.getBoundingClientRect().right;

        const button = this.paginationButtons1[index - 1];
        const buttonLeft = button.getBoundingClientRect().x;
        const buttonRight = button.getBoundingClientRect().right;

        const buttonOffsetHalfWidth = button.offsetWidth / 2;
        const buttonOffsetRight = button.offsetLeft + button.offsetWidth;
        
        if (buttonLeft < ContentboxLeft) {
            paginationButtonContent.scrollTo({left: 0, behavior: "smooth"});
        } else if (buttonRight > ContentboxRight - 24) {
            paginationButtonContent.scrollTo({left: buttonOffsetRight - paginationButtonContentHalfWidth + buttonOffsetHalfWidth, behavior: "smooth"});
        }

    }

    deselect() {
        for(let i = 0; i < this.paginationButtons1.length; i++) {
            if (this.paginationButtons1[i].classList.contains('show')) {
                this.paginationButtons1[i].classList.remove('show');
                this.paginationButtons2[i].classList.remove('show');
                break;
            }
        }    
    }

    select(index) {
        if (index === this.backPadIndex) {
            index = 1;
        } else if (index === this.frontPadIndex) {
            index = this.length;
        }
        this.paginationButtons1[index - 1].classList.add('show');
        this.paginationButtons2[index - 1].classList.add('show');

        this.slideContentBox(index);
    }

    async slideTo(index, isAuto = false) {
        if (isAuto) {
            if (this.currentIndex === this.backPadIndex) {
                this.slider.scrollTo(this.wrappers[1].offsetLeft, 0);
                this.currentIndex = 1;
                await new Promise((r) => setTimeout(r, 100));
            } else if (this.currentIndex === this.frontPadIndex) {
                this.slider.scrollTo(this.wrappers[this.length].offsetLeft, 0);
                this.currentIndex = this.length;
                await new Promise((r) => setTimeout(r, 100));
            }
        }
        this.deselect();
        this.slider.scrollTo({left: this.wrappers[index].offsetLeft, behavior: 'smooth'});
        this.select(index);

        this.resetTimer();

        this.currentIndex = index;
        if (index == this.frontPadIndex) {
            this.pageNow.textContent = this.length;
        } else if (index == this.backPadIndex) {
            this.pageNow.textContent = 1;
        } else {
            this.pageNow.textContent = index;
        }
    }

    slidePrev() {
        if (this.currentIndex === 0) {
            this.slideTo(this.length - 1, true);
        } else {
            this.slideTo(this.currentIndex - 1, true);
        }
    }

    slideNext() {
        if (this.currentIndex === this.wrappers.length - 1) {
            this.slideTo(2, true);
        } else {
            this.slideTo(this.currentIndex + 1, true);
        }
    }
}



class Carousel {
    constructor (section, url) {
        this.section = section;
        this.container = this.section.getElementsByClassName('container')[0];
        this.elem = this.section.getElementsByClassName('carousel-slide-pages')[0];
        this.leftButton = this.section.getElementsByClassName('carousel-left-button')[0];
        this.rightButton = this.section.getElementsByClassName('carousel-right-button')[0];
        this.gridGap = 8;
        this.currentPage = 0;

        getSrc(url).then(src => this.init(src));
    }
    
    init(src) {
        this.src = src;

        this.cards = this.createCards(this.src);
        this.createContainers(this.decideDisplayCardNum());

        this.contentCardContainers = this.elem.getElementsByClassName('content-card-container');

        console.log(this.elem);
        console.log(this.container);

        this.decideCardContainerWidth();

        this.leftButton.addEventListener('click', () => this.moveTo(this.currentPage - 1));
        this.rightButton.addEventListener('click', () => this.moveTo(this.currentPage + 1));

    }

    createStarScore(score) {
        const starString = '<i class="fas fa-star full"></i>'.repeat(Math.floor(Number(score)))
                            + '<i class="fas fa-star half"></i>'.repeat(/.5$/.test(score) ? 1 : 0)
                            + '<i class="fas fa-star"></i>'.repeat(5 - Math.ceil(Number(score)));
        return starString;
    }

    createCards(src) {
        const cards = [];

        for (let obj of src) {
            const cardString = `
            <div class="content-card">
                <img src="${obj.thumbnailUrl}" alt="">
                <div class="content-info">
                    <div class="card-title">
                        ${obj.title}
                    </div>
                    <div class="card-tutor">${obj.tutor}</div>
                    <div class="card-score">
                        <span class="star-rating">
                            ${this.createStarScore(obj.ratingScore)}
                        </span>
                        <span>(${obj.ratingCount})</span>
                    </div>
                    <div class="card-price">${obj.price}</div>
                    <div class="card-learners">${obj.learners}</div>
                </div>
            </div>`

            cards.push(cardString);
        }
        
        return cards;
    }
    
    decideDisplayCardNum() {
        const leng = this.src.length;
        let num;



        if (window.innerWidth > 1240) {
            num = 5;
        } else if (window.innerWidth > 1080) {
            num = 4;
        } else if (window.innerWidth > 618) {
            num = 3;
        } else {
            num = leng;
        }

        const repeat = leng / num;
        const remainder = leng % num;

        this.num = num;

        return [num, repeat, remainder];
    }

    createContainers([num, repeat, remainder]) {
        const cards = this.cards;
        const containers = [];

        for (let i = 0; i < repeat * num; i += num) {
            const sameContainerContents = cards.slice(i, i + num);
            const pageString = `
            <div class="content-card-container">
                ${sameContainerContents.join('')}
            </div>`
            containers.push(pageString);
        }
        
        this.elem.innerHTML = containers.join('');
    }

    decideCardContainerWidth() {
        const defaultWidth = this.container.offsetWidth;

        for (let i = 0; i < this.contentCardContainers.length; i++) {
            if (i === this.contentCardContainers.length - 1) {
                const childElementCount = this.contentCardContainers[i].childElementCount;
                const lastPageWidth = (defaultWidth - this.gridGap * (this.num - 1)) / this.num * childElementCount + this.gridGap * (childElementCount - 1);
                this.contentCardContainers[i].style.width = `calc(${lastPageWidth}px - 2rem)`;
                this.contentCardContainers[i].style.gridTemplateColumns = `repeat(${childElementCount}, 1fr)`;
            } else {
                this.contentCardContainers[i].style.width = `calc(${defaultWidth}px - 2rem)`;
            }
        }
    }

    moveTo(pageIndex) {
        this.elem.scrollTo({left: this.contentCardContainers[pageIndex].offsetLeft, behavior: "smooth"});
        this.currentPage = pageIndex;

        if (this.currentPage === 0) {
            this.leftButton.disabled = true;
        } else if (this.currentPage === this.contentCardContainers.length - 1) {
            this.rightButton.disabled = true;
        } else {
            this.leftButton.disabled = false;
            this.rightButton.disabled = false;
        }
    }
    
}


async function getSrc(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Response code ${response.status}`);
        }
    } catch(error) {
        throw new Error(error.message);
    }
}





function cartRadioHandler() {
    const cartRadioButtons = [document.getElementById('cart-radio'), document.getElementById('wishlist-radio')];

    const cartContent = document.getElementById('cart-content');
    const wishlistContent = document.getElementById('wishlist-content');

    if (cartRadioButtons[0].checked) {
        cartContent.classList.add('show');
        wishlistContent.classList.remove('show');
    } else {
        cartContent.classList.remove('show');
        wishlistContent.classList.add('show');
    }

}

function userInfoMoreHandler(e) {
    const userInfoList = document.getElementById('user-info-list');
    const userInfoMore = document.getElementById('user-info-list-more');
    const arrow = document.querySelector('#user-info-list-more-button i:last-child');
    
    if (arrow.classList.contains('lnr-chevron-down')) {
        arrow.classList.replace('lnr-chevron-down', 'lnr-chevron-up');
    } else {
        arrow.classList.replace('lnr-chevron-up', 'lnr-chevron-down');
    }

    userInfoMore.classList.toggle('show');
    userInfoList.scrollTop = userInfoList.scrollHeight;
}

function createMainSlide(list) {
    const temp = [];
    let firstResult;
    let lastResult;

    for (let i = 0; i < list.length; i++) {
        const item = list[i];

        const tags = item.tags.map(tag => `<span class="main-slide-tag" style="background: ${item.tagBackground}; color: ${item.tagFontColor}">${tag}</span>`).join('');

        const result = `
            <div class="main-slide-banner-wrapper w${item.index}" style="background:${item.color}">
                <div class="main-slide-banner">
                    <div class="main-slide-words" style="color: ${item.fontColor}">
                        <div class="main-slide-tag-wrapper">
                            ${tags}
                        </div>
                        <div class="main-slide-title">
                            ${item.title}
                        </div>
                        <div class="main-slide-description">
                            ${item.description}
                        </div>
                    </div>
                    <img src="${item.imgurl}" class="main-slide-image"></img>
                </div>
            </div>`;
        if (i === 0) {
            firstResult = result;
        } else if (i === list.length - 1) {
            lastResult = result;
        }
        temp.push(result);
    }
    temp.unshift(lastResult);
    temp.push(firstResult);
    return temp.join('');
}


function createBottomSlide(list) {
    const temp = [];
    
    for (let item of list) {
        const slideBannerString = `
            <div class="bottom-slide-banner-wrapper">
                <div class="bottom-slide-banner">
                    <div class="container">
                        <div class="bottom-slide-words">
                            <div class="bottom-slide-title" style="color:${item.color}">
                                ${item.title}
                            </div>
                            <a href="" class="bottom-slide-a-button">
                                ${item.buttonContent}
                            </a>
                        </div>
                    </div>
                    <img src="${item.imgUrl}" alt="">
                </div>
            </div>`
            
        temp.push(slideBannerString);
    }

    return temp.join('');
}

function createPaginationButton(list) {
    list = list.map(item => `<div class="pagination-button" data-index="${item.index}">${item.keyword}</div>`);
    return list.join('');
}

function paginationDropToggle(e) {
    const button = e.currentTarget;
    if (!button.classList.contains('open')) {
        button.classList.add('open');
    } else {
        button.classList.remove('open');
    }
}

function closePaginationDrop() {
    const button = document.getElementById('pagination-drop-button');
    if (button.classList.contains('open')) {
        button.classList.remove('open');
    }
}

function searchInfoFocus(e) {
    const input = e.currentTarget;
    input.classList.add('on');

    const searchHeader = document.getElementById('search-header');
    const menuHeight = document.getElementsByTagName('nav')[0].offsetHeight;
    window.scrollTo({top: searchHeader.offsetTop - menuHeight, behavior: "smooth"});
}

function searchInfoBlur(e) {
    const input = e.currentTarget;
    input.classList.remove('on');
}



function bottomSlideMove(tI) {
    console.log(tI);

    const bottomSlidePaginationButtons = document.getElementsByClassName('bottom-slide-pagination-button');
    for (let button of bottomSlidePaginationButtons) {
        if (button.classList.contains('on')) {
            button.classList.remove('on');
            bottomSlidePaginationButtons[tI].classList.add('on');
            break;
        }
    }

    const bottomSlideE = document.getElementById('bottom-slide-banner-container');
    const bottomSlideBanners = document.getElementsByClassName('bottom-slide-banner-wrapper');
    bottomSlideE.scrollTo({left: bottomSlideBanners[tI].offsetLeft, behavior:"smooth"});

    const bottomSlideLeftButton = document.getElementById('bottom-slider-left');
    const bottomSlideRightButton = document.getElementById('bottom-slider-right');
    if (tI == 0) {
        bottomSlideLeftButton.disabled = true;
        bottomSlideRightButton.disabled = false;
    } else if (tI == 3) {
        bottomSlideRightButton.disabled = true;
        bottomSlideLeftButton.disabled = false;
    } else {
        bottomSlideLeftButton.disabled = false;
        bottomSlideRightButton.disabled = false;
    }

    bottomCurrentI = tI;

}





//global var
let bottomCurrentI = 0;


async function main() {

    console.log(new Date());

    const cartLables = document.getElementsByName('cart');
    for (let label of cartLables) {
        label.addEventListener('click', cartRadioHandler);
    }

    const userInfoMoreButton = document.getElementById('user-info-list-more-button');
    userInfoMoreButton.addEventListener('click', userInfoMoreHandler);




    // Main Slider

    const mainSlideSrc = await getSrc('/json/main-slide-show.json');
    const mainSlideShowE = document.getElementById('main-slide-show');
    mainSlideShowE.innerHTML = createMainSlide(mainSlideSrc);

    const paginationButtonE = document.getElementById('pagination-button-content');
    paginationButtonE.innerHTML = createPaginationButton(mainSlideSrc);

    const paginationDropMenuE = document.getElementById('pagination-drop-menu-bottom');
    paginationDropMenuE.innerHTML = createPaginationButton(mainSlideSrc);

    const paginationDropButton = document.getElementById('pagination-drop-button');
    paginationDropButton.addEventListener('click', paginationDropToggle);
    const paginationDropCloseButton = document.querySelector('#pagination-drop-menu-top span:last-child');
    paginationDropCloseButton.addEventListener('click', closePaginationDrop);

    const slider = document.getElementById('main-slide-show');
    const wrappers = document.getElementsByClassName('main-slide-banner-wrapper');
    slider.scrollTo(wrappers[1].offsetLeft, 0);

    const paginationButtons1 = document.querySelectorAll('#pagination-button-content .pagination-button');
    const paginationButtons2 = document.querySelectorAll('#pagination-drop-menu-bottom .pagination-button');
    
    paginationButtons1[0].classList.add('show');
    paginationButtons2[0].classList.add('show');

    const allPages = document.getElementById('allpages');
    allPages.textContent = paginationButtons1.length;

    const slideLeftButton = document.getElementById('slide-left-button');
    const slideRightButton = document.getElementById('slide-right-button');

    const pauseButton = document.getElementsByClassName('fas fa-pause')[0];
    const playButton = document.getElementsByClassName('fas fa-play')[0];

    const mainSlider = new MainSlider(
        document.getElementById('main-slide-show'),
        document.querySelectorAll('#pagination-button-content .pagination-button'),
        document.querySelectorAll('#pagination-drop-menu-bottom .pagination-button'),
        document.getElementsByClassName('main-slide-banner-wrapper'),
        document.getElementById('page-now'),
        document.getElementsByClassName('fas fa-pause')[0],
        document.getElementsByClassName('fas fa-play')[0],
    );

    slideLeftButton.addEventListener('click', () => mainSlider.slidePrev());
    slideRightButton.addEventListener('click', () => mainSlider.slideNext());
    pauseButton.addEventListener('click', () => mainSlider.pauseToggle());
    playButton.addEventListener('click', () => mainSlider.pauseToggle());

    for (let button of [...paginationButtons1, ...paginationButtons2]) {
        button.addEventListener('click', () => mainSlider.slideTo(Number(button.dataset.index)));
    }



    const inputTitle = document.getElementById('input-title');
    const inputTitleContent = await getSrc('/json/input-title.json');
    const randomNum = Math.floor(inputTitleContent.length * Math.random());
    inputTitle.textContent = inputTitleContent[randomNum];

    const searchInfo = document.getElementById('search-info');
    searchInfo.addEventListener('focus', searchInfoFocus);
    searchInfo.addEventListener('blur', searchInfoBlur);




    // bottom slide

    const bottomSlideE = document.getElementById('bottom-slide-banner-container');
    const bottomSlideSrc = await getSrc('/json/bottom-slide.json');
    bottomSlideE.innerHTML = createBottomSlide(bottomSlideSrc);

    const bottomSlidePaginationButtons = document.getElementsByClassName('bottom-slide-pagination-button');
    const bottomSlideLeftButton = document.getElementById('bottom-slider-left');
    const bottomSlideRightButton = document.getElementById('bottom-slider-right');
    
    for (let button of bottomSlidePaginationButtons) {
        button.addEventListener('click', () => bottomSlideMove(button.dataset.index));
    }
    bottomSlideLeftButton.addEventListener('click', () => bottomSlideMove(bottomCurrentI - 1));
    bottomSlideRightButton.addEventListener('click', () => bottomSlideMove(bottomCurrentI + 1));



    // similar classes

    // const similarClassSrc = await getSrc('/json/similar-class.json');
    const similarSection = document.getElementById('similar');
    const similarSlider = new Carousel(similarSection, '/json/similar-class.json');

}

main();