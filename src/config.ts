const TYPES = {
  CSHARPD: 'csharpd',
  D: 'd',
};

const SETTINGS = {};

SETTINGS[TYPES.D] = {
  name: 'D',
  layout: [
    [
      { 'push': -8, 'pull': -3, 'key': 'z' },
      { 'push': -5, 'pull': -1, 'key': 'x' },
      { 'push': 0, 'pull': 2, 'key': 'c' },
      { 'push': 4, 'pull': 5, 'key': 'v' },
      { 'push': 7, 'pull': 9, 'key': 'b' },
      { 'push': 12, 'pull': 11, 'key': 'n' },
      { 'push': 16, 'pull': 14, 'key': 'm' },
      { 'push': 19, 'pull': 17, 'key': ',' },
      { 'push': 24, 'pull': 21, 'key': '.' },
    ]
  ],
  baseFrequency: 440
};

SETTINGS[TYPES.CSHARPD] = {
  name: 'C#D',
  layout: [
    [
      { 'push': -8, 'pull': -3, 'key': 'a' },
      { 'push': -5, 'pull': -1, 'key': 's' },
      { 'push': 0, 'pull': 2, 'key': 'd' },
      { 'push': 4, 'pull': 5, 'key': 'f' },
      { 'push': 7, 'pull': 9, 'key': 'g' },
      { 'push': 12, 'pull': 11, 'key': 'h' },
      { 'push': 16, 'pull': 14, 'key': 'j' },
      { 'push': 19, 'pull': 17, 'key': 'k' },
      { 'push': 24, 'pull': 21, 'key': 'l' },
    ],
    [  // C#列(下)
      { 'push': -6, 'pull': -2, 'key': 'z' },
      { 'push': -1, 'pull': 1, 'key': 'x' },
      { 'push': 3, 'pull': 4, 'key': 'c' },
      { 'push': 6, 'pull': 8, 'key': 'v' },
      { 'push': 11, 'pull': 10, 'key': 'b' },
      { 'push': 15, 'pull': 13, 'key': 'n' },
      { 'push': 18, 'pull': 16, 'key': 'm' },
      { 'push': 23, 'pull': 20, 'key': ',' },
      { 'push': 27, 'pull': 22, 'key': '.' },
    ],
  ],
  baseFrequency: 440
};

const TONES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export { TYPES, SETTINGS, TONES }
