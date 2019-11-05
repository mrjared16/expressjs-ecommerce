
let factory = (hasBage, id, name, price) => ({
    hasBage,
    id,
    name,
    price
  });

exports.array = [
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