<script>
    import { fade } from 'svelte/transition';
    import { BOARD_SIZE, FLOOR, OVERHANG, PGON_SIDE, TDX, TDY } from './const';
    import { makePuzzle } from './shared.svelte';
    import { ss } from './state.svelte';
    import Tile from './Tile.svelte';

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'board-content') {
                return false;
            }

            if (e.propertyName !== 'transform') {
                return;
            }

            if (id === 'board-content' && ss.flip) {
                delete ss.flip;
                makePuzzle();
            }
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
    {#snippet dot(dx, dy)}
        {#if !ss.flip}
            <div class="dot" style="transform: translate({dx * PGON_SIDE}px, calc({dy * PGON_SIDE}px - 50%));" in:fade={{ delay: 500 }}>
            </div>
        {/if}
    {/snippet}
    {@render dot(TDX - OVERHANG, TDY)}
    {@render dot(OVERHANG - TDX, TDY)}
    {@render dot(TDX + 0.5, 2 * TDY + FLOOR)}
    {@render dot(0, 3 * TDY + FLOOR)}
    {@render dot(-(TDX + 0.5), 2 * TDY + FLOOR)}
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
