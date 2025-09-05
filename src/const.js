export const APP_STATE = 'Quintile V1';
export const GAME_PAGE = 'GAME PAGE';
export const X = '✖';
export const CHEER_YOU_DID_IT = 'you did it!';
export const CHEER_GREAT = 'great!';
export const CHEER_EXCELLENT = 'excellent!';
export const CHEER_PERFECT = 'perfect!';
export const CHEER_PHENOMENAL = 'phenomenal!';
export const PROMPT_NO = 'no';
export const PROMPT_PLAY_AGAIN = 'play again?';
export const PROMPT_RESET_STATS = 'reset stats?';
export const PROMPT_SURRENDER = 'give up?';
export const YOU_GAVE_UP = 'you gave up.';
export const YOU_GAVE_UP_STATS_RESET = 'you gave up. stats reset.';
export const SURRENDER_DURATION = '1s';
export const CYPHER = 'IHGFEDCBA0123456789]';
export const ZERO_AT = 9;

export const BLOCKS = [
    { positions: [1, 2, 5], x: 1, y: 0 },
    { positions: [3, 7, 6], x: 2.5, y: 0 },
    { positions: [11, 12, 16], x: 3, y: 1.5 },
    { positions: [15, 19, 18], x: 2, y: 2.25 },
    { positions: [13, 14, 17], x: 0.5, y: 2.25 },
    { positions: [4, 9, 8], x: 0, y: 0.75 }
];

export const ROWS = [
    [1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19]
];

export const TILE_SIDE_DX = 50;
export const TDX = 1.618;
export const TDY = 1.5388;
export const ROOF = 0.5878;
const FLOOR = TDY - ROOF;
const OVERHANG = 0.309;
const TRAD = 0.6882;
export const TCY = TDY - TRAD;
export const BOARD_SIZE = TILE_SIDE_DX * (TDY * 5 - ROOF * 2);

export const SPOTS = [
    { id: 1, dx: 0, dy: 0, adj: [2, 3, 4, 5, 6], cix: 0 },
    { id: 2, flip: true, dx: TDX * 0.5, dy: -FLOOR, adj: [1, 8, 9], cix: 1 },
    { id: 3, flip: true, dx: TDX - OVERHANG, dy: ROOF, adj: [1, 4, 10], cix: 1 },
    { id: 4, flip: true, dx: 0, dy: TDY, adj: [1, 12, 13], cix: 1 },
    { id: 5, flip: true, dx: - (1 + OVERHANG), dy: ROOF, adj: [1, 14, 15], cix: 1 },
    { id: 6, flip: true, dx: -TDX * 0.5, dy: -FLOOR, adj: [1, 7, 16], cix: 1 },
    { id: 7, dx: -TDX * 0.5, dy: -(FLOOR + TDY), adj: [6, 18, 19], cix: 2 },
    { id: 8, dx: TDX * 0.5, dy: -(FLOOR + TDY), adj: [2, 19, 20], cix: 3 },
    { id: 9, dx: TDX + 0.5, dy: -TDY, adj: [2, 21, 22], cix: 2 },
    { id: 10, dx: TDX + 1, dy: 0, adj: [3, 22, 23], cix: 3 },
    { id: 11, dx: TDX + 0.5, dy: TDY, adj: [3, 24, 25], cix: 2 },
    { id: 12, dx: TDX * 0.5, dy: FLOOR + TDY, adj: [4, 25, 26], cix: 3 },
    { id: 13, dx: -TDX * 0.5, dy: FLOOR + TDY, adj: [4, 27, 28], cix: 2 },
    { id: 14, dx: -(OVERHANG + 1 + TDX * 0.5), dy: TDY, adj: [5, 28, 29], cix: 3 },
    { id: 15, dx: -(TDX + 1), dy: 0, adj: [5, 30, 31], cix: 2 },
    { id: 16, dx: -(OVERHANG + 1 + TDX * 0.5), dy: -TDY, adj: [6, 17, 31], cix: 3 },
];