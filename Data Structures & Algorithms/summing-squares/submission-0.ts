const summingSquares = (n: number) => {
  // todo
  const range = Math.floor(Math.sqrt(n));
  const cache = new Map();

  const recurr  = (n : number): number => {
    if(n < 0) return Infinity;
    if(n === 0) return 0;
    if(cache.has(n)) return cache.get(n);

    let result = Infinity;
    for(let i = 1; i <= range; i++) {
        const res = recurr(n - i*i);
        if(res !== Infinity) {
            result = Math.min(result, res + 1);
        }
    }

    cache.set(n, result);
    return result;
  }

  return recurr(n);
};


const ans = summingSquares(1000);
console.log(`shortest factor length is ${ans}`);
