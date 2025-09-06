<script>
    import { fade } from 'svelte/transition';
    import { BLOCKS, PENT_SIDE_LENGTH, SPOTS, TDX } from './const';
    import { decode } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';

    const { tile } = $props();
    const spot = $derived(SPOTS.find((spot) => spot.id === tile.sid));
    const center = $derived(spot.id === 1);
    const width = PENT_SIDE_LENGTH * TDX;
    const transform = $derived(`translate(${PENT_SIDE_LENGTH * spot.dx}px, ${PENT_SIDE_LENGTH * spot.dy}px)`);
    const disabled = $derived.by(() => spot.cix < 2 || ss.twist || ss.over || ss.cheer || ss.surrender || ss.flip);

    const onPointerDown = () => {
        _prompt.opacity = 0;

        if (spot.cix < 2) {
            return;
        }

        _sound.play('click');
        ss.steps += 1;

        const cw = spot.cix === 2;

        const block = [...BLOCKS.find((b) => b.includes(spot.id))];
        const tobs = block.map((sid) => ss.tiles.find((t) => t.sid === sid));

        block.unshift(block[2]);
        block.push(block[1]);

        for (let i = 0; i < 3; i++) {
            const tob = tobs[i];
            const j = cw ? i + 2 : i;
            tob.sid = block[j];
        }
    };

    const pclass = $derived(
        `pentagon ${spot.flip ? 'flip' : ''} ${center && ss.over ? 'over' : ''} color-${spot.cix} ${disabled ? 'disabled' : ''} ${ss.over ? 'pulse' : ''}`,
    );
</script>

<div id={`tile-${spot.id}`} class="tile no-highlight" style="transform: {transform};">
    <div class={pclass} style="width: {width}px;" onpointerdown={onPointerDown}></div>
    {#if ss.tiles}
        {@const num = decode(tile.ch)}
        {@const plus = num > 0 && !center ? '+' : ''}
        {@const transform = `translateY(${spot.flip ? -10 : center ? 12 : 15}%);`}
        <!-- {@const duration = !ss.seenGamePage ? '0s' : ss.surrender ? '1s' : ss.flip ? '0s' : '0.5s'} -->
        {@const duration = '0s'}
        {@const _class = `char ${center ? (ss.over ? 'center' : 'gold') : ''} ${plus || num === 0 || center ? '' : 'negative'} ${ss.surrender ? 'surrender' : ''}`}
        <div class={_class} style="transform: {transform}; transition-duration: {duration};" transition:fade>
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
        transition: transform 1s;
    }

    .pentagon {
        grid-area: 1/1;
        place-self: center;
        aspect-ratio: 1.0515;
        clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        transform: scale(0.97, 0.98);
        /* background: #ffffff48; */
        display: grid;
        cursor: pointer;
        transition: background-image 1s, rotate 1s;
    }

    .pentagon:hover {
        filter: contrast(1.15) brightness(1.15);
    }

    .flip {
        /* clip-path: polygon(50% 100%, 100% 62%, 82% 0%, 18% 0%, 0% 62%); */
        rotate: 180deg;
    }

    .disabled {
        pointer-events: none;
    }

    .over {
        background-image: url('$lib/images/Aqua Radial.webp');
        background-size: cover;
    }

    .pulse {
        animation: pulse 0.2s alternate 6 ease-in-out;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.85);
        }
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

    .center,
    .gold {
        font-size: 32px;
    }

    .gold {
        color: var(--gold);
    }
</style>
