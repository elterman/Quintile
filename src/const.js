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
export const YOU_GAVE_UP_STATS_RESET = 'you gave up.•stats reset.';
export const SURRENDER_DURATION = '1s';
export const CYPHER = 'IHGFEDCBA0123456789]';
export const ZERO_AT = 9;
export const PGON_SIDE = 50;
export const TDX = 1.618;
export const TDY = 1.5388;
export const ROOF = 0.5878;
export const FLOOR = 0.951; // TDY - ROOF
export const OVERHANG = 0.309;
export const BOARD_SIZE = PGON_SIDE * (TDY * 5 - ROOF * 2);
export const BLOCKS = [[2, 8, 9], [3, 10, 11], [4, 12, 13], [5, 14, 15], [6, 16, 7]];
export const GROUPS = [[2, 3, 4, 5, 6], [7, 9, 11, 13, 15], [8, 10, 12, 14, 16]];

export const SPOTS = {
    1: { dx: 0, dy: 0, cix: 0 },
    2: { flip: true, dx: TDX * 0.5, dy: -FLOOR, cix: 1, x: 80.9, y: 0, cw: 108, ccw: -108 },
    3: { flip: true, dx: TDX - OVERHANG, dy: ROOF, cix: 1, x: 100, y: 61.8, cw: 108, ccw: -108 },
    4: { flip: true, dx: 0, dy: TDY, cix: 1, x: 50, y: 100, cw: 108, ccw: -108 },
    5: { flip: true, dx: - (1 + OVERHANG), dy: ROOF, cix: 1, x: 0, y: 61.8, cw: 108, ccw: -108 },
    6: { flip: true, dx: -TDX * 0.5, dy: -FLOOR, cix: 1, x: 19.1, y: 0, cw: 108, ccw: -108 },
    7: { dx: -TDX * 0.5, dy: -(FLOOR + TDY), cix: 2, x: 19.1, y: 100, cw: 108, ccw: -144 },
    8: { dx: TDX * 0.5, dy: -(FLOOR + TDY), cix: 3, x: 80.9, y: 100, cw: 144, ccw: -108 },
    9: { dx: TDX + 0.5, dy: -TDY, cix: 2, x: 0, y: 38.2, cw: 108, ccw: -144 },
    10: { dx: TDX + 1, dy: 0, cix: 3, x: 19.1, y: 100, cw: 144, ccw: -108 },
    11: { dx: TDX + 0.5, dy: TDY, cix: 2, x: 50, y: 0, cw: 108, ccw: -144 },
    12: { dx: TDX * 0.5, dy: FLOOR + TDY, cix: 3, x: 0, y: 38.2, cw: 144, ccw: -108 },
    13: { dx: -TDX * 0.5, dy: FLOOR + TDY, cix: 2, x: 100, y: 38.2, cw: 108, ccw: -144 },
    14: { dx: -(OVERHANG + 1 + TDX * 0.5), dy: TDY, cix: 3, x: 50, y: 0, cw: 144, ccw: -108 },
    15: { dx: -(TDX + 1), dy: 0, cix: 2, x: 80.9, y: 100, cw: 108, ccw: -144 },
    16: { dx: -(OVERHANG + 1 + TDX * 0.5), dy: -TDY, cix: 3, x: 100, y: 38.2, cw: 144, ccw: -108 },
};