<script>
    import { TDX, TILE_SIDE_DX } from './const';

    const { spot, flip } = $props();
    const side = TILE_SIDE_DX;
    const width = side * TDX;
    const transform = $derived(`translate(${side * spot.dx}px, ${side * spot.dy}px)`);
</script>

<div id={`spot-${spot.id}`} class="spot" style="transform: {transform};">
    <div class="pentagon {flip ? 'flip' : ''}" style="width: {width}px;"></div>
</div>

<style>
    .spot {
        grid-area: 1/1;
        place-self: center;
        display: grid;
        box-sizing: border-box;
        /* border: 1px solid tan; */
    }

    .pentagon {
        place-self: center;
        aspect-ratio: 1.05;
        clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        transform: scale(0.97, 0.98);
        background: #ffffff48;
    }

    .flip {
        /* clip-path: polygon(50% 100%, 100% 62%, 82% 0%, 18% 0%, 0% 62%); */
        rotate: 180deg;
    }
</style>
