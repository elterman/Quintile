<script>
    import { BOARD_SIZE, FLOOR, OVERHANG, PENT_SIDE_LENGTH, TDX, TDY } from './const';
    import { isSolved, makePuzzle, onOver, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import Tile from './Tile.svelte';

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
        {#each ss.tiles as tile (tile.id)}
            <Tile {tile} />
        {/each}
    </div>
    <div class="dot" style="transform: translate({(TDX - OVERHANG) * PENT_SIDE_LENGTH}px, calc({TDY * PENT_SIDE_LENGTH}px - 50%));"></div>
    <!-- <div class="dot" style="transform: translate({-(TDX - OVERHANG) * PENT_SIDE_LENGTH}px, calc({TDY * PENT_SIDE_LENGTH}px - 50%));"></div> -->
    <!-- <div class="dot" style="transform: translate({(TDX + 0.5) * PENT_SIDE_LENGTH}px, calc({(2 * TDY + FLOOR) * PENT_SIDE_LENGTH}px - 50%));"></div> -->
    <div class="dot" style="transform: translate(0, calc({(3 * TDY + FLOOR) * PENT_SIDE_LENGTH}px - 50%));"></div>
    <div class="dot" style="transform: translate(-{(TDX + 0.5) * PENT_SIDE_LENGTH}px, calc({(2 * TDY + FLOOR) * PENT_SIDE_LENGTH}px - 50%));"></div>
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

    .dot {
        grid-area: 1/1;
        place-self: start center;
        display: grid;
        width: 12px;
        aspect-ratio: 1;
        border-radius: 50%;
        background-size: cover;
        background: linear-gradient(135deg, pink, brown);
    }
</style>
