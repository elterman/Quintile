import { cloneDeep, random, sample } from 'lodash-es';
import { BLOCKS, CHEER_EXCELLENT, CHEER_GREAT, CHEER_PERFECT, CHEER_PHENOMENAL, CHEER_YOU_DID_IT, CYPHER, GROUPS, PROMPT_PLAY_AGAIN, ZERO_AT } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { findBlock, post, range } from './utils';

let over = $state(false);

export const initPoss = () => {
    for (let i = 0; i < ss.tiles.length; i++) {
        ss.tiles[i].id = i + 1;
    }
};

export const decode = ch => CYPHER.indexOf(ch) - ZERO_AT;

const groupSum = (group) => group.reduce((sum, n) => sum + n, 0);

const word2group = (word) => word.split('').map(decode);

export const onOver = () => {
    if (over) {
        return;
    }

    over = true;

    calculatePar();

    const doOver = (prompt) => {
        ss.over = true;

        post(() => {
            delete ss.flip;
            _sound.play('won');

            post(() => {
                _prompt.set(prompt);

                if (prompt !== PROMPT_PLAY_AGAIN) {
                    post(() => {
                        _prompt.set(null);
                        post(() => _prompt.set(PROMPT_PLAY_AGAIN));
                    }, 2000);
                }
            }, 1000);
        }, 300);
    };

    if (ss.surrender) {
        _sound.play('cluck');
        post(() => ss.cheer = ss.surrender);
    } else {
        const score = ss.score();

        const cheer = () => {
            if (score < 0) {
                ss.cheer = CHEER_PHENOMENAL;
            } else if (score === 0) {
                ss.cheer = CHEER_PERFECT;
            } else if (score === 1) {
                ss.cheer = CHEER_EXCELLENT;
            } else if (score === 2) {
                ss.cheer = CHEER_GREAT;
            } else {
                ss.cheer = CHEER_YOU_DID_IT;
            }

            post(() => delete ss.cheer, 3000);
        };

        if (!ss.replay) {
            _stats.plays += 1;
            _stats.total_score += score;
        }

        if (!ss.replay && (_stats.best === null || score < _stats.best)) {
            _stats.best = score;
        }

        post(cheer);
    }

    delete ss.replay;

    post(() => doOver(PROMPT_PLAY_AGAIN), 500);
};

const randomPuzzle = () => {
    ss.sum = sample(range(10)) - 1;

    const makeGroup = () => {
        let group;

        do {
            group = [];

            for (let i = 0; i < 4; i++) {
                group.push(random(-9, 9));
            }

            group.push(ss.sum - groupSum(group));
        } while (group[4] < -9 || group[4] > 9);

        return group;
    };

    const makeTiles = () => {
        const gr1 = makeGroup();
        const gr2 = makeGroup();
        const gr3 = makeGroup();

        const words = [];

        for (let group of [gr1, gr2, gr3]) {
            group = group.map(n => CYPHER[n + ZERO_AT]);
            words.push(group.join(''));
        }

        const tiles = [{ id: 1, sid: 1, ch: ss.sum + '' }];

        const chars = ((words[0] + words[1] + words[2]).split(''));

        for (let id = 2, i = 0; id <= 6; id++, i++) {
            tiles.push({ id, sid: id, ch: chars[i] });
        }

        for (let id = 7, i = 0; id <= 15; id += 2, i++) {
            tiles.push({ id, sid: id, ch: chars[5 + i] });
        }

        for (let id = 8, i = 0; id <= 16; id += 2, i++) {
            tiles.push({ id, sid: id, ch: chars[10 + i] });
        }

        ss.tiles = tiles;
    };

    makeTiles();

    do {
        for (let i = 0; i < 5; i++) {
            const block = BLOCKS[i];
            const count = random(0, 2);

            for (const id of block) {
                const tile = ss.tiles.find(t => t.id === id);

                for (let j = 0; j < count; j++) {
                    rotateTile(tile, true);
                }
            }
        }
    } while ([1, 2, 3].some(i => sumAt(i) === ss.sum));

    // do {
    //     ss.turns = [random(0, 5), random(0, 2), random(0, 2), random(0, 2), random(0, 2), random(0, 2), random(0, 2)];

    //     initPoss();

    //     for (let i = 0; i < 7; i++) {
    //         for (let j = 0; j < ss.turns[i]; j++) {
    //             if (i) {
    //                 onRotateBlock(i, true);
    //             } else {
    //                 onRotateGrid(true);
    //             }
    //         }
    //     }
    // } while ([1, 2, 3, 4, 5].some(i => sumAt(i) === ss.sum));
};

// export const onRotateBlock = (bi, cw,) => {
//     const cis = BLOCKS[bi - 1].positions;
//     const poss = cis.map(i => ss.cells[i - 1].pos);

//     for (let i = 0; i < 3; i++) {
//         let pos = poss[i];

//         if (cw) {
//             pos = i < 2 ? poss[i + 1] : poss[0];
//         } else {
//             pos = i > 0 ? poss[i - 1] : poss[2];
//         }

//         const j = cis[i];
//         ss.cells[j - 1].pos = pos;
//     }
// };

// export const onRotateGrid = (cw) => {
//     const newPos = (pos) => {
//         switch (pos) {
//             case 1: return cw ? 3 : 8;
//             case 2: return cw ? 7 : 4;
//             case 3: return cw ? 12 : 1;
//             case 4: return cw ? 2 : 13;
//             case 5: return cw ? 6 : 9;
//             case 6: return cw ? 11 : 5;
//             case 7: return cw ? 16 : 2;
//             case 8: return cw ? 1 : 17;
//             case 9: return cw ? 5 : 14;
//             case 11: return cw ? 15 : 6;
//             case 12: return cw ? 19 : 3;
//             case 13: return cw ? 4 : 18;
//             case 14: return cw ? 9 : 15;
//             case 15: return cw ? 14 : 11;
//             case 16: return cw ? 18 : 7;
//             case 17: return cw ? 8 : 19;
//             case 18: return cw ? 13 : 16;
//             case 19: return cw ? 17 : 12;
//             default: return pos;
//         }
//     };

//     for (let i = 0; i < 19; i++) {
//         ss.cells[i].pos = newPos(ss.cells[i].pos);
//     }
// };

export const rotateTile = (tile, cw) => {
    const block = findBlock(tile.sid);
    let i = block.indexOf(tile.sid) + (cw ? 1 : -1);

    if (i < 0) {
        i = 2;
    } else if (i > 2) {
        i = 0;
    }

    const tob = ss.tiles.find(t => t.id === tile.id);
    delete tob.rotate;
    tob.sid = block[i];
};

export const makePuzzle = () => {
    const initial = () => ({ sum: ss.sum, tiles: cloneDeep(ss.tiles), turns: cloneDeep(ss.turns) });

    if (ss.replay) {
        const { sum, tiles, turns } = ss.initial;
        ss.sum = sum;
        ss.tiles = cloneDeep(tiles);
        ss.turns = cloneDeep(turns);
    } else {
        randomPuzzle();
        ss.initial = initial();
    }

    calculatePar();
    persist();
};

export const onStart = (replay = false) => {
    _sound.play('dice');
    over = false;

    if (ss.tiles) {
        ss.flip = true;

        if (replay) {
            ss.replay = true;
        }
    } else {
        makePuzzle();
    }

    ss.steps = 0;

    delete ss.over;
    delete ss.cheer;
    delete ss.surrender;

    persist();
};

export const onResetStats = () => {
    if (_stats.plays === 0) {
        return;
    }

    _stats.plays = 0;
    _stats.total_score = 0;
    _stats.best = null;
    persist();

    _stats.reset = true;
    post(() => delete _stats.reset, 1500);
};

export const persist = (statsOnly = false) => {
    const json = statsOnly ? { ..._stats } : {
        ..._stats, sum: ss.sum, cells: ss.cells, turns: ss.turns, center: ss.center, steps: ss.steps, replay: ss.replay, initial: ss.initial,
        surrender: ss.surrender, sfx: _sound.sfx, music: _sound.music,
    };

    localStorage.setItem(ss.appKey(), JSON.stringify(json));
};

export const log = (value) => console.log($state.snapshot(value));

export const isSolved = () => {
    if (!ss.cells) {
        return false;
    }

    return [1, 2, 3, 4, 5].every(i => sumAt(i) === ss.sum);
};

export const sumAt = i => {
    const word = wordAt(GROUPS[i - 1]);
    const group = word2group(word);

    return groupSum(group);
};

export const calculatePar = () => {
    // const turns = calcSolutionTurns(ss.initial.turns);
    // const par = turns.reduce((sum, turns) => sum + Math.abs(turns), 0) + 1;
    // ss.par = Math.min(par, 7);

    ss.par = 0;
};

const calcGridTurns = (gridTurns) => {
    let turns = gridTurns % 6;

    if (turns > 0) {
        if (turns < 4) {
            turns = -turns;
        } else {
            turns = 6 - turns;
        }
    } else if (turns < 0) {
        if (turns > -4) {
            turns = -turns;
        } else {
            turns = -6 - turns;
        }
    }

    return turns;
};

const calcBlockTurns = (blockTurns) => {
    let turns = blockTurns % 3;

    if (turns === -2 || turns === 1) {
        turns = -1;
    } else if (turns === -1 || turns === 2) {
        turns = 1;
    }

    return turns;
};

export const calcSolutionTurns = (turns) => {
    const solTurns = [];

    solTurns.push(calcGridTurns(turns[0]));

    for (let i = 0; i < 6; i++) {
        solTurns.push(calcBlockTurns(turns[i + 1]));
    }

    return solTurns;
};

const charAt = (id) => {
    const tile = ss.tiles?.find(tile => tile.sid === id);
    return tile?.ch || 0;
};

const wordAt = (ids) => ids.reduce((word, id) => word + charAt(id), '');
