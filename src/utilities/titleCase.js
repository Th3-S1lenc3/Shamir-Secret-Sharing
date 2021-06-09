import capitaliseFirst from './capitaliseFirst';

export default function titleCase(str) {
  return str.split(' ').map((str) => { return capitaliseFirst(str) }).join(' ');
}
