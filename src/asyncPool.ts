async function asyncPool<IN, OUT>(poolLimit: number, array: IN[], iteratorFn: (i: IN, all: IN[]) => Promise<OUT>): Promise<OUT[]> {
  const ret = [];
  const executing = [];

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(ret);
}

export default asyncPool;
