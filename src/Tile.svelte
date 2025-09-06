<script>
    import { BLOCKS, PENT_SIDE_LENGTH, SPOTS, TDX } from './const';
    import { decode } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';

    const { tile } = $props();
    const spot = $derived(SPOTS[tile.sid]);
    const center = $derived(tile.sid === 1);
    const width = PENT_SIDE_LENGTH * TDX;
    const to = $derived(tile.rotate ? `${spot.x}% ${spot.y}%` : '0 0');
    const deg = $derived(tile.rotate ? spot[tile.rotate] : 0);
    const transform = $derived(`translate(${PENT_SIDE_LENGTH * spot.dx}px, ${PENT_SIDE_LENGTH * spot.dy}px) rotate(${deg}deg)`);
    const disabled = $derived(tile.rotate || spot.cix < 2 || ss.twist || ss.over || ss.cheer || ss.surrender || ss.flip);
    let _this = $state();
    let duration = $derived(tile.rotate ? '0.5s' : 0);

    $effect(() => {
        const onTransitionEnd = () => {
            if (!tile.rotate) {
                return;
            }

            const block = BLOCKS.find((b) => b.includes(tile.sid));
            let i = block.indexOf(tile.sid) + (tile.rotate === 'cw' ? 1 : -1);

            if (i < 0) {
                i = 2;
            } else if (i > 2) {
                i = 0;
            }

            const tob = ss.tiles.find(t => t.id === tile.id);
            delete tob.rotate;
            tob.sid = block[i];
        };

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });

    const onPointerDown = () => {
        _prompt.opacity = 0;

        if (spot.cix < 2) {
            return;
        }

        _sound.play('click');
        ss.steps += 1;

        const cw = spot.cix === 2;
        const block = BLOCKS.find((b) => b.includes(tile.sid));
        const tobs = block.map((sid) => ss.tiles.find((t) => t.sid === sid));

        for (let i = 0; i < 3; i++) {
            tobs[i].rotate = cw ? 'cw' : 'ccw';
        }
    };

    const pclass = $derived(
        `pentagon ${spot.flip ? 'flip' : ''} color-${spot.cix} ${disabled ? 'disabled' : ''} ${ss.over ? 'pulse' : ''}`,
    );
</script>

<div
    id={`tile-${tile.sid}`}
    bind:this={_this}
    class="tile no-highlight"
    style="transform: {transform}; transform-origin: {to}; transition: transform {duration} linear;">
    <div class={pclass} style="width: {width}px;" onpointerdown={onPointerDown}></div>
    {#if ss.tiles}
        {@const num = decode(tile.ch)}
        {@const plus = num > 0 && !center ? '+' : ''}
        {@const transform = `translateY(${spot.flip ? -10 : center ? 23 : 15}%) rotate(${-deg}deg);`}
        <!-- {@const duration = !ss.seenGamePage ? '0s' : ss.surrender ? '1s' : ss.flip ? '0s' : '0.5s'} -->
        {@const _class = `char ${center ? 'gold' : ''} ${plus || num === 0 || center ? '' : 'negative'} ${ss.surrender ? 'surrender' : ''}`}
        <div class={_class} style="transform: {transform}; transition: transform {duration} linear;">
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
        cursor: pointer;
        transition: background-image 0.3s linear;
    }

    .pentagon:hover {
        filter: contrast(1.1) brightness(1.1);
    }

    .flip {
        rotate: 180deg;
    }

    .disabled {
        pointer-events: none;
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
        font-family: Trajan;
        font-size: 32px;
    }

    .gold {
        color: var(--gold);
    }
</style>
