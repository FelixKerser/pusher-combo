parts = PUSHER_PARTS.pusherParts;

partsImages = PUSHER_PARTS.pusherImages;


function updateActiveClass(swiper, type) {

    let catalogType = type;
    if(type == 'bottom'){
        catalogType = 'upper';
    }

    document.querySelectorAll(`.${catalogType}-catalog .item.${type}-side`).forEach(item => {
        item.className = 'item';
    });
    const activeSlide = swiper.slides[swiper.activeIndex];
    const activeId = activeSlide.getAttribute('data-id');

    document.querySelectorAll(`.${type} .item`).forEach(item => {
        item.classList.remove('active');
    });

    const activeItem = document.querySelector(`.${catalogType}-catalog .item[data-id="${activeId}"]`);
    if (activeItem) {
        if(activeItem.classList.contains('active')){
            return;
        }
        activeItem.classList.add('active');
        activeItem.classList.add(type + '-side');
    }
}

if (parts.upper) {
    parts.upper.forEach((upperItem) => {
        const upperSlide = document.createElement('div');
        upperSlide.classList.add('swiper-slide');
        upperSlide.setAttribute('data-id', upperItem.id);
        const image = partsImages.find((image) => image.id === upperItem.id) || { image: '', name: '' };
        upperSlide.innerHTML = `<div class="block"><img src="${image.image}" alt="${upperItem.name}"></div>`;
        document.querySelector('.upper .swiper-wrapper').appendChild(upperSlide);
    });
}
if (parts.middle) {
    parts.middle.forEach((middleItem) => {
        const middleSlide = document.createElement('div');
        middleSlide.classList.add('swiper-slide');
        middleSlide.setAttribute('data-id', middleItem.id);
        const image = partsImages.find((image) => image.id === middleItem.id) || { image: '', name: '' };
        middleSlide.innerHTML = `<div class="block"><img src="${image.image}" alt="${middleItem.name}"></div>`;
        document.querySelector('.middle .swiper-wrapper').appendChild(middleSlide);
    });
}
if (parts.upper) {
    for (let i = parts.upper.length - 1; i >= 0; i--) {
        const bottomItem = parts.upper[i];
        const bottomSlide = document.createElement('div');
        bottomSlide.classList.add('swiper-slide');
        bottomSlide.setAttribute('data-id', bottomItem.id);
        const image = partsImages.find((image) => image.id === bottomItem.id) || { image: '', name: '' };
        bottomSlide.innerHTML = `<div class="block"><img src="${image.image}" alt="${bottomItem.name}"></div>`;
        document.querySelector('.bottom .swiper-wrapper').appendChild(bottomSlide);
    }
}


const swiperInstances = {
    upper: new Swiper('.upper', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        speed: 750,
        navigation: {
            nextEl: '.upper-next',
            prevEl: '.upper-prev',
        },
        on: {
            slideChange: function () {
                updateActiveClass(this, 'upper');
            },
        },
    }),
    middle: new Swiper('.middle', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        speed: 750,
        navigation: {
            nextEl: '.middle-next',
            prevEl: '.middle-prev',
        },
        on: {
            slideChange: function () {
                updateActiveClass(this, 'middle');
            },
        },
    }),
    bottom: new Swiper('.bottom', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        speed: 750,
        navigation: {
            nextEl: '.bottom-next',
            prevEl: '.bottom-prev',
        },
        on: {
            slideChange: function () {
                updateActiveClass(this, 'bottom');
            },
        },
    }),
};

// Функция для перелистывания слайдера
// function goToSlide(swiperClass, dataId) {
//     // Проверяем, существует ли экземпляр Swiper
//     const swiperInstance = swiperInstances[swiperClass];
//     if (!swiperInstance) {
//         console.error(`Swiper instance for class ${swiperClass} not found`);
//         return;
//     }

//     // Находим слайд с нужным data-id
//     const targetSlide = document.querySelector(`.${swiperClass} .swiper-slide[data-id="${dataId}"]`);
//     if (!targetSlide) {
//         console.error(`Slide with data-id "${dataId}" not found in ${swiperClass}`);
//         return;
//     }

//     // Определяем индекс целевого слайда
//     const targetIndex = Array.from(targetSlide.parentNode.children).indexOf(targetSlide);

//     // Перелистываем к целевому слайду
//     swiperInstance.slideTo(targetIndex);
// }

// let purchaseBtn = document.getElementById('buy-btn');

let firstId = "";
let secondId = "";
let thirdId = "";

// function findActive(container){
//     return container.querySelector('.swiper-slide-active').getAttribute('data-id');
// }

function refreshPurchaseBtn(){
    // purchaseBtn.href = `https://store.staleks.com/cart/${firstId}:${secondId}:${thirdId}`;
}

// function connectSwiperProduct(container, prev, next, positionUpdater){

//     positionUpdater(findActive(container));
//     refreshPurchaseBtn();

//     prev.addEventListener('click', () => {
//         positionUpdater(findActive(container));
//         refreshPurchaseBtn();
//     })

//     next.addEventListener('click', () => {
//         positionUpdater(findActive(container));
//         refreshPurchaseBtn();
//     })
// }

// connectSwiperProduct(
//     document.querySelector('.upper'),
//     document.querySelector('.upper-prev'),
//     document.querySelector('.upper-next'),
//     (newId) => { firstId = newId; }
// );

// connectSwiperProduct(
//     document.querySelector('.middle'),
//     document.querySelector('.middle-prev'),
//     document.querySelector('.middle-next'),
//     (newId) => { secondId = newId; }
// );

// connectSwiperProduct(
//     document.querySelector('.bottom'),
//     document.querySelector('.bottom-prev'),
//     document.querySelector('.bottom-next'),
//     (newId) => { thirdId = newId; }
// );