function updateCart(itemId) {
  $.ajax({
    url: `/cart/${itemId}`,
    type: 'POST',
    success: async function(items) {
      $('#my-cart').html(`<i class="tf-ion-android-cart"></i>Giỏ hàng (${items.length})`);
      const divDropdown = $('#cart-items-main');
      divDropdown.empty();
      items.map((item) => {
        const divMedia = $("<div>", {"class": "media"});
        const aPullLeft = $("<a>", {"class": "pull-left"});
        const imgItem = $("<img>", {"class": "media-object", "src": `${item.img}`});
        const divMediaBody = $("<div>", {"class": "media-body"});
        const h4MediaHeading = $("<h4>", {"class": "media-heading"});
        const aNameItem = $("<a>", {"href": "#"});
        aNameItem.text(`${item.name}`);
        const divPrice = $("<div>", {"class": "cart-price"});
        const spanPrice = $("<span>");
        spanPrice.text(`${item.quantity} x ${item.price}`);
        const aRemove = $("<a>", {"class": "remove", "href": "#"});
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
      })
    }
  });
}
