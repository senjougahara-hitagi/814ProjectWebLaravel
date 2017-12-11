$("#Glide").glide({
    type: 'carousel',
    paddings: '20%',
    startAt: 1,
    touchDistance: 2

});
// show comments
function show_comments(productId) {
    console.log(productId);
    $.ajax({
        dataType: 'json',
        type:'GET',
        url: 'comment/get',
        data: {
            productId: productId
        }
    }).done(function (response) {
        $("#test").html(response['html'])
    });

}
// show details
function show_details(obj) {
    var itemModalTemplate = Handlebars.compile($("#item-modal-template").html());
    $("#item_modal_body").html(itemModalTemplate(obj));
    $("#item_modal").modal("show");
    show_comments(obj['ProductID']);
    $(".input_qty").on('keyup keydown change', function(events) {
        $('#' + obj['ProductID']).attr("data-Quantity", $(this).val());
    });

    $(".add_to_card_details").on('click', function (e) {
        e.stopPropagation();
        $(this).attr('data-Quantity',$('.input_qty').val());
        addToCart(this);
    });
}

// search_ajax + animate
$('#search_text').autocomplete({
    source: "/search/autocomplete",
    minLength:1,
    select: function(event, ui) {
        $('#search_text').val(ui.item.value);
        var data = ui["item"]["Product"];
        // $("#item_modal_body").html(itemModalTemplate(data));
        // $("#item_modal").modal("show");
        show_details(data);
    }
});

$("#adv-search").hide();
$("#btn-search").click(function (event) {
    $(this).toggleClass("active");
    $("#adv-search").toggle("slide", {direction: "right" },250);
});



// art to cart
$(".add_to_card").on('click', function (e) {
    e.stopPropagation();
    addToCart(this);
});

function addToCart(clicked) {
    var currentcart = [];
    var item;
    currentcart = JSON.parse(sessionStorage.getItem('cart'));
    if(currentcart === null) currentcart = [];
    item = {
        "id":$(clicked).attr('data-ProductID'),
        "name":$(clicked).attr('data-ProductName'),
        "price":$(clicked).attr('data-ProductPrice'),
        "image":$(clicked).attr('data-ProductImage'),
        "quantity": parseInt($(clicked).attr('data-Quantity')),
    };
    checkExist(currentcart,item);
    sessionStorage.setItem('cart',JSON.stringify(currentcart));
    console.log(currentcart);
    showcart();
}
function checkExist(Array, item) {
    var i = Array.length;
    while (i--) {
        if(Array[i]['id'] === item['id']) {
            Array[i]['quantity'] = Array[i]['quantity'] + item['quantity'];
            return;
        }
    }
    Array.push(item);
}

function showcart() {
    var total_price = 0;
    var total = 0;
    currentcart = JSON.parse(sessionStorage.getItem('cart'));
    var cart = $(".cart");
    var cartPage = $(".body_table");
    if(currentcart !==null && currentcart.length>0 ){
        cart.html("");
        cartPage.html("");
        $.each(currentcart,function (index,value) {
            total_price += value['price'] * value['quantity'];
            total += value['quantity'];
            var url = "img/products/" + value['image'];
            cart.append(
                "<div class='card' " +"data-stt='"+index+"'>"+
                  '<div class="thumbnail-img"' + 'style="background-image: url('+ url + ')"></div>' +
                  '<div class="info" >' +
                    "<p class='name'>"+value['name'] +"</p> "+
                    '<p class="price">' + value['price'] + '</p>' +
                    '<p class="quantity">' + value['quantity'] + '</p>' +
                  '</div>' +
                  "<div><i class='delete-btn fa fa-times-circle'>"+"</i></div>" +
                "</div>"
            );

            cartPage.append(
              '<tr class="card" data-stt="' + index + '">' +
                '<td>' +
                  '<img src=' + url + '>' +
                '</td>' +
                '<td>' +
                  "<h3 class='name'>" + value['name'] + "</h3>"+
                '</td>' +
                '<td>' +
                  '<span class="price">' + value['price'] + '</span>' +
                '</td>' +
                '<td>' +
                  '<input class="input_qty" name="qty" autofocus="autofocus" autocomplete="off" min="1" max="9999" value=' + value['quantity'] + ' type="number">' +
                '</td>' +
                '<td>' +
                  '<i class="delete-btn fa fa-times-circle">' + "</i>" +
                '</td>' +
              '</tr>'
            );
        });

        $(".price_text").text(total_price + " $");
        $(".total_cart").text(total + ' sản phẩm');

        cart.append("<div class=\"pay\"><a href='/cart'>" +
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="-2 -2 110 110"><defs><style>.cls-1{isolation:isolate;}.cls-2{fill:#353434;}.cls-3,.cls-6{fill:none;stroke-miterlimit:10;stroke-width:2px;}.cls-3{stroke:#343434;}.cls-4{mask:url(#mask);}.cls-5{opacity:0.75;mix-blend-mode:screen;}.cls-6{stroke:#fff;}.cls-7{filter:url(#luminosity-invert);}</style><filter id="luminosity-invert" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feColorMatrix values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0"/></filter><mask id="mask" x="-2" y="-2.95" width="112" height="113" maskUnits="userSpaceOnUse"><g class="cls-7"><g transform="translate(-57.67 -34.95)"><image width="112" height="113" transform="translate(55.67 32)" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABxCAIAAACC3rC5AAAACXBIWXMAAAsSAAALEgHS3X78AAAEsUlEQVR4Xu2d24KrIAxFA8z//7EwD6lpiggBI62a9XDOXLSjyx3AO4BhGA/CtSaYjffeOelSpZRijK2ppiJd9PMgg865lJLcJqyz4NcppV/w27H0ivAYeu9RCv0rl8I3Bqx+Bz5HkalCvffeezhtzblfCm9KaVmW1qxqTBKKKnFt0aCWxD38CjUFZ/9F5HSh6JEKfHJespqYoPVEoaTyF7qLaQtzitBpS98LL5eT0qoslErs11RyuFb1Jii0JujAex9CwGAuy5LWEeKvgRvbOcf7ydZMUtSEUjZPKiV1UCKPamsOEQolTxV0FZUZulE4mtAQApX58aX5ClT+mIyDUT0kVHfbfhHF8h8vebR5dZUZFNLhlRpM6PE//JtQ+cNoTkeE3tUmwst/wGm30HvbRI7ktE8otpv3tokM57RD6C17oQpjOfWtCV5470MIAPAQmwiubAgBtUqQTufWIzStCe8GrrJcqKjkn1bsHCx8+YC/LfTJNhH0KGxM20m+/SBJQowxyU5xN4R6jeMF94B3+hVqJW/FzhEWfs23FXuGpPB3hVqxF2kW/u4vLJ5FmiEtC7V4VqiHtPxTi2eFekgLQi2eTVJKOATa/qosFB652y4HQyoS6nsuIH44xZa0IBQEe6zG3lGoQmiT9uU+twSrfvvzD6HWenYRY9xW/cc3jz2KPEZx/JQLtdazl5pQs9nL1thbqI3nB9juhr6/sgZ0gG0z2j4FYtTJatraUAXKCbU9ThVeQq1HGibrl17/2QHQYbJ+6S10fxajTS7U0MKEKmNClTGhyphQZUyoMiZUGROqjAlVxoTqQIdBTKgyL6F2nOkI3N5bqOQCcmNLduTzZbB5HamxR3Yu7h1Jq3oVCleOGL0U2lBjmN0rR6xfGmB7Lu6tz/qlAbbn4vI8mtAutrpyoX590IDRpPhggsKVIxZSIa50E/0f/2ZZFuecCZUTY8wuny/06c45q/om0vuUrOqF7N0u81HysFY9GAK29Q7Fki/e3GBwKrfLFNrKtD4Hxg6X7FERWo6h7YZWqF/6WVZmu6EVtrubnN0MppRsr2lL88rkXaF0B7M5JbzgAYC1VhJns8InJPfC1tJH3T3YCRJW7ONCwYZQDIxn88b39sDIhlAg6IuIdoeT1keUCT/xfuBxkBij5C4ZUe7i+qDXB/b4tNYSmyAUCmvhdz089wZ49v6d1rQvpImjw3rOOeG2ugGUzWZfREiFwmfvJN9i14W6DblN6BIKnzm9t9OujojTJxSekVPhGL5It1C4e04xm2M2AY69/ieEkKa8LHMO2KEDwJE1GkkoQrWPXeHVo0rjzeFsIuNCgQ1Or34AhcabXSOkIoeEApN4XafYaELneHOP8TY0g9rygyUzE3/C+x7VhAJbPgDoHQ9PhlKpnoCjJc/BhXPrG11/dlDF99DV35CrKRShUeoPasVgnjra0yz5DC5Ut6wGmLYwJwpFsob11JXZ4tdHSk9QiZwuFCGt1AKcVHEI9TnIHJXIJKEEriqajTHqrip9Mh/AaX24kNlCEZ6grNeSK6Y9tCLpS+O27wjl8EaWk0pjAz6Z/7zsQL4lTuX7QrfwnqQ+5bdiaBiX5R+twM3tH2ReFwAAAABJRU5ErkJggg=="/></g></g></mask></defs><title>pay2</title><g class="cls-1"><g id="Layer_1" data-name="Layer 1"><path class="cls-2" d="M139.07,69.3h-4.3L125.87,54a2,2,0,0,0-1.3-.9,2.32,2.32,0,0,0-1.6.3l-10.2,7-5.5-6.7a1.75,1.75,0,0,0-1.4-.7,2,2,0,0,0-1.5.6L88.87,69.3h-4.6a7.81,7.81,0,0,0-7.8,7.8v40a7.81,7.81,0,0,0,7.8,7.8h54.8a7.81,7.81,0,0,0,7.8-7.8v-40A7.81,7.81,0,0,0,139.07,69.3Zm3.8,35.6h-12.7a7.8,7.8,0,1,1,0-15.6h12.7Zm-19.4-47,6.7,11.4H120l-4.7-5.7Zm-17.8.1,9.2,11.3H94.47Zm33.4,63H84.27a3.8,3.8,0,0,1-3.8-3.8v-40a3.8,3.8,0,0,1,3.8-3.8h54.8a3.8,3.8,0,0,1,3.8,3.8v8.2h-12.7a11.75,11.75,0,1,0,0,23.5h12.7v8.2A3.82,3.82,0,0,1,139.07,121Z" transform="translate(-57.67 -34.95)"/><circle class="cls-2" cx="72.8" cy="62.15" r="2.9"/><circle class="cls-3" cx="54" cy="54" r="53"/><g class="cls-4"><g class="cls-5"><circle class="cls-6" cx="54" cy="54" r="53"/></g></g></g></g></svg>'+
            '</a></div>');
        $(".card .delete-btn").click(function () {
            var attr = $(this).parent().parent().attr('data-stt');
            console.log(attr);
            currentcart.splice(attr,1);
            $("[data-stt='" + attr + "']").remove();
            sessionStorage.setItem('cart',JSON.stringify(currentcart));
            if(currentcart.length<1){
                cart.html("");
                cart.append("<p id='nothing'>Nothing has been chosen<p/>");
            }
        });
    }
}
showcart();
$(".order-box .fa").click(function (event) {
    $(".cart").slideToggle();
});

// introduce effect

// Quotes about learning from goodreads -- http://www.goodreads.com/quotes/tag/learning


// smooth scroll
$(document).ready(function() {
    'use strict';
    // Select all links with hashes
    $('a[href*="#"]')
    // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        }
                        ;
                    });
                }
            }
        });
});


// Add animation/ Initialize Woo
$(document).ready(function() {

    'use strict';

    new WOW().init();

});
