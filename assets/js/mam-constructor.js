let pusherObj = PUSHER_PARTS;

let parts = pusherObj.pusherParts;

let cart = pusherObj.cart;

if(getCookie('cart_mam')){
    cart = JSON.parse(getCookie('cart_mam'));
}

function goToSlide(swiperClass, dataId) {
    // Проверяем, существует ли экземпляр Swiper
    const swiperInstance = swiperInstances[swiperClass];
    if (!swiperInstance) {
        console.error(`Swiper instance for class ${swiperClass} not found`);
        return;
    }

    // Находим слайд с нужным data-id
    const targetSlide = document.querySelector(`.${swiperClass} .swiper-slide[data-id="${dataId}"]`);
    if (!targetSlide) {
        console.error(`Slide with data-id "${dataId}" not found in ${swiperClass}`);
        return;
    }

    // Определяем индекс целевого слайда
    const targetIndex = Array.from(targetSlide.parentNode.children).indexOf(targetSlide);

    // Перелистываем к целевому слайду
    swiperInstance.slideTo(targetIndex);
}

const totalQuantity = document.querySelector('#total-quantity');

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

document.querySelectorAll('.add-combo').forEach((element) => {
    element.addEventListener('click', (event) => {
        event.preventDefault();

        addToCart(document.querySelector('.upper .swiper-slide-active').getAttribute('data-id'));
        addToCart(document.querySelector('.middle .swiper-slide-active').getAttribute('data-id'));
        addToCart(document.querySelector('.bottom .swiper-slide-active').getAttribute('data-id'));

        if(element.innerHTML !== 'Added to cart'){
            let returnText = element.innerHTML;
            element.innerHTML = 'Added to cart';
            setTimeout(() => {element.innerHTML = returnText}, 1500);
        }

        if (element.classList.contains('combo-mobile')) {
            const buyBtn = document.querySelector('#buy-btn');
            const offset = buyBtn.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 50;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

document.getElementById('reset-cart').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('confirmation-popup').style.display = 'flex';
});

document.getElementById('confirm-no').addEventListener('click', function() {
    document.getElementById('confirmation-popup').style.display = 'none';
});

function clear_cart(){
    cart = [];
    if(getCookie('cart_mam')){
        deleteCookie('cart_mam');
    }
    refreshCart();
}

document.getElementById('confirm-yes').addEventListener('click', function() {
    clear_cart();
    document.getElementById('confirmation-popup').style.display = 'none';
});

document.getElementById('confirmation-popup').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

function handleCatalogClick(catalogClass, swiper) {
    document.querySelectorAll(`.${catalogClass} .item`).forEach((item) => {
        item.addEventListener('click', () => {
        const targetId = item.dataset.id;
        const targetSlide = document.querySelector(`.swiper-container.${swiper} .swiper-slide[data-id="${targetId}"]`);
        
        if (targetSlide) {
            const targetIndex = Array.from(targetSlide.parentNode.children).indexOf(targetSlide);
            swiper.slideTo(targetIndex);
        }
        });
    });
}

function updateTotalPrice(){
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let formattedTotal = (total / 100).toFixed(2).replace('.', '.');
    document.querySelector('#price').textContent = formattedTotal;
}

function refreshCatalog(){
    let upperActiveElement = document.querySelector('.upper-catalog .active.upper-side');
    let middleActiveElement = document.querySelector('.middle-catalog .active.middle-side');
    let bottomActiveElement = document.querySelector('.upper-catalog .active.bottom-side');
    
    let upperActive = upperActiveElement ? upperActiveElement.getAttribute('data-id') : null;
    let middleActive = middleActiveElement ? middleActiveElement.getAttribute('data-id') : null;
    let bottomActive = bottomActiveElement ? bottomActiveElement.getAttribute('data-id') : null;

    document.querySelector('.upper-catalog').innerHTML = '';
    document.querySelector('.middle-catalog').innerHTML = '';

    if (parts.upper) {
        parts.upper.forEach((upperItem) => {
            const cartItem = cart.find(item => item.id === upperItem.id);
            if(cartItem){
                upperItem.quantity = cartItem.quantity;
            } else {
                upperItem.quantity = 0;
            }

            const upperSlide = document.createElement('div');
            upperSlide.classList.add('item');
            if(upperItem.id === upperActive){
                upperSlide.classList.add('active');
                upperSlide.classList.add('upper-side');
            } else if(upperItem.id === bottomActive){
                upperSlide.classList.add('active');
                upperSlide.classList.add('bottom-side');
            }
            upperSlide.setAttribute('data-id', upperItem.id);
            upperSlide.setAttribute('data-quantity', upperItem.quantity);
            const image = pusherObj.pusherImages.find((image) => image.id === upperItem.id)  || { image: '', name: '' };;
            upperSlide.innerHTML = `<span class="item-sku">${upperItem.SKU}</span><img src="${image.image}" alt="${upperItem.name}"><div class="quantity ${upperItem.quantity > 0 && `active`}"><div class="q-btn q-decrease" data-id=${upperItem.id}>−</div><div class="q-value">${upperItem.quantity}</div><div class="q-btn q-increase" data-id=${upperItem.id}>+</div></div>`;
            document.querySelector('.upper-catalog').appendChild(upperSlide);
        });
    }
    
    if (parts.middle) {
        parts.middle.forEach((middleItem) => {
            const cartItem = cart.find(item => item.id === middleItem.id);
            if(cartItem){
                middleItem.quantity = cartItem.quantity;
            } else {
                middleItem.quantity = 0;
            }

            const middleSlide = document.createElement('div');
            middleSlide.classList.add('item');
            if(middleItem.id === middleActive){
                middleSlide.classList.add('active');
                middleSlide.classList.add('middle-side');
            }
            middleSlide.setAttribute('data-id', middleItem.id);
            middleSlide.setAttribute('data-quantity', middleItem.quantity);
            const image = pusherObj.pusherImages.find((image) => image.id === middleItem.id)  || { image: '', name: '' };;
            middleSlide.innerHTML = `<span class="item-sku">${middleItem.SKU}</span><img src="${image.image}" alt="${middleItem.name}"><div class="quantity ${middleItem.quantity > 0 && `active`}"><div class="q-btn q-decrease" data-id=${middleItem.id}>−</div><div class="q-value">${middleItem.quantity}</div><div class="q-btn q-increase" data-id=${middleItem.id}>+</div></div>`;
            document.querySelector('.middle-catalog').appendChild(middleSlide);
        });
    }

    document.querySelectorAll('.item').forEach((item) => {
        item.addEventListener('click', (event) => {
            if (!event.target.closest('.quantity')) {
                const dataId = item.dataset.id; // data-id элемента
                const swiperClass = item.closest('.catalog').dataset.swiperClass; // Класс слайдера
                if (swiperClass && dataId) {
                    if (swiperClass === 'middle') {
                        goToSlide(swiperClass, dataId); // Вызов функции перелистывания
                    } else {
                        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
                        const targetClass = scrollPosition > 200 ? 'bottom' : 'upper';
                        goToSlide(targetClass, dataId); // Вызов функции перелистывания
                    }
                }

                refreshCatalog();
            }
        });
    });

    const quantityIncrease = document.querySelectorAll('.q-increase');
    const quantityDecrease = document.querySelectorAll('.q-decrease');

    quantityIncrease.forEach((item) => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            addToCart(id);
        });
    });

    quantityDecrease.forEach((item) => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            removeFromCart(id);
        });
    });

    updateTotalPrice();
}

refreshCatalog();

setTimeout(() => {
    const upperCatalogItems = document.querySelectorAll('.upper-catalog .item');
    const middleCatalogItems = document.querySelectorAll('.middle-catalog .item');

    if (upperCatalogItems.length > 0) {
        upperCatalogItems[0].classList.add('active', 'upper-side');
        upperCatalogItems[upperCatalogItems.length - 1].classList.add('active', 'bottom-side');
    }

    if (middleCatalogItems.length > 0) {
        middleCatalogItems[0].classList.add('active', 'middle-side');
    }
}, 100);


const items = document.querySelectorAll('div.item');

function changeQuantity(id, change){

}

function updateTotalQuantity(){
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalQuantity.textContent = total;
    if(total <= 0){
        totalQuantity.classList.add('hidden');
    } else {
        totalQuantity.classList.remove('hidden');
    }
}

updateTotalQuantity();

function refreshCart(){
    document.querySelector('.cart').innerHTML = '';
    cart.forEach((item) => {
        // const cartItem = document.createElement('div');

        // const cartItemQuantity = document.createElement('div');
        // const cartItemQuantityInput = document.createElement('div');

        // cartItemQuantity.classList.add('cart-item-quantity');
        // cartItemQuantityInput.classList.add('cart-item-quantity-input');

        // cartItemQuantity.innerHTML = `<span>${item.quantity}</span>`;
        // cartItemQuantityInput.innerHTML = `<span class="quantityChange${item.id}">+</span><span class="quantityChange${item.id}">-</span>`;

        // quantityChange = document.querySelectorAll(`.quantityChange${item.id}`);

        // quantityChange.forEach((change) => {
        //     change.addEventListener('click', () => {
        //         if(change.innerHTML === '+'){
        //             item.quantity++;
        //         } else {
        //             item.quantity--;
        //         }
        //         refreshCart();
        //     });
        // });

        // cartItem.classList.add('cart-item');
        // cartItem.classList.add('item');
        // cartItem.setAttribute('data-id', item.id);
        // cartItem.setAttribute('data-quantity', item.quantity);
        // cartItem.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
        // document.querySelector('.cart').appendChild(cartItem);

        // cartItem.appendChild(cartItemQuantity);
    });

    updateTotalQuantity();

    refreshCatalog();
}

function addToCart(id){
    let addedItem = parts.upper.find(item => item.id === id)
    if (!addedItem){
        addedItem = parts.middle.find(item => item.id === id);
    }
    const cartItem = cart.find(item => item.id === addedItem.id);
    if(cartItem){
        cartItem.quantity++;
    } else {
        cart.push(addedItem);
        cart[cart.indexOf(addedItem)].quantity++;
    }

    setCookie('cart_mam', JSON.stringify(cart), 1);

    refreshCart();
}

function removeFromCart(id){
    let removedItem = parts.upper.find(item => item.id === id)
    if (!removedItem){
        removedItem = parts.middle.find(item => item.id === id);
    }
    const cartItem = cart.find(item => item.id === removedItem.id);
    if(cartItem){
        cartItem.quantity--;
        if(cartItem.quantity == 0){
            cart = cart.filter(item => item.id !== removedItem.id);
        }
    }

    setCookie('cart_mam', JSON.stringify(cart), 1);

    refreshCart();
}

const purchaseBtn = document.getElementById('buy-btn');
purchaseBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const itemsToAdd = cart.map(item => ({
        id: item.id,
        quantity: item.quantity
    }));

    fetch('https://store.staleks.com/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [itemsToAdd]
        })
      }).then(response => response.json())
        .then(data => {
          console.log('Товар добавлен в корзину', data);
        }).catch(error => {
          console.error('Ошибка при добавлении товара:', error);
        });
});