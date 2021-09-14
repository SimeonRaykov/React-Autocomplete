export default function uniqueArrayOfObjects (array, keyToBeUnique){
    return array.filter((x, xi) => !array.slice(xi + 1)
      .some(y => y[keyToBeUnique] === x[keyToBeUnique]));
  }
  