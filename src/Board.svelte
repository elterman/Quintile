<script>
    import { BOARD_SIZE, SPOTS } from './const';
    import { isSolved, makePuzzle, onOver, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import Spot from './Spot.svelte';
    import { ss } from './state.svelte';

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'board' && id !== 'board-content') {
                return false;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (id === 'board-content' && ss.flip) {
                delete ss.flip;
                makePuzzle();
            } else if (id === 'board' && (ss.twist === 'cw' || ss.twist === 'acw')) {
                _sound.play('cluck');
                delete ss.twist;
            }

            if (isSolved()) {
                _sound.play('won', { rate: 4 });
                onOver();
            }

            persist();
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div id="board" class="board {ss.surrender ? 'surrender' : ''}" style="width: {BOARD_SIZE}px;">
    <div id="board-content" class="content {ss.flip ? 'flipped' : ''}">
        {#each [1, 2, 3] as i (i)}
            {#each SPOTS[i - 1] as spot (spot.id)}
                <Spot {spot} flip={i % 2 == 0} />
            {/each}
        {/each}
    </div>
</div>

<style>
    .board {
        grid-area: 3/1;
        display: grid;
        justify-self: center;
        transition: linear transform 0.5s;
        aspect-ratio: 1/1;
        /* background: #ffffff40; */
    }

    .content {
        grid-area: 1/1;
        display: grid;
        transition: linear transform 0.7s;
    }

    .flipped {
        transform: rotateZ(360deg) scale(0);
    }

    .surrender {
        transition-delay: 0.5s;
    }
</style>
