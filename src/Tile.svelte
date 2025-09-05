<script>
    import { fade } from 'svelte/transition';
    import { SPOTS, TDX, TILE_SIDE_DX } from './const';
    import { decode } from './shared.svelte';
    import { ss } from './state.svelte';

    const { tile } = $props();
    const spot = $derived(SPOTS.find((spot) => spot.id === tile.sid));
    const side = TILE_SIDE_DX;
    const width = side * TDX;
    const transform = $derived(`translate(${side * spot.dx}px, ${side * spot.dy}px)`);
    const duration = $derived(!ss.seenGamePage ? '0s' : ss.surrender ? '1s' : ss.flip ? '0s' : '0.5s');
    const num = $derived(decode(tile.ch));
    const plus = $derived(num > 0 ? '+' : '');
</script>

<div id={`tile-${spot.id}`} class="tile no-highlight" style="transform: {transform};">
    <div class="pentagon {spot.flip ? 'flip' : ''} color-{spot.cix}" style="width: {width}px;"></div>
    {#if ss.tiles}
        {@const chTransform = `translateY(${spot.flip ? -10 : 15}%);`}
        <div
            class="char {plus || num === 0 ? '' : 'negative'} {ss.surrender ? 'surrender' : ''}"
            style="transform: {chTransform}; transition-duration: {duration};"
            transition:fade>
            {plus + num}
        </div>
    {/if}
</div>

<style>
    .tile {
        grid-area: 1/1;
        place-self: center;
        display: grid;
        place-content: center;
        place-items: center;
        box-sizing: border-box;
        /* border: 1px solid tan; */
    }

    .pentagon {
        grid-area: 1/1;
        place-self: center;
        aspect-ratio: 1.0515;
        clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        transform: scale(0.97, 0.98);
        /* background: #ffffff48; */
        display: grid;
    }

    .flip {
        /* clip-path: polygon(50% 100%, 100% 62%, 82% 0%, 18% 0%, 0% 62%); */
        rotate: 180deg;
    }

    .char {
        z-index: 1;
        grid-area: 1/1;
        /* place-self: start center; */
        font-family: Poppins;
        font-size: 22px;
        font-weight: bold;
        pointer-events: none;
        transition: transform 0.5s linear;
        color: black;
    }

    .negative {
        color: #8a0000;
    }

    .surrender {
        transition-delay: 0.5s;
    }
</style>
