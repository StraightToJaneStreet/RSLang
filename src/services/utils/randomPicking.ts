export function shuffle<T>(target: T[]): void {
  for (let i = 0; i < target.length; i++) {
    const randomPosition = Math.floor(Math.random() * target.length);
    [target[i], target[randomPosition]] = [target[randomPosition], target[i]];
  }
}

export function pickWords<T>(sourceWords: T[], count: number): T[] {
  if (count > sourceWords.length) {
    throw Error('Insufficient amount of source items');
  }

  const indicies = Array(sourceWords.length)
    .fill(0)
    .map((_, ind) => ind);
  shuffle(indicies);

  const result: T[] = [];

  for (let i = 0; i < count; i++) {
    result.push(sourceWords[indicies[i]]);
  }

  return result;
}

export function pickWordsWithValidation<T>(sourceWords: T[], count: number, isValid: (word: T) => boolean): T[] {
  const indicies = Array(sourceWords.length)
    .fill(0)
    .map((_, ind) => ind);
  shuffle(indicies);

  let position = 0;
  let pickedCount = 0;

  const result: T[] = [];

  while (pickedCount < count && position < indicies.length) {
    const pickedItem = sourceWords[indicies[position]];
    if (isValid(pickedItem)) {
      result.push(pickedItem);
      pickedCount++;
    }

    position++;
  }

  if (pickedCount !== count) {
    throw Error('Insufficient amount of source items');
  }

  return result;
}
