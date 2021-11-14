export function* fibonacci() {
  let values = [0, 1];

  while (true) {
    let [current, next] = values;

    yield current;

    values = [next, current + next];
  }
}
