<script>
    import Title from '$lib/images/Title.webp';
    import { fade } from 'svelte/transition';
    import { GAME_PAGE, YOU_GAVE_UP } from './const';
    import { cleanupDemo } from './Demo/demo shared.svelte';
    import Help from './Help.svelte';
    import PromptPanel from './Prompt Panel.svelte';
    import { calculatePar, dayOfYear, isSolved, onStart, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _stats, ss } from './state.svelte';
    import { focusOnApp, post, windowSize } from './utils';

    let content = $state(null);
    let scale = $state(1);

    $effect(() => {
        post(() => {
            const { y: wy } = windowSize();
            const pageHi = content.getBoundingClientRect().height + 70;

            if (pageHi > wy) {
                scale = wy / pageHi;
            }
        });

        focusOnApp();
    });

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

        cleanupDemo();

        ss.page = GAME_PAGE;
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

<div class="start-page" in:fade={{ duration: 100 }} out:fade={{ duration: 200 }}>
    <div class="content" bind:this={content} style="transform: scale({scale})">
        <img class="title" src={Title} alt="" />
        <Help />
        <PromptPanel ops={[{ label: ss.cells ? 'back to game' : 'play', onClick: onPlay }]} />
    </div>
</div>

<style>
    .start-page {
        grid-area: 1/1;
        height: 100dvh;
        display: grid;
        place-content: center;
        z-index: 100;
    }

    .content {
        display: grid;
        gap: 50px;
    }

    .title {
        grid-area: 1/1;
        place-self: center;
        width: calc(min(80%, 300px));
        filter: drop-shadow(3px 3px 5px black);
    }
</style>
