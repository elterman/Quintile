<script>
    import { fade } from 'svelte/transition';
    import { YOU_GAVE_UP } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { calculatePar, dayOfYear, isSolved, onStart, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _stats, ss } from './state.svelte';
    import { post } from './utils';

    const hi = '<span style=\'color: var(--aqua);\'>';
    const gold = '<span style=\'color: var(--gold);\'>';
    const blue = '<span style=\'color: var(--blue);\'>';
    const ul = '<ul style="margin: 15px 0 0 0;">';
    const li = '<li style="margin: 10px 0 0 -20px;">';

    const CONTENT = `
        <span>Rotate ${hi}clusters of three</span> connected tiles until the ${hi}sum of each color group</span> matches the number at the ${hi}center</span>.</span>
        ${ul}
        ${li}Tap a ${gold}yellow</span> tile to rotate the cluster ${gold}clockwise</span>.</li>
        ${li}Tap a ${blue}blue</span> tile to rotate it ${blue}counterclockwise</span>.</li>
        ${li}Solve the puzzle in as few steps as possible. </li>
        </ul>`;

    const reloadGame = (job) => {
        ss.sum = job.sum;
        ss.cells = job.cells;
        ss.turns = job.turns;
        ss.initial = job.initial;
        ss.steps = job.steps;
        ss.replay = job.replay;
        ss.surrender = job.surrender;

        post(() => {
            if (isSolved()) {
                ss.over = true;

                calculatePar();

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
            _sound.sfx = job.sfx;
            _sound.music = job.music;

            ss.day = job.day;

            const doy = dayOfYear();

            if (ss.day === doy) {
                ss.replay = job.replay;
                reloadGame(job);
            } else {
                localStorage.clear();
                ss.day = doy;
                persist(true);
            }
        }
    };

    const onGoToGame = () => {
        if (!_sound.musicPlayed) {
            _sound.playMusic();
        }

        delete ss.intro;
        post(() => (ss.seenGamePage = true));

        if (ss.cells) {
            post(isSolved, 1000);
        } else {
            _sound.play('score2');
            onStart();
        }
    };

    const onPlay = () => {
        loadGame();
        onGoToGame();
    };
</script>

{#if ss.intro}
    <div class="intro" in:fade>
        <div class="title clip-text background-gold-radial">QUINTILE</div>
        <div class="content" tabindex="-1">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html CONTENT}
        </div>
        <div class="buttons">
            <PromptPanel ops={[{ label: ss.cells ? 'back to game' : 'play', onClick: onPlay }]} />
        </div>
    </div>
{/if}

<style>
    .intro {
        z-index: 1;
        place-self: center;
        grid-area: 1/1;
        display: grid;
        gap: 50px;
        justify-items: center;
        font-family: Trajan;
    }

    .title {
        grid-area: 1/1;
        place-self: center;
        filter: drop-shadow(3px 3px 5px black);
        font-size: 64px;
    }

    .content {
        grid-area: 2/1;
        font-size: 22px;
        display: grid;
        align-content: start;
        width: 330px;
        color: var(--bronze);
        filter: drop-shadow(2px 2px 3px black);
    }

    .buttons {
        grid-area: 3/1;
        place-self: center;
        filter: drop-shadow(3px 3px 5px black);
    }
</style>
