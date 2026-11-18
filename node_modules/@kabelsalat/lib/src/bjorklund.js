// lodashless adaptation of https://github.com/zya/bjorklund/blob/master/bjorklund.js

function zip(a, b) {
  let longer = a.length > b.length ? a : b;
  return longer.map((_, i) => [a[i], b[i]]);
}

function compact(a) {
  return a.filter(Boolean);
}

function bjorklund(pulses, length) {
  const ones = Array.from({ length: pulses >= length ? length : pulses }).fill(
    "1"
  );
  const zeros = Array.from({
    length: pulses >= length ? 0 : length - pulses,
  }).fill("0");
  console.log(ones, zeros);

  return generate_one_based(ones, zeros);
}

function generate_one_based(ones, zeros) {
  if (ones.length === 0) {
    return zeros.join().replace(/,/g, "");
  }
  if (zeros.length > 0) {
    let zipped = zip(ones, zeros).map((item) =>
      compact(item).join().replace(/,/g, "")
    );

    let partitioned = [[], []];
    zipped.forEach((item) => partitioned[item.length > 1 ? 0 : 1].push(item));
    return generate_one_based(partitioned[0], partitioned[1]);
  } else {
    return ones.reverse().join().replace(/,/g, "");
  }
}

console.log(bjorklund(3, 8));
