function updateCart(items) {
  $('#my-cart').html(`<i class="tf-ion-android-cart"></i>Giỏ hàng (${items.length})`);
  const divDropdown = $('#cart-items-main');
  divDropdown.empty();
  let totalPrice = 0;
  items.map((item) => {
    const divMedia = $("<div>", {"class": "media", "id": `${item.id}`});
    const aPullLeft = $("<a>", {"class": "pull-left"});
    const imgItem = $("<img>", {"class": "media-object", "src": `${item.img}`});
    const divMediaBody = $("<div>", {"class": "media-body"});
    const h4MediaHeading = $("<h4>", {"class": "media-heading"});
    const aNameItem = $("<a>", {"href": "#"});
    aNameItem.text(`${item.name}`);
    const divPrice = $("<div>", {"class": "cart-price"});
    const spanPrice = $("<span>");
    spanPrice.text(`${item.quantity} x ${item.price}`);
    const aRemove = $("<a>", {"class": "remove", "href": "#", "onclick": `deleteItem('${item.id}')`});
    const iClose = $("<i>", {"class": "tf-ion-close"});

    divDropdown.append(divMedia);
    divMedia.append(aPullLeft);
    divMedia.append(divMediaBody);
    divMedia.append(aRemove);
    aRemove.append(iClose);
    aPullLeft.append(imgItem);
    divMediaBody.append(h4MediaHeading);
    divMediaBody.append(divPrice);
    h4MediaHeading.append(aNameItem);
    divPrice.append(spanPrice);

    totalPrice = totalPrice + parseInt(item.price) * parseInt(item.quantity);
  })
  const divCartSummary = $("<div>", {"class": "cart-summary"});
  const spanTotalText = $("<span>");
  spanTotalText.text("Tổng cộng");
  const spanTotalPrice = $("<span>", {"class": "total-price"});
  spanTotalPrice.text(`${totalPrice} đồng`);
  const ulCartButton = $("<ul>", {"class": "text-center cart-buttons"});
  const liDetail = $("<li>");
  const liBuy = $("<li>");
  const aDetail = $("<a>", {"class": "btn btn-small", "href": "/checkout/cart"});
  aDetail.text("Chi tiết");
  const aBuy = $("<a>", {"class": "btn btn-small btn-solid-border", "href": "/checkout/payment"});
  aBuy.text("Mua hàng");

  divDropdown.append(divCartSummary);
  divDropdown.append(ulCartButton);
  divCartSummary.append(spanTotalText);
  divCartSummary.append(spanTotalPrice);
  ulCartButton.append(liDetail);
  ulCartButton.append(liBuy);
  liDetail.append(aDetail);
  liBuy.append(aBuy);
}

function addCart(itemId) {
  $.ajax({
    url: `/cart/${itemId}`,
    type: 'POST',
    success: async function(items) {
      updateCart(items);
    }
  });
}


function deleteItem(itemId) {
  $.ajax({
    url: `/cart/${itemId}`,
    type: 'DELETE',
    success: function(items) {
      updateCart(items);
    }
  })
}
