<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { APP_STATE, YOU_GAVE_UP } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { hint, isSolved, onOver, onStart } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _stats, ss } from './state.svelte';
    import { post } from './utils';

    const hi = '<span style="color: var(--aqua);">';
    const gold = '<span style="color: var(--gold);">';
    const blue = '<span style="color: var(--blue);">';
    const ul = '<ul style="margin: 15px 0 0 0;">';
    const li = '<li style="margin: 10px 0 0 -20px;">';

    const CONTENT = `
        <span>Rotate ${hi}clusters of three</span> connected tiles until the ${hi}sum of each color group</span> matches the number at the ${hi}center</span>.</span>
        ${ul}
        ${li}Tap a ${gold}yellow</span> tile to rotate the cluster ${gold}clockwise</span>.</li>
        ${li}Tap a ${blue}blue</span> tile to rotate it ${blue}counterclockwise</span>.</li>
        ${li}Solve the puzzle in as few steps as possible.</li>
        </ul>`;

    onMount(() => {
        let json = localStorage.getItem(APP_STATE);
        let job = JSON.parse(json);

        if (job) {
            _sound.sfx = job.sfx;
            _sound.music = job.music;
        }
    });

    const reloadGame = (job) => {
        ss.sum = job.sum;
        ss.tiles = job.tiles;
        ss.rotoBlocks = job.rotoBlocks;
        ss.initial = job.initial;
        ss.par = job.par;
        ss.steps = job.steps;
        ss.replay = job.replay;
        ss.surrender = job.surrender;

        post(() => {
            if (isSolved()) {
                ss.over = true;

                if (_stats.plays === 0) {
                    ss.cheer = ss.surrender = YOU_GAVE_UP;
                }
            }
        });
    };

    const loadGame = () => {
        const json = localStorage.getItem(ss.appKey());
        const job = JSON.parse(json);

        if (job) {
            _stats.plays = job.plays;
            _stats.total_score = job.total_score;
            _stats.best = job.best;

            reloadGame(job);
        }
    };

    const onGoToGame = () => {
        if (!_sound.musicPlayed) {
            _sound.playMusic();
        }

        delete ss.intro;
        post(() => (ss.seenGamePage = true));

        if (ss.tiles) {
            if (isSolved()) {
                onOver();
            } else {
                hint();
            }
        } else {
            _sound.play('score2');
            onStart();
        }
    };

    const onPlay = (mode) => {
        _sound.play('plop');

        if (mode !== ss.mode) {
            delete ss.tiles;
            delete ss.rotoBlocks;
            delete ss.sum;
            delete ss.over;
            delete ss.surrender;
        }

        ss.mode = mode;

        loadGame();
        onGoToGame();
    };
</script>

{#if ss.intro}
    <div class="intro" in:fade>
        <div class="title clip-text background-gold">QUINTILE</div>
        <div class="content" tabindex="-1">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html CONTENT}
        </div>
        <div class="ops">
            <div class="op">
                <PromptPanel ops={[{ label: 'fairly easy', onClick: () => onPlay(1) }]} />
                <span class="sub-op">2 of 5 clusters are rotatable</span>
            </div>
            <div class="op">
                <PromptPanel ops={[{ label: 'not so easy', onClick: () => onPlay(2) }]} />
                <span class="sub-op">3 of 5 clusters are rotatable</span>
            </div>
            <div class="op">
                <PromptPanel ops={[{ label: 'not easy', onClick: () => onPlay(3) }]} />
                <span class="sub-op">4 of 5 clusters are rotatable</span>
            </div>
        </div>
    </div>
{/if}

<style>
    .intro {
        z-index: 1;
        place-self: center;
        grid-area: 1/1;
        display: grid;
        gap: 40px;
        justify-items: center;
        font-family: Trajan;
    }

    .title {
        grid-area: 1/1;
        place-self: center;
        filter: drop-shadow(3px 3px 5px black);
        font-size: 60px;
    }

    .content {
        grid-area: 2/1;
        font-size: 20px;
        display: grid;
        align-content: start;
        width: 330px;
        color: var(--bronze);
        filter: drop-shadow(2px 2px 3px black);
    }

    .ops {
        grid-area: 3/1;
        place-self: center;
        filter: drop-shadow(2px 2px 3px black);
        display: grid;
        gap: 10px;
    }

    .op {
        display: grid;
        place-items: center;
    }

    .sub-op {
        font-family: Poppins;
        font-size: 15px;
        opacity: 0.8;
    }
</style>
