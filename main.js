class MainSlider {

    constructor() {
        this.mainSlideShowE = document.getElementById('main-slide-show');
        getSrc('json/main-slide-show.json').then(mainSlideSrc => this.init(mainSlideSrc));
    }

    init(mainSlideSrc) {
        this.mainSlideShowE.innerHTML = this.createMainSlide(mainSlideSrc);

        this.paginationButtonE = document.getElementById('pagination-button-content');
        this.paginationButtonE.innerHTML = this.createPaginationButton(mainSlideSrc);

        this.paginationDropMenuE = document.getElementById('pagination-drop-menu-bottom');
        this.paginationDropMenuE.innerHTML = this.createPaginationButton(mainSlideSrc);

        this.paginationDropButton = document.getElementById('pagination-drop-button');
        this.paginationDropCloseButton = document.querySelector('#pagination-drop-menu-top span:last-child');

        this.slider = document.getElementById('main-slide-show');
        this.paginationButtons1 = document.querySelectorAll('#pagination-button-content .pagination-button');
        this.paginationButtons2 = document.querySelectorAll('#pagination-drop-menu-bottom .pagination-button');
        this.wrappers = document.getElementsByClassName('main-slide-banner-wrapper');
        this.pageNow = document.getElementById('page-now');
        this.pauseButton =  document.getElementsByClassName('fas fa-pause')[0];
        this.playButton =  document.getElementsByClassName('fas fa-play')[0];
        [this.gradientLeft, this.gradientRight] = document.getElementsByClassName('pagination-gradient');
        this.allPages = document.getElementById('allpages');
        
        this.defaultSetting();
        
        this.eventlisteners();
    }

    defaultSetting() {
        this.slider.scrollTo(this.wrappers[1].offsetLeft, 0);
        this.paginationButtons2[0].classList.add('show');
        this.paginationButtons1[0].classList.add('show');
        this.allPages.textContent = this.paginationButtons1.length;

        this.length = this.wrappers.length - 2;
        this.frontPadIndex = 0;
        this.backPadIndex = this.wrappers.length - 1;

        this.slideInterval = 2000;
        
        this.currentIndex = 1;

        this.playing = true;
        this.timer = setInterval(() => this.slideNext(), this.slideInterval);
         
        this.slideLeftButton = document.getElementById('slide-left-button');
        this.slideRightButton = document.getElementById('slide-right-button');
    }

    createPaginationButton(list) {
        list = list.map(item => `<div class="pagination-button" data-index="${item.index}">${item.keyword}</div>`);
        return list.join('');
    }
    
    paginationDropToggle(e) {
        const button = this.paginationDropButton;
        if (!button.classList.contains('open')) {
            button.classList.add('open');
        } else {
            button.classList.remove('open');
        }
    }
    
    closePaginationDrop() {
        if (this.paginationDropButton.classList.contains('open')) {
            this.paginationDropButton.classList.remove('open');
        }
    }

    eventlisteners() {
        this.paginationDropButton.addEventListener('click', () => this.paginationDropToggle());
        this.paginationDropCloseButton.addEventListener('click', () => this.closePaginationDrop());

        this.slideLeftButton.addEventListener('click', () => this.slidePrev());
        this.slideRightButton.addEventListener('click', () => this.slideNext());
        this.pauseButton.addEventListener('click', () => this.pauseToggle());
        this.playButton.addEventListener('click', () => this.pauseToggle());

        for (let button of [...this.paginationButtons1, ...this.paginationButtons2]) {
            button.addEventListener('click', () => this.slideTo(Number(button.dataset.index)));
        }
    }

    createMainSlide(list) {
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
        
        const ContentboxLeft = paginationButtonContent.getBoundingClientRect().x;
        const ContentboxRight = paginationButtonContent.getBoundingClientRect().right;

        const button = this.paginationButtons1[index - 1];
        const buttonLeft = button.getBoundingClientRect().x;
        const buttonRight = button.getBoundingClientRect().right;

        const buttonOffsetHalfWidth = button.offsetWidth / 2;
        const buttonOffsetRight = button.offsetLeft + button.offsetWidth;
        const buttonOffsetLeft = button.offsetLeft;
        
        if (buttonLeft < ContentboxLeft) {
            paginationButtonContent.scrollTo({left: 0, behavior: "smooth"});
            this.gradientLeft.style.display = 'none';
            this.gradientRight.style.display = 'block';
        } else if (buttonRight > ContentboxRight - 24) {
            paginationButtonContent.scrollTo({left: buttonOffsetLeft, behavior: "smooth"});
            this.gradientLeft.style.display = 'block';
            this.gradientRight.style.display = 'none';
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


class CarouselSection {
    constructor (obj) {
        this.category = obj.category;
        this.clickableTitle = obj.clickableTitle === 'true' ? true : false;
        this.url = obj.jsonUrl;
        this.badge = obj.badge ? obj.badge : '';
        this.description = obj.description ? obj.description : '';

        if (obj.title) {
            this.title = obj.title;
        } else {
            this.title = `내가 학습한 <span>${this.category[0].toUpperCase() + this.category.slice(1).toLowerCase()}</span> 분야 인기 강의`
        }

        if (this.clickableTitle) {
            this.title = `<a href="">${this.title}${this.badge ? '<span class="badge">' + this.badge + '</span>': ''}<i class="lnr lnr-chevron-right"></i></a>`
        }

        this.carouselSections = document.querySelectorAll('section.carousel');
        for (let section of this.carouselSections) {
            const id = section.getAttribute('id');
            if (this.category === id) {
                this.section = section;
                break;
            }
        }

        this.createSection();

        this.container = this.section.getElementsByClassName('container')[0];
        this.elem = this.section.getElementsByClassName('carousel-slide-pages')[0];
        this.leftButton = this.section.getElementsByClassName('carousel-left-button')[0];
        this.rightButton = this.section.getElementsByClassName('carousel-right-button')[0];
        this.gridGap = 8;
        this.currentPage = 0;

        getSrc(this.url).then(src => this.init(src));
    }
    
    init(src) {
        this.src = src;

        this.cards = this.createCards(this.src);

        this.relatedToWindowSize();

        this.leftButton.addEventListener('click', () => this.moveTo(this.currentPage - 1));
        this.rightButton.addEventListener('click', () => this.moveTo(this.currentPage + 1));
    }

    relatedToWindowSize() {
        this.createContainers(this.decideDisplayCardNum());

        this.contentCardContainers = this.elem.getElementsByClassName('content-card-container');

        this.decideCardContainerWidth();
    }

    createSection() {
        this.sectionString = `
            <div class="container">
                <h2>${this.title}</h2>
                <div class="carousel-container"> <!--고정값-->
                    <button class="carousel-left-button carousel-button" disabled="true">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-right-button carousel-button">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="carousel-slide-pages"> <!--콘텐츠 길이만큼-->
                        
                    </div>
                </div>
            </div>`

        this.section.innerHTML = this.sectionString;

        this.carouselSlidePages = document.querySelector(`#${this.category}.carousel-slide-pages`);
    }

    createStarScore(obj) {
        let starHTMLString = '';
        const score = obj.ratingScore;

        if (obj.ratingScore && obj.ratingCount) {
            const starString = '<i class="fas fa-star full"></i>'.repeat(Math.floor(Number(score)))
                                + '<i class="fas fa-star half"></i>'.repeat(/.5$/.test(score) ? 1 : 0)
                                + '<i class="fas fa-star"></i>'.repeat(5 - Math.ceil(Number(score)));
            
            starHTMLString = `
                        <div class="card-score">
                            <span class="star-rating">
                                ${starString}
                            </span>
                            <span>(${obj.ratingCount})</span>
                        </div>`;
        } 

        return starHTMLString;
    }

    createPrice(obj) {
        let priceString = '';

        const price = obj.price;
        const discountPrice = obj.discountPrice ? obj.discountPrice : '';

        if (discountPrice) {
            priceString = `<div class="card-price">
                                <span class="origin-price">${price}</span>
                                <span class="discounted-price">${discountPrice}</span>
                            </div>`;
        } else {
            priceString = `<div class="card-price"><span class="regular-price">${price}</span></div>`;
        }

        return priceString;
    }

    createTags(tags) {
        const newTags = [];
        for (let tag of tags) {
            if (/\d+/.test(tag)) {
                newTags.push('<div class="card-tag price">' + tag + '</div>');
            } else if (tag === '업데이트' || tag === '새강의') {
                newTags.push('<div class="card-tag update">' + tag + '</div>');
            } else if (tag === '할인중') {
                newTags.push('<div class="card-tag discount">' + tag + '</div>');
            }
        }
        return newTags.join('')
    }

    createCards(src) {
        const cards = [];

        for (let obj of src) {
            const cardString = `
            <div class="content-card">
                <div class="thumb-wrapper">
                    <img src="${obj.thumbnailUrl}" alt="">
                </div>
                <div class="content-info">
                    <div class="card-title">
                        ${obj.title}
                    </div>
                    <div class="card-tutor">${obj.tutor}</div>
                    ${this.createStarScore(obj)}
                    ${this.createPrice(obj)}
                    <div class="card-tags">${this.createTags(obj.tags)}</div>
                </div>
                <a href="">
                    <div class="hover-div">
                    <div class="hover-title">
                        ${obj.title}
                    </div>
                    <div class="card-description">
                        ${obj.description}
                    </div>
                    <div class="hover-bottom">
                        <div class="hover-info">
                            <div class="level"><i class="fas fa-signal"></i>${obj.level}</div>
                            <div class="category"><i class="lnr lnr-database"></i>${obj.category.join(', ')}</div>
                            <div class="subclass">
                                <i class="lnr lnr-pie-chart"></i>
                                ${obj.subclass.join(', ')}
                            </div>
                        </div>
                        <div class="hover-icons">
                            <div><a href=""><i class="lnr lnr-cart"></i></a><div class="icon-hover-text">바구니에 추가하기</div></div>
                            <div><a href=""><i class="lnr lnr-heart"></i></a><div class="icon-hover-text">위시리스트에 추가하기</div></div>
                            <div><a href=""><i class="lnr lnr-plus-circle"></i></a><div class="icon-hover-text">내 목록에 추가하기</div></div>
                        </div>
                    </div>
                    </div>
                </a>
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
        } else if (window.innerWidth > 840) {
            num = 4;
        } else {
            num = 3;
        }

        const repeat = leng / num;
        const remainder = leng % num;

        this.num = num;
        this.repeat = repeat;
        this.remainder = remainder;
    }

    createContainers() {
        const num = this.num;
        const repeat = this.repeat;
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
        const defaultWidth = this.container.offsetWidth - 40;

        for (let i = 0; i < this.contentCardContainers.length; i++) {
            if (i === this.contentCardContainers.length - 1 && this.remainder !== 0) {
                const aCardWidth = (defaultWidth - this.gridGap * (this.num - 1)) / this.num;
                const lastPageWidth = aCardWidth * this.remainder + this.gridGap * (this.remainder - 1);
                this.contentCardContainers[i].style.width = `${lastPageWidth}px`;
                this.contentCardContainers[i].style.gridTemplateColumns = `repeat(${this.remainder}, 1fr)`;
            } else {
                this.contentCardContainers[i].style.width = `${defaultWidth}px`;
                this.contentCardContainers[i].style.gridTemplateColumns = `repeat(${this.num}, 1fr)`;
            }
        }
    }

    moveTo(pageIndex) {
        this.elem.scrollTo({left: this.contentCardContainers[pageIndex].offsetLeft, behavior: "smooth"});
        this.currentPage = pageIndex;

        if (this.currentPage === 0) {
            this.leftButton.disabled = true;
            this.rightButton.disabled = false;
        } else if (this.currentPage === this.contentCardContainers.length - 1) {
            this.leftButton.disabled = false;
            this.rightButton.disabled = true;
        } else {
            this.leftButton.disabled = false;
            this.rightButton.disabled = false;
        }
    }
    
}


class BottomSlider {
    
    constructor() {
        this.bottomSlideE = document.getElementById('bottom-slide-banner-container');
        getSrc('json/bottom-slide.json').then(bottomSlideSrc => this.init(bottomSlideSrc));
    }

    init(bottomSlideSrc) {
        
        this.bottomSlideE.innerHTML = this.createBottomSlide(bottomSlideSrc);
        
        this.bottomSlidePaginationButtons = document.getElementsByClassName('bottom-slide-pagination-button');
        this.bottomSlideLeftButton = document.getElementById('bottom-slider-left');
        this.bottomSlideRightButton = document.getElementById('bottom-slider-right');
        
        this.bottomCurrentI = 0;

        for (let button of this.bottomSlidePaginationButtons) {
            button.addEventListener('click', () => this.bottomSlideMove(button.dataset.index));
        }
        this.bottomSlideLeftButton.addEventListener('click', () => this.bottomSlideMove(this.bottomCurrentI - 1));
        this.bottomSlideRightButton.addEventListener('click', () => this.bottomSlideMove(this.bottomCurrentI + 1));
    }

    createBottomSlide(list) {
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

    bottomSlideMove(tI) {

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
    
        this.bottomCurrentI = tI;
    
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

function mediaqueryFunc() {
    const largeWindow = matchMedia("screen and (max-width: 1024px)");
    const mediumWindow = matchMedia("screen and (max-width: 768px)");
    const smallWindow = matchMedia("screen and (max-width: 480px)");

    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const mobileMenuWrapper = document.getElementById('mobile-menu-wrapper');
    const mobileMenuBlack = document.getElementById('mobile-menu-black');

    const classMenuD1Lis = document.querySelectorAll('#class-menu-depth-1 > li');
    const classMenuD2s = document.querySelectorAll('.class-menu-depth-2');
    // const classMenuD3 = document.querySelectorAll('.class-menu-depth-3');

    const userIcon = document.getElementById('user-info-wrapper');
    const userDropMenu = document.getElementById('user-drop-menu');
    const userMenuBlack = document.getElementById('user-info-black');

    const body = document.getElementsByTagName('body')[0];

    const footerContentColumns = document.querySelectorAll('footer .footer-content-column');
    const footerInfoTitle = document.querySelector('footer #footer-bottom-left div:nth-child(2)');
    const footerInfo = document.querySelector('footer #footer-bottom-left div:nth-child(3)');


    if (largeWindow.matches) {

        // mobile menu click event

        mobileMenuIcon.addEventListener('click', () => {
            if (!mobileMenuWrapper.classList.contains('show') && !userDropMenu.classList.contains('show')) {
                mobileMenuBlack.classList.add('showBlack');
                mobileMenuWrapper.classList.add('show');
                body.style.height = '100vh';
                body.style.overflow = 'hidden';
            }
        })
    
        userIcon.addEventListener('click', () => {
            if (!userDropMenu.classList.contains('show') && !mobileMenuWrapper.classList.contains('show')) {
                userMenuBlack.classList.add('showBlack');
                userDropMenu.classList.add('show');
            }
        })
    
        userMenuBlack.addEventListener('click', (e) => {
            userMenuBlack.classList.remove('showBlack');
            userDropMenu.classList.remove('show');
            body.removeAttribute('style');
            e.stopPropagation();
        })
    
        mobileMenuBlack.addEventListener('click', (e) => {
            mobileMenuBlack.classList.remove('showBlack');
            mobileMenuWrapper.classList.remove('show');
            body.removeAttribute('style');
            e.stopPropagation();
        })

        for (let li of classMenuD1Lis) {
            const thisClassMenuD2 = li.getElementsByClassName('class-menu-depth-2')[0];
            li.addEventListener('click', () => {
                for (let d2 of classMenuD2s) {
                    if (d2.style.display === 'block') {
                        d2.removeAttribute('style');
                        break;
                    }
                }
                thisClassMenuD2.style.display = 'block';
            })
        }

        for (let d2 of classMenuD2s) {
            const classMenuD2Lis = d2.getElementsByTagName('li');
            for (d2Li of classMenuD2Lis) {
                const classMenud3 = d2Li.getElementsByClassName('class-menu-depth-3')[0];
                d2Li.addEventListener('click', () => {
                    if (!classMenud3.classList.contains('show')) {
                        classMenud3.classList.add('show');
                        classMenud3.style.maxHeight = `${classMenud3.scrollHeight}px`;
                    } else {
                        classMenud3.classList.remove('show');
                        classMenud3.removeAttribute('style');
                    }
                })
            }
        }

    }

    if (mediumWindow.matches) {
        // mobile footer click event

        for (let column of footerContentColumns) {
            const title = column.getElementsByTagName('h5')[0];
            const ul = column.getElementsByTagName('ul')[0];
            title.innerHTML += '<i class="lnr lnr-chevron-down"></i>';
            title.addEventListener('click', () => {
                if (!column.classList.contains('show')) {
                    column.classList.add('show');
                    column.style.maxHeight = `${column.scrollHeight}px`;
                } else {
                    column.classList.remove('show');
                    column.removeAttribute('style');
                }
            })
        }

        footerInfoTitle.innerHTML += '<i class="lnr lnr-chevron-down"></i>';
        footerInfoTitle.addEventListener('click', () => {
            if (!footerInfo.classList.contains('show')) {
                footerInfo.classList.add('show');
                footerInfo.style.maxHeight = `${footerInfo.scrollHeight}px`;
            } else {
                footerInfo.classList.remove('show');
                footerInfo.removeAttribute('style');
            }
        })
    }

   
    if (smallWindow.matches) {
       

    }

   

}


async function main() {

    const cartLables = document.getElementsByName('cart');
    for (let label of cartLables) {
        label.addEventListener('click', cartRadioHandler);
    }

    const userInfoMoreButton = document.getElementById('user-info-list-more-button');
    userInfoMoreButton.addEventListener('click', userInfoMoreHandler);


    // media query

    mediaqueryFunc();
    


    // Main Slider    
    
    const mainSlider = new MainSlider();
   

    //input section

    const inputTitle = document.getElementById('input-title');
    const inputTitleContent = await getSrc('json/input-title.json');
    const randomNum = Math.floor(inputTitleContent.length * Math.random());
    inputTitle.textContent = inputTitleContent[randomNum];

    const searchInfo = document.getElementById('search-info');
    searchInfo.addEventListener('focus', searchInfoFocus);
    searchInfo.addEventListener('blur', searchInfoBlur);


    // bottom slide

    const bottomSlider = new BottomSlider();


    // carouselSections

    const carouselSectionSrc = await getSrc('json/carousel-list.json');
    const carouselSections = [];
    for (let obj of carouselSectionSrc) {
        const newSection = new CarouselSection(obj);
        carouselSections.push(newSection);
    }

    window.addEventListener('resize', () => window.location.reload());

}

main();