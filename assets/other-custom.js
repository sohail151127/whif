/* ======================= Home page section slider (As seen in) ===================  */


$(document).ready(function() {

$('.slider-single').slick({
 	slidesToShow: 1,
 	slidesToScroll: 1,
 	arrows: false,
 	fade: false,
 	infinite: true,
    autoplay:true,
    autoplaySpeed: 3000,
    fade:true,
  });

 $('.slider-nav')
 	.on('init', function(event, slick) {
 		$('.slider-nav .slick-slide.slick-current').addClass('is-active');
 	})
 	.slick({
 		slidesToShow: 5,
 		slidesToScroll: 1,
 		dots: false,
 		focusOnSelect: false,
      	arrows: false,
 		infinite: true,
        centerMode: true,
        autoplay:true,
        autoplaySpeed: 2000,
 		responsive: [
          {
 			breakpoint: 991,
 			settings: {
 				slidesToShow: 3,
                // centerMode: true,
                centerPadding: '100px',
 			}
 		}, 
          {
 			breakpoint: 767,
 			settings: {
 				slidesToShow: 2,
                centerPadding: '60px',
			}
 		}, {
 			breakpoint: 420,
 			settings: {
 				slidesToShow: 2,
                centerPadding: '60px',
		}
 		}]
 	});

 $('.slider-single').on('afterChange', function(event, slick, currentSlide) {
 	$('.slider-nav').slick('slickGoTo', currentSlide);
 	var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
 	$('.slider-nav .slick-slide.is-active').removeClass('is-active');
 	$(currrentNavSlideElem).addClass('is-active');
 });

 $('.slider-nav').on('click', '.slick-slide', function(event) {
 	event.preventDefault();
 	var goToSingleSlide = $(this).data('slick-index');

 	$('.slider-single').slick('slickGoTo', goToSingleSlide);
 });

});

  

/* -----------Progress bar ---------------    */
  async function headerProgressBar() {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      // console.log(cart);   
      let cart_items = cart.items;
      var specificItemId = 50459722744126; 
      var itemPrice = null;
      cart.items.forEach(function(item) {
        if (item.id === specificItemId) {
          itemPrice = item.price; 
        }
      });
      let fixed_item_price = (itemPrice / 100).toFixed(2);
      var limits = [100, 150];
      var discounts = [0, 10];
      var cartPrice = cart.items_subtotal_price / 100;
      var cartTotal = cartPrice-fixed_item_price;
      // if (cart.cart_level_discount_applications.length > 0) {
      //   let discountCart = cart.total_price / 100;
      //   cartTotal = discountCart - fixed_item_price;
      // } 
      var upperLimit = limits[(limits.length - 1)];
      var progressTrackNode = document.querySelector('.custom_header__discount_tiers-progress--track');
      var progressTrack = document.querySelector('.custom_header__discount_tiers-progress');
      var successNode = document.querySelector('.custom_header__discount_tiers-message--success');
      var nextNode = document.querySelector('.custom_header-progress-bar-next');
      successNode.classList.add('_hide');
      nextNode.innerHTML = '';
      if(cartTotal > 0){
         progressTrack.classList.remove('_hide');
      }
      if (cartTotal >= limits[3]) {
          track = 100;
       }else{
          var track = ((cartTotal / upperLimit) * 100);
       }
        progressTrackNode.style.width = `${track}%`;

    // Determine and display the appropriate messages
    discounts.forEach(function (discount, index) {
      var limit = limits[index];
      // console.log('limit',limit);
      var nextIndex = (index + 1);
      var nextLimit = limits[nextIndex];
      var nextDiscount = discounts[nextIndex];
      var limitToShow = (nextLimit - cartTotal).toFixed(2);
      if (cartTotal >= limit && cartTotal < nextLimit) {
        successNode.classList.add('_hide');
        nextNode.innerHTML = `👉 Spend another $${limitToShow} to unlock ${nextDiscount}% OFF`;
      } else if (cartTotal >= upperLimit) {
          successNode.classList.remove('_hide');
          successNode.innerHTML = `🎉 Congrats you unlocked <strong>${discounts[discounts.length - 1]}% OFF + FREE SHIPPING</strong>`;
         // nextNode.innerHTML = `👉 Spend another $${limitToShow} to unlock ${nextDiscount}% OFF`;
      }
    });

    // Special case for cartTotal less than the first limit
    if (cartTotal < limits[0]) {
      var nextLimitToShow = (limits[0] - cartTotal).toFixed(2);
      nextNode.innerHTML = `👉 You are $${nextLimitToShow} away from FREE SHIPPING!`;
    }

}

headerProgressBar();

/** 
 * 
 * New Function for cart discount Tier
 * 
 */
  async function fetchCart() {
      const response = await fetch('/cart.js');
      const cart = await response.json();
       console.log(cart);    
       let cart_items = cart.items;
      var specificItemId = 50459722744126; 
      var itemPrice = null;
      cart.items.forEach(function(item) {
        if (item.id === specificItemId) {
          itemPrice = item.price; 
          
        }
      });
       // console.log(itemPrice);
      let fixed_item_price = (itemPrice / 100).toFixed(2);
      // let fixed_item_price = 0;
      var limits = [100, 150];
      var discounts = [0, 10];
      var cartPrice = cart.items_subtotal_price / 100;
      var cartTotal = cartPrice-fixed_item_price;
      
      // var cartTotal = cart.original_total_price / 100;
      // if (cart.cart_level_discount_applications.length > 0) {
      //   // console.log('total');
      //   let discountCart = cart.total_price / 100;
      //   cartTotal = discountCart - fixed_item_price;
      // } 
      var upperLimit = limits[(limits.length - 1)];
      var tierNode;
      var tierNodes = document.querySelectorAll('.cart__discount_tiers-item');
      var progressTrackNode = document.querySelector('.cart__discount_tiers-progress--track');
      var successNode = document.querySelector('.cart__discount_tiers-message--success');
      var nextNode = document.querySelector('.cart__discount_tiers-message--next');

      // Add references to the tick elements inside the rectangular boxes
      var freeShippingTick = document.querySelector('.reward-box:nth-child(1) .reward-tick');
      var freeGiftTick = document.querySelector('.reward-box:nth-child(2) .reward-tick');

      // Reset tick marks and hide them initially
      freeShippingTick.style.display = 'none';
      freeGiftTick.style.display = 'none';

    // Reset active states and messages
    tierNodes.forEach(function (node) {
      node.classList.remove('_active');
          let shipContainer = node.querySelector('.ship-container');
         let shipCheck = node.querySelector('.check-tick');
         if (shipContainer) {
            shipContainer.style.display = 'block';
        }
        if (shipCheck) {
            shipCheck.style.display = 'none';
        }
    });
    successNode.classList.add('_hide');
    nextNode.innerHTML = '';

    // Find the appropriate tier node based on cart total
    tierNode = Array.from(tierNodes).reverse().find(function(node) {
      var limit = parseFloat(node.dataset.limit);
      return cartTotal >= limit;
    });

    // Calculate the progress track percentage
    var track = ((cartTotal / 200) * 100);
    if(cartTotal <= 100 ){
      track = ((cartTotal / 200) * 100)
    }

    if(cartTotal >= limits[2]){
       track = 100;
    }
    progressTrackNode.style.width = `${track}%`;

    // Determine and display the appropriate messages
    discounts.forEach(function (discount, index) {
      var limit = limits[index];
      // console.log(limit);
      var nextIndex = (index + 1);
      var nextLimit = limits[nextIndex];
      // console.log('next',nextLimit);
      var nextDiscount = discounts[nextIndex];
      var limitToShow = (nextLimit - cartTotal).toFixed(2);

       if (cartTotal >= limit && cartTotal < nextLimit) {
        successNode.classList.add('_hide');
        nextNode.innerHTML = `👉 Spend another $${limitToShow} to unlock ${nextDiscount}% OFF`;
      } else if (cartTotal >= upperLimit) {
          successNode.classList.remove('_hide');
          successNode.innerHTML = `🎉 Congrats you unlocked <strong>${discounts[discounts.length - 1]}% OFF + FREE SHIPPING</strong>`;
         // nextNode.innerHTML = `👉 Spend another $${limitToShow} to unlock ${nextDiscount}% OFF`;
      }
    });

    // Special case for cartTotal less than the first limit
    if (cartTotal < limits[0]) {
      var nextLimitToShow = (limits[0] - cartTotal).toFixed(2);
      nextNode.innerHTML = `👉 You are $${nextLimitToShow} away from FREE SHIPPING!`;
    }

    tierNodes.forEach(function (node) {
      // console.log('node',node);
        var limit = parseFloat(node.dataset.limit);
        if (cartTotal >= limit) {
            node.classList.add('_active');
            // console.log(node);
         let shipContainer = node.querySelector('.ship-container');
         let shipCheck = node.querySelector('.check-tick');
         if (shipContainer) {
            shipContainer.style.display = 'none';
        }
        if (shipCheck) {
            shipCheck.style.display = 'block';
        }

        // Check for Free Shipping Tier
        if (limit === 100 && cartTotal >= 100) {
            freeShippingTick.style.display = 'block'; // Show tick for Free Shipping box
        }

        // Check for Free Gift Tier
        if (limit === 150 && cartTotal >= 150) {
            freeGiftTick.style.display = 'block'; // Show tick for Free Gift box
        }
          
        }
    });
}
fetchCart();


  document.documentElement.addEventListener('variant:add', function(e) {
    fetchCart();
    // progressBar();
    headerProgressBar();
  });
 document.documentElement.addEventListener('cart:change', function(e) {
   fetchCart();
   // progressBar();
   headerProgressBar()
 });

/*----------- tabs -----------  */


$('#tabs-nav li:first-child').addClass('active');
$('.tab-content').hide();
$('.tab-content:first').show();

$('#tabs-nav li').click(function(){
  $('#tabs-nav li').removeClass('active');
  $(this).addClass('active');
  $('.tab-content').hide();
  
  var activeTab = $(this).find('a').attr('href');
  $(activeTab).fadeIn();
  return false;
});





   /* shipping protection js  */

function cartRefresh() {
    document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
        bubbles: true
    }));
 }

async function addCart() {
  let var_id = $('.protection_toggle').attr('data_variant_id');
     let responseAdd = await $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          quantity: 1,
          id: var_id
        },
        dataType: 'json'
      });
      console.log('added', responseAdd);
}

async function changeCart() {
  let variant_id = $('.protection_toggle').attr('data_variant_id');
  try {
    let response = await $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: {
        quantity: 0,
        id: variant_id
      },
      dataType: 'json'
    });
    console.log('removed', response);
    $('.count-bubble').text(response.item_count);
  } catch (error) {
    console.error('Error changing cart', error);
  }
}

async function clearCart() {
 let clearResponse = await $.ajax({
      type: 'POST',
      url: '/cart/clear.js',
      dataType: 'json'
    });
    cartRefresh();
    $('.count-bubble').addClass('opacity-0').css('opacity', '0');
}

async function getCart() {
  let testItem = await fetch('/cart.js');
  let cart = await testItem.json();
  let cart_count = cart.item_count;
  let protectionItemId = '50459722744126';  // Your protection product ID

  // Check if the protection product is already in the cart
  let protectionItem = cart.items.find(item => item.id == protectionItemId);

  if (protectionItem) {
    // If the protection product is in the cart, ensure it has a quantity of 1
    if (protectionItem.quantity > 1) {
      await $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data: {
          quantity: 1,
          id: protectionItemId
        },
        dataType: 'json'
      });
    }
    console.log('Protection product is already in the cart');
  } else {
    // If the protection product is not in the cart, add it
    console.log('Adding protection product to the cart');
    await addCart();
  }

  if (cart_count == 1 && protectionItem) {
    // If only the protection product is in the cart, clear the cart
    await clearCart();
    await headerProgressBar();
  }
}


async function updateCheckout() {
  let cart = await $.ajax({
      type: 'GET',
      url: '/cart.js',
      dataType: 'json'
    });

    let price = (cart.total_price / 100).toFixed(2);
    $('.custom-cart-form .cart-total').text(`$${price} AUD`);
  
}

window.onload = async function() {
  // Ensure the checkbox is checked on page load
  setTimeout(async function() {
    $('.protection_toggle').prop("checked", true);
    if ($('.protection_toggle').is(':checked')) {
      console.log('Protection toggle is checked');
      await getCart();  // Ensure the cart is handled properly
      await updateCheckout();
    } else {
      await changeCart();
    }
  }, 100);
};


 $(document).on('click', '.protection_toggle', async function() {
    if ($(this).is(':checked')) {
      // console.log('Checkbox clicked and checked');
      await getCart();
    } else {
      // console.log('Checkbox clicked and unchecked');
      await changeCart();
    }
    await updateCheckout();
  });


document.documentElement.addEventListener('variant:add',function() {
 getCart();
});


var createCartPromise = () => {
  return new Promise(async (resolve) => {
    resolve(await (await fetch(`${Shopify.routes.root}cart.js`)).json());
  });
};
var fetchCarts = createCartPromise();
document.addEventListener("cart:change", (event) => {
  fetchCarts = event.detail["cart"];
 let totleCartItem = fetchCarts.item_count;
  // console.log('totle',totle);
  // console.log('fetchCarts',fetchCarts);
    let protectionItemId = '50459722744126';
    let checkPro = fetchCarts.items.some(item => item.id == protectionItemId);
     // console.log(checkPro);
    if (checkPro && totleCartItem == 1) {
      clearCart();
      headerProgressBar();
    }
});

/******   multiproduct landing page   *******/   

$(document).ready(function() {

    var cart = {
      itemCount: 0,
      totalPrice: 0.00,
      items: []
    };

    $('.add_button').click(function() {
      let variantId = $(this).data('variant-id');
      let product_title = $(this).data('product-title');
      $('.empty-bar-content').hide();
      $('.sticky-bundles').show();
      cart.itemCount++;
       cart.items.push({
            id: variantId,
            title : product_title
        });
      // console.log('count',cart);
      let totalItems = $('body').find('main');
      let findRecord =  totalItems.find('.custom-sticky-cart');
      let finalRecord = findRecord.find('.sticky-bubdle-record');
       // console.log(finalRecord);
      finalRecord.text(cart.itemCount + ' Item(s) in bundle');
       if (cart.itemCount > 0) {
        $('.empty-bar-content').hide();
      } else {
        $('.empty-bar-content').show();
      }

    });


    $('.bundle_cart').click(function(){
        let itemTitles = cart.items.map(item => item.title).join(', '); 
        let propertyBox = $('.shopify-product-form input[name="properties[product]"]').val(itemTitles);
        // console.log(propertyBox);
   });
 

   $('.collection-tab-content .product-data-blk:nth-child(n + 10)').css('display','none');
   $('.show-more').click(function(){
      $(this).closest('.collection-tab-content').find('.product-data-blk:nth-child(n + 10)').css('display','block');
      $(this).closest('.more_button').find('.show-less').css('display','flex');
      $(this).hide();
   });
   $('.show-less').click(function(){
      $(this).closest('.collection-tab-content').find('.product-data-blk:nth-child(n + 10)').css('display','none');
      $(this).closest('.more_button').find('.show-more').css('display','flex');
      $(this).hide();
   });


   /*******  multiproduct search bar   ******/

  $('#filterSearchInput').on('input', function() {
    let searchValue = $(this).val().toLowerCase();
    // console.log(searchValue);
    let productFound = false;
    let visibleTab = $('.collection-tab-content:visible');
    visibleTab.find('.product-data-blk').each(function() {
      let title = $(this).data('title').toLowerCase();
      // console.log(title);
      if (title.includes(searchValue)){
        $(this).show();
        productFound = true;
      }else {
        $(this).hide();
        $(this).closest('.collection-tab-content').find('span').show();
      }
    });
     if (productFound) {
      visibleTab.find('.found_text').hide();
      visibleTab.find('.more_button').hide(); 
    } else {
      visibleTab.find('.found_text').show();
      visibleTab.find('.more_button').hide();
    }
  
 });


 
  $('#collection-tabs-nav .tabs-items:first-child').addClass('active');
  $('.collection-tab-content').hide();
  $('.collection-tab-content:first').show();
  
  $('#collection-tabs-nav .tabs-items').click(function(e){
    e.preventDefault();
    $('#collection-tabs-nav .tabs-items').removeClass('active');
    $(this).addClass('active');
    $('.collection-tab-content').hide();
    var activeTab = $(this).find('a').attr('href');
    $(activeTab).fadeIn();
    let input = $('#filterSearchInput').val();
    if( input != "" ){
    $('#filterSearchInput').trigger("input");
  } 
    // return false;
  
  });

 

});

/****** end of multiproduct landing page  ******/


/* review section*/

$(document).on('click','.product-info .loox-rating',function(){
  $('html,body').animate({scrollTop: $("#shopify-section-template--22618180911422__16940820063986346d").offset().top - 100 }, 'slow');
});



// =====================================================================
// When a user clicks on the 'ADD' button, the product options will appear, 
// and clicking the 'ADD' button again will close them. 
// I've also added a new feature where clicking outside the 'ADD' button will now close the options as well.
// ======================================================================

$(document).ready(function(){
  // Toggle the options when clicking on the Add button
  $(document).on('click','.custom-add',function(e){
     e.stopPropagation(); // Prevent event bubbling
     let parentEle = $(this).closest('form');
     parentEle.find('.variant_container').toggleClass('variant-box');
  });

  // Select variant when clicking on it
  $(document).on('click','.variant-data',function(){
    $('.variant-data').removeClass('active');
     let variant_id = $(this).data('variant-id');
     let input_box = $(this).closest('form');
     let findVariant = $(this).closest('.variant_container');
     let input_id = input_box.find('input[name="id"]').val(variant_id);
     $(this).addClass('active');
     $(this).addClass('loader-active');
     let form = $(this).closest('form');
     let button = form.find('.whif-product-button button[type="submit"]');
     let button_loader = $(this).find('.loader');
     button.trigger('click');
     button_loader.css('opacity', '1');
     setTimeout(function() {
          let cartDrawer = $('html'); 
          button_loader.css('opacity', '0');
          $('.variant-data').removeClass('loader-active');
          findVariant.removeClass('variant-box');
       }, 2300);
  });

  // Close the variant options if clicking outside the form
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.custom-add, .variant_container').length) {
      $('.variant_container').removeClass('variant-box');
    }
  });
});














$(function(){
  var anncmntBar = $('aside.shopify-section--announcement-bar').height();
  var mainHeader = $('header.header-parent').height();
  var headerHeight = anncmntBar + mainHeader;
  $(window).scroll(function() {    
      var scroll = $(window).scrollTop();
      if (scroll > headerHeight + 10) {
         $(".shopify-section-group-header-group.item-bar").addClass("headerSticky");
      }else{
          $(".shopify-section-group-header-group.item-bar").removeClass("headerSticky");
      }
  });
});
let customPrice = $('.variant-picker__option-values .input-label-design input[type="radio"]').data('price');
$('.custom-product-buttons form buy-buttons button .button__price').text(` - ${customPrice}`);
$('.variant-picker__option-values .input-label-design input[type="radio"]').change(function(){
 let price = $(this).data('price');
  let buttonFind = $(this).closest('.product-info').find('.custom-product-buttons form buy-buttons button .button__price').text(` - ${price}`);
  console.log(buttonFind);
})




/*-------------------  Count Down --------------*/
if(document.getElementById("demo")){
 const current_time = document.getElementById("demo").getAttribute("data-time-count");
  let countDownDate = new Date(current_time).getTime();
  function padZero(num) {
    return num < 10 ? '0' + num : num;
  }
  // Update the count down every 1 second
  let x = setInterval(function() {
  
    // Get today's date and time
    let now = new Date().getTime();
  
    // Find the distance between now and the count down date
    let distance = countDownDate - now;
  
    // Time calculations for days, hours, minutes, and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    // Pad the numbers with leading zeros if necessary
    hours = padZero(hours);
    minutes = padZero(minutes);
    seconds = padZero(seconds);
  
    // Output the result in an element with id="demo"
    if (days > 0) {
      document.getElementById("demo").innerHTML = days + "d, " + hours + ": " + minutes + ": " + seconds;
    } else {
      document.getElementById("demo").innerHTML = hours + ": " + minutes + ": " + seconds;
    }
  
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("demo").innerHTML = "EXPIRED";
    }
  }, 1000);
}

