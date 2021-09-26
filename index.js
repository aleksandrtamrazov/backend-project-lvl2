import { readFileSync } from 'fs';
import uniq from 'lodash.uniq';
import sortby from 'lodash.sortby';

const genDiff = (path1, path2) => {
  const data1 = JSON.parse(readFileSync(path1, { encoding: 'utf-8' }));
  const data2 = JSON.parse(readFileSync(path2, { encoding: 'utf-8' }));
  const keys = sortby(uniq([...Object.keys(data1), ...Object.keys(data2)]));

  const result = {};

  keys.forEach((key) => {
    switch (true) {
      case key in data1 && key in data2:
        if (data1[key] === data2[key]) {
          result[`  ${key}`] = data1[key];
        } else {
          result[`- ${key}`] = data1[key];
          result[`+ ${key}`] = data2[key];
        }
        break;
      case key in data1:
        result[`- ${key}`] = data1[key];
        break;
      case key in data2:
        result[`+ ${key}`] = data2[key];
        break;
      default:
        throw new Error(`Unknown key - ${key}`);
    }
  });

  return JSON.stringify(result, null, 2);
};

export default genDiff;
