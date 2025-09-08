import { cloneDeep, random, sample, sampleSize } from 'lodash-es';
import { APP_STATE, BLOCKS, CHEER_EXCELLENT, CHEER_GREAT, CHEER_PERFECT, CHEER_PHENOMENAL, CHEER_YOU_DID_IT, CYPHER, GROUPS, PROMPT_PLAY_AGAIN, ZERO_AT } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { findBlock, post, range } from './utils';

export const log = (value) => console.log($state.snapshot(value));

export const initPoss = () => {
    for (const tile of ss.tiles) {
        tile.sid = tile.id;
    }
};

export const decode = ch => CYPHER.indexOf(ch) - ZERO_AT;

const groupSum = (group) => group.reduce((sum, n) => sum + n, 0);

const word2group = (word) => word.split('').map(decode);

export const onOver = () => {
    const doOver = (prompt) => {
        ss.over = true;

        post(() => {
            delete ss.swirl;
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

    // make tiles

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

    ss.rotoBlocks = sampleSize([1, 2, 3, 4, 5], ss.mode + 1);

    do {
        initPoss();

        for (const i of ss.rotoBlocks) {
            const block = BLOCKS[i - 1];
            const count = random(0, 2);

            for (const id of block) {
                const tile = ss.tiles.find(t => t.id === id);

                for (let j = 0; j < count; j++) {
                    rotateTile(tile, true);
                }
            }
        }
    } while ([1, 2, 3].some(i => sumAt(i) === ss.sum));
};

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

const calculatePar = () => {
    let par = 0;

    for (const b of BLOCKS) {
        const id = b[0];
        const tile = ss.tiles.find(tile => tile.id === id);

        if (tile.id !== tile.sid) {
            par += 1;
        }
    }

    ss.par = par;
};

export const makePuzzle = () => {
    if (ss.replay) {
        const { sum, tiles, rotoBlocks } = ss.initial;
        ss.sum = sum;
        ss.tiles = cloneDeep(tiles);
        ss.rotoBlocks = cloneDeep(rotoBlocks);
    } else {
        randomPuzzle();
        ss.initial = { sum: ss.sum, tiles: cloneDeep(ss.tiles), rotoBlocks: cloneDeep(ss.rotoBlocks) };
    }

    calculatePar();
    persist();
};

export const onStart = (replay = false) => {
    _sound.play('dice');

    if (ss.tiles) {
        ss.swirl = true;

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

export const persist = () => {
    let json = { ..._sound };
    localStorage.setItem(APP_STATE, JSON.stringify(json));

    json = {
        ..._stats, sum: ss.sum, tiles: ss.tiles, rotoBlocks: ss.rotoBlocks, par: ss.par, steps: ss.steps,
        replay: ss.replay, initial: ss.initial, surrender: ss.surrender,
    };

    localStorage.setItem(ss.appKey(), JSON.stringify(json));
};

export const isSolved = () => {
    if (!ss.tiles) {
        return false;
    }

    return [1, 2, 3].every(i => sumAt(i) === ss.sum);
};

const wordAt = (ids) => {
    const charAt = (id) => {
        const tile = ss.tiles?.find(tile => tile.sid === id);
        return tile?.ch || 0;
    };

    return ids.reduce((word, id) => word + charAt(id), '');
};

export const sumAt = i => {
    const word = wordAt(GROUPS[i - 1]);
    const group = word2group(word);

    return groupSum(group);
};
