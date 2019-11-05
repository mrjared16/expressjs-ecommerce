
let factory = (hasBage, id, name, price) => ({
  hasBage,
  id,
  name,
  price
});

let factory_detail = (active_img, img, product_name, product_description, product_price) => ({
    active_img,
    img,
    product_name,
    product_description,
    product_price
  }
);

const detail = factory_detail(1, [2,3,4,5,6,7], 'Đầm họa tiết ngôi sao',
`<p>Hàng order quảng châu, chất vải voan </p>
<p>Có thể mặc 2 kiểu : bó eo và suông </p>`, 300000);

const array = [
  factory(true, 1, 'abc', '1000000'),
  factory(false, 2, 'abc', '1000000'),
  factory(true, 3, 'abc', '1000000'),
  factory(true, 4, 'abc', '1000000'),
  factory(true, 5, 'abc', '1000000'),
  factory(false, 6, 'abc', '1000000'),
  factory(true, 7, 'abc', '1000000'),
  factory(false, 8, 'abc', '1000000'),
  factory(true, 9, 'abc', '1000000'),
];

const relate = [
  factory(true, 1, 'abc', '1000000'),
  factory(false, 2, 'abc', '1000000'),
  factory(true, 3, 'abc', '1000000'),
]

module.exports = (query) => {
  if (query === 'list') 
    return array;
  if (query === 'relate')
    return relate;
  if (query === 'detail')
    return detail;
}