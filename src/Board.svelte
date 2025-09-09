<script>
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

            if (id === 'board-content' && ss.swirl) {
                delete ss.swirl;
                makePuzzle();
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div id="board" class="board {ss.surrender ? 'surrender' : ''}" style="width: {BOARD_SIZE}px;">
    <div id="board-content" class="content {ss.swirl ? 'swirl' : ''}">
        {#each ss.tiles as tile (tile.id)}
            <Tile {tile} />
        {/each}
    </div>
    {#snippet dot(ix, dx, dy)}
        {@const _class = `dot-inner ${ss.intro || ss.over || ss.swirl ? '' : 'visible'} ${ss.rotoBlocks?.includes(ix) ? 'rotatable' : ''} ${ss.shake === ix ? 'shake' : ''}`}
        <div class="dot" style="transform: translate({dx * PGON_SIDE}px, calc({dy * PGON_SIDE}px - 50%));">
            <div class={_class}></div>
        </div>
    {/snippet}
    {@render dot(1, TDX - OVERHANG, TDY)}
    {@render dot(2, TDX + 0.5, 2 * TDY + FLOOR)}
    {@render dot(3, 0, 3 * TDY + FLOOR)}
    {@render dot(4, -(TDX + 0.5), 2 * TDY + FLOOR)}
    {@render dot(5, OVERHANG - TDX, TDY)}
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

    .swirl {
        transform: rotateZ(360deg) scale(0);
    }

    .surrender {
        transition-delay: 0.5s;
    }

    .dot {
        grid-area: 1/1;
        place-self: start center;
        display: grid;
        border-radius: 50%;
    }

    .dot-inner {
        display: grid;
        box-sizing: border-box;
        border: 2px solid #00000080;
        border-radius: 50%;
        width: 18px;
        aspect-ratio: 1;
        background: radial-gradient(circle at 30% 30%, #b0b0b0 10%, #404040 25%, #303030 100%);
        transition: opacity 0.1s ease-out;
        transition-delay: 0.6s;
        opacity: 0;
    }

    .visible {
        opacity: 1;
    }

    .rotatable {
        background: radial-gradient(circle at 30% 30%, pink 10%, orangered 25%, #ff4500 100%);
    }

    .shake {
        animation: shake 0.1s 2 linear;
    }

    @keyframes shake {
        from {
            scale: 1;
        }
        33% {
            scale: 1.5;
        }
        66% {
            scale: 1.5;
        }
        to {
            scale: 1;
        }
    }
</style>
