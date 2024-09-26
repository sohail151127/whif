(function() {
  const selectors = {
    elToObserve: ".new-main-product-parent.product",
    stickyEl: ".buy_buttons_price--wrapper",
    stickyClass: "stick"
  };

  const elementToObserve = document.querySelector(selectors.elToObserve);
  if (elementToObserve === null) return
  const elementToStick = document.querySelector(selectors.stickyEl);
  if (elementToStick === null) return

  const makeFormSticky = function(entries) {
    const [entry] = entries;

    // Check if the observed element is intersecting
    if (entry.isIntersecting) {
      // If it is intersecting, remove the sticky class
      elementToStick.classList.remove(selectors.stickyClass);
      elementToStick.classList.add('unstick');
    } else {
      // If it is not intersecting, add the sticky class
      elementToStick.classList.add(selectors.stickyClass);
    }
  };

  const stickyFormObserver = new IntersectionObserver(makeFormSticky, {
    root: null,     // Use the viewport as the root
    threshold: 0,   // Trigger the callback as soon as any part of the element is visible
  });
  stickyFormObserver.observe(elementToObserve);
})();
/** Bundle Page JS Abdul **/

function getParams(str) {
  let queryString = str || window.location.search || ''
  let keyValPairs = []
  const params = {}
  queryString = queryString.replace(/.*?\?/, '')

  if (queryString.length) {
    keyValPairs = queryString.split('&')
    for (const pairNum in keyValPairs) {
      const key = keyValPairs[pairNum].split('=')[0]
      if (!key.length) continue
      if (typeof params[key] === 'undefined') { params[key] = [] }
      params[key].push(keyValPairs[pairNum].split('=')[1])
    }
  }
  return params
}

function handleAddAndQuantityChange() {
  var addActions = document.querySelectorAll('button.add-action[data-action="add"]')
  var quantityBtns = document.querySelectorAll('button[data-action]')
  if (addActions.length === 0) return
  addActions.forEach(function(action){
    action.addEventListener('click', function(e){
      e.stopPropagation()
      e.preventDefault()
      var target = e.target
      var parent = target.closest('.product__actions-container')
      
      var actions = parent.querySelector('.bundler__product__actions')
      var quantity = parent.querySelector('.bundler__product__quantity')
      var globalLimit = parseInt(document.querySelector('.whif-multicolumn-wrapper').dataset.globalLimit, 10)
      var totalAddedQuantity = handleCalculateTotalQuantity()
      var temporaryAddedQuantity = (totalAddedQuantity + 1)
      if (temporaryAddedQuantity === globalLimit) {
        quantity.setAttribute('quantity-items', 1)
        quantity.innerText = 1
        target.style.display = 'none'
        actions.style.display = 'flex'
        handleDisableButtonsIfLimitReached()
        handleBundleAddToFooter()
      }
       quantity.setAttribute('quantity-items', 1)
       quantity.innerText = 1
       target.style.display = 'none'
       actions.style.display = 'flex'
       handleBundleAddToFooter()
    })
  })
  quantityBtns.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation()
      e.preventDefault()
      var target = e.target
      var parent = target.closest('.bundler__product__actions')
      var quantity = parent.querySelector('.bundler__product__quantity')
      var globalLimit = parseInt(document.querySelector('.whif-multicolumn-wrapper').dataset.globalLimit, 10)
      var isPlus = target.dataset.action === 'plus'
      if (isPlus) {
        var value = (parseInt(quantity.getAttribute('quantity-items'), 10) + 1)
        var totalAddedQuantity = handleCalculateTotalQuantity()
        var temporaryAddedQuantity = (totalAddedQuantity + 1)
        if (temporaryAddedQuantity === globalLimit) {
          quantity.setAttribute('quantity-items', value)
          quantity.innerText = value
          handleBundleAddToFooter()
          handleDisableButtonsIfLimitReached()
          return
        }
        quantity.setAttribute('quantity-items', value)
        quantity.innerText = value
        handleBundleAddToFooter()
        return
      }
      var container = target.closest('.product__actions-container')
      var actionButtonAdd = container.querySelector('button.add-action[data-action="add"]')
      var value = (parseInt(quantity.getAttribute('quantity-items'), 10) - 1)
      if (value > 0) {
        quantity.setAttribute('quantity-items', value)
        quantity.innerText = value
        handleBundleAddToFooter()
        handleEnableButtonsIfLimitNotReached()
      } else {
        actionButtonAdd.style.display = 'inline-flex'
        parent.style.display = 'none'
        quantity.setAttribute('quantity-items', value)
        quantity.innerText = value
        handleBundleAddToFooter()
        handleEnableButtonsIfLimitNotReached()
      }
    })
  })
}
function handleChangePriceBasedOnDiscount(item) {
  var currentDiscount = parseInt(item.dataset.maxDiscount, 10)
  if (Number(currentDiscount) === 0) {
    var bundleHiddenPrice = document.querySelectorAll('.bundle-item-price .text-subdued');
    bundleHiddenPrice.forEach(element => {
        element.classList.add('hidden');
    });
  } else {
      var bundleHiddenPrice = document.querySelectorAll('.bundle-item-price .text-subdued');
      bundleHiddenPrice.forEach(element => {
          element.classList.remove('hidden');
      });
  }
  var cards = document.querySelectorAll('product-card[data-actual-price]')
  cards.forEach(function(card){
    var actualPrice = parseInt(card.dataset.actualPrice, 10)
    var percentage = (1 - (currentDiscount / 100))
    var discountedPrice = (percentage * actualPrice)
    var priceWithCurrency = window.themeVariables.Currency.formatMoney(discountedPrice, window.themeVariables.settings.moneyFormat)
    var priceNode = card.querySelector('price-list.price-list .bundle-item-price__payable')
    priceNode.innerText = priceWithCurrency
  })
  return
}
function initailChangePriceBasedOnDiscount() {
  var btn = document.querySelector('.multi-column__item a.heading._active')
  if (btn === null) return
  var item = btn.closest('.multi-column__item')
  handleChangePriceBasedOnDiscount(item)
}
function handleRecalculateSelectionForSmallLimitChange() {
  var cards = document.querySelectorAll('.bundler__product__quantity[quantity-items]')
  cards.forEach(function(card){
    var parent = card.closest('.product__actions-container')
    card.setAttribute('quantity-items', 0)
    var actionAdd = parent.querySelector('button[data-action="add"]')
    var actionAddButtons = parent.querySelector('.bundler__product__actions')
    actionAdd.style.display = 'inline'
    actionAddButtons.style.display = 'none'
  })
}
function handleLimitSelection() {
  var limitBtn = document.querySelector('.whif-multicolumn-wrapper')
  if (limitBtn === null) return
  var btns = limitBtn.querySelectorAll('.multi-column__item a.heading')
  btns.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault()
      e.stopPropagation()
      var target = e.target
      var item = target.closest('.multi-column__item')
      var currentLimit = item.dataset.quantity
      handleChangePriceBasedOnDiscount(item)
      limitBtn.dataset.globalLimit = currentLimit
      btns.forEach(function(btn){
        btn.classList.remove('_active')
      })
      target.classList.add('_active')
      var totalAddedQuantity = handleCalculateTotalQuantity()
      handleEnableButtonsIfLimitNotReached()
      if (totalAddedQuantity > currentLimit) {
        handleRecalculateSelectionForSmallLimitChange()
      }
      handleBundleAddToFooter()
    })
  })
}
function handleCalculateTotalQuantity() {
  var quantityInputs = document.querySelectorAll('.bundler__product__quantity')
  var totalAddedQuantity = 0
  quantityInputs.forEach(function(input){
    var quantity = parseInt(input.getAttribute('quantity-items'), 10)
    totalAddedQuantity = quantity + totalAddedQuantity
  })
  return totalAddedQuantity
}
function handleHasLimitReached() {
  var globalLimit = parseInt(document.querySelector('.whif-multicolumn-wrapper').dataset.globalLimit, 10)
  var totalAddedQuantity = handleCalculateTotalQuantity()
  if (totalAddedQuantity >= globalLimit) return true
  return false
}
function handleDisableButtonsIfLimitReached() {
  var containers = document.querySelectorAll('.product__actions-container')
   containers.forEach(function (container) {
     var addBtn = container.querySelector('.add-action')
     var addBtnPlus = container.querySelector('.bundler__product__plus')
     addBtn.classList.add('_disabled')
     addBtn.setAttribute('disabled', 'disabled')
     addBtnPlus.classList.add('_disabled')
     addBtnPlus.setAttribute('disabled', 'disabled')
   })
}
function handleEnableButtonsIfLimitNotReached() {
  var containers = document.querySelectorAll('.product__actions-container')
   containers.forEach(function (container) {
     var addBtn = container.querySelector('.add-action')
     var addBtnPlus = container.querySelector('.bundler__product__plus')
     addBtn.classList.remove('_disabled')
     addBtn.removeAttribute('disabled')
     addBtnPlus.classList.remove('_disabled')
     addBtnPlus.removeAttribute('disabled')
   })
}
function handleBundleAddToFooter() {
  var globalLimit = parseInt(document.querySelector('.whif-multicolumn-wrapper').dataset.globalLimit, 10)
  var totalAddedQuantity = handleCalculateTotalQuantity()
  var emptyFooter = document.querySelector('.empty-bundle-cart')
  var footerInProgress = document.querySelector('.quantity-bundle-cart')
  var footerInCompleteNoticeRight = document.querySelector('.quantity-bundle-cart-right')
  var footerInCompleteNoticeLet = document.querySelector('.quantity-bundle-cart-left .bundle-quantity span')
  var footerInCompleteButton = document.querySelector('.cart-price-button')
  if (totalAddedQuantity >= 1 && totalAddedQuantity < globalLimit) {
    emptyFooter.classList.add('_hide')
    footerInProgress.classList.add('_show')
    footerInCompleteButton.classList.remove('_show')
    footerInCompleteNoticeRight.classList.remove('_hide')
    footerInCompleteNoticeLet.innerText = totalAddedQuantity
    return
  }
  if (totalAddedQuantity === globalLimit) {
    emptyFooter.classList.add('_hide')
    footerInProgress.classList.add('_show')
    footerInCompleteNoticeRight.classList.add('_hide')
    footerInCompleteButton.classList.add('_show')
    footerInCompleteNoticeLet.innerText = totalAddedQuantity
    handleBundlePrice()
    return
  }
    emptyFooter.classList.remove('_hide')
    footerInProgress.classList.remove('_show')
    footerInCompleteNoticeRight.classList.remove('_hide')
    footerInCompleteButton.classList.remove('_show')
}
function handleBundlePrice() {
  var cards = document.querySelectorAll('.bundler__product__quantity[quantity-items]')
  var sumOfTotalActualPrice = 0
  cards.forEach(function(card){
    var quantity = parseInt(card.getAttribute('quantity-items'))
    if (quantity === 0) return
    var actualPrice = parseInt(card.closest('product-card').dataset.actualPrice, 10)
    var totalActualPrice = (quantity * actualPrice)
    sumOfTotalActualPrice = totalActualPrice + sumOfTotalActualPrice
  })
  var btn = document.querySelector('.multi-column__item a.heading._active')
  var item = btn.closest('.multi-column__item')
  var currentDiscount = parseInt(item.dataset.maxDiscount, 10)
  var percentage = (1 - (currentDiscount / 100))
  var discountedPrice = (percentage * sumOfTotalActualPrice)
  var discountedPriceWithCurrency = window.themeVariables.Currency.formatMoney(discountedPrice, window.themeVariables.settings.moneyFormat)
  var sumOfTotalActualPriceWithCurrency = window.themeVariables.Currency.formatMoney(sumOfTotalActualPrice, window.themeVariables.settings.moneyFormat)
  var priceNode = document.querySelector('.bundle-price__sale')
  var fullPriceNode = document.querySelector('.bundle-price__regular')
  priceNode.innerHTML = discountedPriceWithCurrency
  fullPriceNode.innerHTML = sumOfTotalActualPriceWithCurrency
}
async function handleBuildBundleDataForAddBundleToCart(e) {
  e.preventDefault()
  var cards = document.querySelectorAll('.bundler__product__quantity[quantity-items]')
  var btn = document.querySelector('.multi-column__item a.heading._active')
  var items = []
  cards.forEach(function(card){
    var quantity = parseInt(card.getAttribute('quantity-items'), 10)
    if (quantity === 0) return
    var id = parseInt(card.dataset.variantId, 10)
    items.push({
      id,
      quantity,
      properties: {
        'Bundle Size': btn.innerText
      }
    })
  })
  var formData = JSON.stringify({
    items: [...items]
  })
  var res = await fetch(window.Shopify.routes.root + 'cart/add.js?sections=sections--21760198181182__cart-drawer, variant-added', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: formData
  })
  if (res.ok) {
    const cartContent = await (await fetch(`${window.Shopify.routes.root}cart.js`)).json()
    const responseJson = await res.json()
    cartContent["sections"] = responseJson["sections"];
    e.target.dispatchEvent(new CustomEvent("variant:add", {
      bubbles: true,
      detail: {
        items: responseJson.hasOwnProperty("items") ? responseJson["items"] : [responseJson],
        cart: cartContent
      }
    }));
    document.documentElement.dispatchEvent(new CustomEvent("cart:change", {
      bubbles: true,
      detail: {
        baseEvent: "variant:add",
        cart: cartContent
      }
    }));
    return
  }
  var data = await res.json()
  alert(data.message)
}
function handleAddBundleToCart() {
  var addToCart = document.querySelector('#add-bundle-cart')
  if (addToCart === null) return
  var form = document.querySelector('#add-bundle-cart-form')
  form.addEventListener('submit', (e) => handleBuildBundleDataForAddBundleToCart(e))
}
function handleQuickViewLimit() {
  var globalLimit = parseInt(document.querySelector('.whif-multicolumn-wrapper').dataset.globalLimit, 10)
  var totalAddedQuantity = handleCalculateTotalQuantity()
  if (totalAddedQuantity >= globalLimit) {
    var quickViewAddToBundle = document.querySelector('button[data-action="quick-view-add"]')
    quickViewAddToBundle.setAttribute('disabled', 'disabled')
    return
  }
}
function handleQuickViewAddToBundle(e) {
  e.preventDefault()
  var target = e.target
  var cardId = target.closest('.bundle__quick_view').dataset.cardId
  var cardQuantity = document.querySelector(`div.bundler__product__quantity[data-variant-id="${cardId}"]`)
  var currentCardQuantity = parseInt(cardQuantity.getAttribute('quantity-items'), 10)
  var card = cardQuantity.closest('product-card')
  var actionAdd = card.querySelector('button.bundle-add[data-action="add"]')
  var quantityActions = card.querySelector('.bundler__product__actions')
  actionAdd.style.display = 'none'
  quantityActions.style.display = 'flex'
  cardQuantity.setAttribute('quantity-items', (currentCardQuantity + 1))
  cardQuantity.innerText = (currentCardQuantity + 1)
  handleCloseQuickView()
  var globalLimit = parseInt(document.querySelector('.whif-multicolumn-wrapper').dataset.globalLimit, 10)
  var totalAddedQuantity = handleCalculateTotalQuantity()
  var temporaryAddedQuantity = (totalAddedQuantity + 1)
  if (temporaryAddedQuantity >= globalLimit) {
   handleDisableButtonsIfLimitReached() 
  } else {
    handleEnableButtonsIfLimitNotReached()
  }
  handleBundleAddToFooter()
}
function handleCloseQuickView() {
  var body = document.querySelector('body')
  var quickViewWrapper = document.querySelector('#bundle-quick-view')
  quickViewWrapper.innerHTML = ''
  body.style.overflowY = 'initial'
}
function handleQuickView() {
 var quickViewBtns = document.querySelectorAll('a[data-action="quick-view"]')
 var quickViewWrapper = document.querySelector('#bundle-quick-view')
 var body = document.querySelector('body')
  quickViewBtns.forEach(function(btn) {
    btn.addEventListener('click', async function(e){
      e.preventDefault()
      e.stopPropagation()
      var target = e.target
      var url = target.dataset.handle
      var res = await fetch(url)
      var text = await res.text()
      var section = JSON.parse(text)
      var html = section['bundle-quick-view']
      quickViewWrapper.innerHTML = html
      body.style.overflowY = 'hidden'
      handleQuickViewLimit()
       var quickViewCloseButton = document.querySelector('#bundle-popup-close')
       var quickViewAddToBundle = document.querySelector('button[data-action="quick-view-add"]')
       quickViewCloseButton.addEventListener('click', (e) => handleCloseQuickView(e))
       quickViewAddToBundle.addEventListener('click', (e) => handleQuickViewAddToBundle(e))
    })
  })
}
function handleRemoveGiftProduct() {
  document.documentElement.addEventListener('gift:remove', async function(e){
    e.preventDefault()
    e.stopPropagation()
    var cart = e.detail.cart
    var key = undefined
    cart.items.forEach(function(item){
      var isGiftProduct = typeof item.properties['Gift'] !== 'undefined'
      if (!isGiftProduct) return
      key = item.key
    })
    if (typeof key === 'undefined') return
      let sectionsToBundle = [];
      document.documentElement.dispatchEvent(new CustomEvent("cart:prepare-bundled-sections", { bubbles: true, detail: { sections: sectionsToBundle } }));
    var response = await fetch(`${Shopify.routes.root}cart/change.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: key,
        quantity: 0,
        sections: sectionsToBundle
      })
    })
    var cartContent = await response.json()
    document.documentElement.dispatchEvent(new CustomEvent("cart:change", {
      bubbles: true,
      detail: {
        baseEvent: "line-item:change",
        cart: cartContent
      }
    }));
    clearInterval(window.themeVariables.intervals['giftCardInterval'])
    localStorage.removeItem('giftTimer')
    var timerNode = document.querySelector('#free-gift-timer')
    timerNode.classList.add('_disabled')
    return
  })
}
function handleGiftCardFormSubmit() {
  var form = document.querySelector('#free-gift-product')
  form.addEventListener('submit', async function(e){
    e.preventDefault()
    var target = e.target
    var id = parseInt(target.querySelector('input[type="hidden"][name="id"]').value, 10)
    var formData = {
      items: [
        {
          id,
          quantity: 1,
          properties: {
            'Gift': 'Free Gift Product'
          }
        }
      ]
    }
    var res = await fetch(`${window.Shopify.routes.root}cart/add.js?sections=sections--21760198181182__cart-drawer,variant-added`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
    var cartContent = await (await fetch(`${window.Shopify.routes.root}cart.js`)).json()
    var responseJson = await res.json()
    cartContent["sections"] = responseJson["sections"];
    form.dispatchEvent(new CustomEvent("variant:add", {
      bubbles: true,
      detail: {
        items: responseJson.hasOwnProperty("items") ? responseJson["items"] : [responseJson],
        cart: cartContent
      }
    }));
    document.documentElement.dispatchEvent(new CustomEvent("cart:change", {
      bubbles: true,
      detail: {
        // baseEvent: "variant:add",
        cart: cartContent
      }
    }));
    return
   }
  })
}
function handleCountDownTimer() {
  var countDownDate = new Date();
  var countDownDateFinal = countDownDate.setMinutes(countDownDate.getMinutes() + 5)
  if (localStorage.getItem('giftTimer') === null) {
    localStorage.setItem('giftTimer', countDownDateFinal)
  } else {
    countDownDateFinal = parseInt(localStorage.getItem('giftTimer'), 10)
  }
        var x = setInterval(async function() {
        var now = new Date().getTime();
        var distance = countDownDateFinal - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var timerNode = document.querySelectorAll(".giftTimer__counter")
          timerNode.forEach(function(node){
            var twoDigitMins = minutes.toString().length === 2 ? minutes : `0${minutes}`
            var twoDigitSecs = seconds.toString().length === 2 ? seconds : `0${seconds}`
            node.innerHTML = `${twoDigitMins} Mins : ${twoDigitSecs} Secs`
          })
        if (distance < 0) {
            clearInterval(x);
            localStorage.removeItem('giftTimer')
            var timerNode = document.querySelector('#free-gift-timer')
            timerNode.classList.add('_disabled')
            var cart = await (await fetch(`${window.Shopify.routes.root}cart.js`)).json()
            document.documentElement.dispatchEvent(new CustomEvent("gift:remove", {
              bubbles: true,
              detail: {
                cart: cart
              }
            }));
          return
        }
    }, 1000);
  window.themeVariables.intervals['giftCardInterval'] = x
}
function handleGiftTimer() {
  var timerNode = document.querySelector('#free-gift-timer')
  if (timerNode === null) return
  handleCountDownTimer()
  return
}
function handleAddGiftProductInCart() {
  document.documentElement.addEventListener('cart:change', async function(e){
    var cart = e.detail.cart
    if (e.detail.baseEvent === 'line-item:change') return
    handlePrepareAddGiftProductInCart(cart)
    return
  })
}
function handlePrepareAddGiftProductInCart(cart) {
    var itemCount = 0
    var isGiftAdded = false
    cart.items.forEach(function(item){
      var isGiftProduct = typeof item.properties['Gift'] !== 'undefined'
      if (isGiftProduct){
       isGiftAdded = true 
      }
      if (!isGiftProduct){
        itemCount = itemCount + item.quantity
      }
    })
    if (itemCount < 2) {
      document.documentElement.dispatchEvent(new CustomEvent("gift:remove", {
        bubbles: true,
        detail: {
          cart: cart
        }
      }));
      return
    }
    if (isGiftAdded) return
    var form = document.querySelector('#free-gift-product')
    form.dispatchEvent(new Event('submit', { bubbles: true }))
    try {
      var timerNode = document.querySelector('#free-gift-timer')
      timerNode.classList.remove('_disabled')
      handleGiftTimer()
    } catch {
      setTimeout(function(){
        var timerNode = document.querySelector('#free-gift-timer')
        timerNode.classList.remove('_disabled')
        handleGiftTimer()
      }, 0)
    }
}
async function handleInitailGiftTimer() {
  var cart = await (await fetch(`${window.Shopify.routes.root}cart.js`)).json()
  var isGiftAdded = false
  var itemCount = 0
    cart.items.forEach(function(item){
      var isGiftProduct = typeof item.properties['Gift'] !== 'undefined'
      if (isGiftProduct){
       isGiftAdded = true 
      }
    })
  if (!isGiftAdded) return
  var timerNode = document.querySelector('#free-gift-timer')
  timerNode.classList.remove('_disabled')
  handleGiftTimer()
}
function handleInitialBundleFiltersState() {
  var params = getParams(location.search)
  var isDataExists = typeof params.data !== 'undefined'
  if (!isDataExists) return
  var dataParam = decodeURI(params.data[0])
  if (dataParam === '') return
  window.history.replaceState({}, document.title, location.pathname)
  var data = JSON.parse(dataParam)
  data.forEach(function(data){
    var card = document.querySelector(`.bundler__product__quantity[data-variant-id="${data.variantId}"]`)
    if (card === null) return
    card.setAttribute('quantity-items', data.quantity)
    card.innerText = data.quantity
    var actionContainer = card.closest('.product__actions-container')
    var actionAdd = actionContainer.querySelector('button.add-action[data-action="add"]')
    var actionsQuantity = actionContainer.querySelector('.bundler__product__actions')
    actionAdd.style.display = 'none'
    actionsQuantity.style.display = 'flex'
  })
  var globalLimit = parseInt(document.querySelector('.whif-multicolumn-wrapper').dataset.globalLimit, 10)
  var totalAddedQuantity = handleCalculateTotalQuantity()
  if (totalAddedQuantity >= globalLimit) {
    handleDisableButtonsIfLimitReached()
  } else {
    handleEnableButtonsIfLimitNotReached()
  }
  handleBundleAddToFooter()
}
function handleBundleFilters() {
  var btns = document.querySelectorAll('.menu-collection-links')
  btns.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault()
      e.stopPropagation()
      var target = e.target
      var baseUrl = target.href
      var cards = document.querySelectorAll('.bundler__product__quantity[quantity-items]')
      var urlParams = []
      cards.forEach(function(card){
        var quantity = parseInt(card.getAttribute('quantity-items'), 10)
        var variantId = card.dataset.variantId
        if (quantity === 0) return
        urlParams.push({
          quantity,
          variantId
        })
      })
      var encodedUrlParams = encodeURI(JSON.stringify(urlParams))
      var url = `${baseUrl}?data=${encodedUrlParams}`
      location.assign(url)
    })
  })
  handleInitialBundleFiltersState()
}

/** 
 * 
 * New Function for cart discount Tier
 * 
 */

// function handleCartDiscountTier() {
//   document.documentElement.addEventListener('cart:change', function(e) {
//     var limits = [2, 3, 4, 5, 6]
//     var discounts = [5, 10, 15, 20, 25]
//     var cart = e.detail.cart
//     var quantityInCart = cart.item_count
//     var upperLimit = limits[(limits.length - 1)]
//     var tierNode
//     var tierNodes = document.querySelectorAll('.cart__discount_tiers-item')
//     var tierUnReachableNodes = []
//     var progressTrackNodes = document.querySelector('.cart__discount_tiers-progress--track')
//     var successNode = document.querySelector('.cart__discount_tiers-message--success')
//     var nextNode = document.querySelector('.cart__discount_tiers-message--next')
//     if (quantityInCart >= upperLimit) {
//       tierNode = document.querySelector(`.cart__discount_tiers-item[data-limit="${upperLimit}"]`)
//     } else {
//       tierNode = document.querySelector(`.cart__discount_tiers-item[data-limit="${quantityInCart}"]`)
//     }
//     var track = ((quantityInCart / upperLimit) * 100)
//     if (progressTrackNodes !== null) progressTrackNodes.style.width = `${track}%`
//     if (tierNode === null) {
//       tierNodes.forEach(function (tierNode) {
//         tierNode.classList.remove('_active')
//       })
//       successNode.classList.add('_hide')
//       nextNode.innerHTML = '👉 Add <strong>1</strong> more to unlock <strong>5% OFF + FREE SHIPPING</strong>'
//       return
//     }
//     tierNode.classList.add('_active')
//     tierNodes.forEach(function (tierNode) {
//     var limit = parseInt(tierNode.dataset.limit, 10)
//       if (quantityInCart >= limit) return
//         tierUnReachableNodes.push(tierNode)
//       })
//       tierUnReachableNodes.forEach(function (tierNode) {
//         tierNode.classList.remove('_active')
//       })

//     /** 
//      * Update Messaging
//     **/
//     discounts.forEach(function (discount, index){
//       var nextIndex = (index + 1)
//       var nextDiscount = discounts[nextIndex]
//       var limit = limits[index]
//       var nextLimit = limits[nextIndex]
//       var limitToShow = (nextLimit - limit)
//       if ( quantityInCart >= limit) {
//         successNode.classList.remove('_hide')
//         successNode.innerHTML = `🥳 Congrats you unlocked <strong>${discount}% OFF</strong>`
//         nextNode.innerHTML = `👉 Add <strong>${limitToShow}</strong> more to unlock <strong>${nextDiscount}% OFF + FREE SHIPPING</strong>`
//       }
//       if (quantityInCart >= upperLimit) {
//         nextNode.innerHTML = ''
//       }
//     })
      
//   })
// }

  


(function(){
  // handleCartDiscountTier()
  handleBundleFilters()
  handleAddAndQuantityChange()
  handleLimitSelection()
  initailChangePriceBasedOnDiscount()
  handleAddBundleToCart()
  handleQuickView()
  window.themeVariables['handleFreeGiftForLineChange'] = handlePrepareAddGiftProductInCart
  if (window.themeVariables.settings.enableFreeGift) handleAddGiftProductInCart()
  handleGiftCardFormSubmit()
  handleRemoveGiftProduct()
  handleInitailGiftTimer()
})()