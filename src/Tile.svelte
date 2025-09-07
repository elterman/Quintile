<script>
    import { BLOCKS, PGON_SIDE, SPOTS, TDX } from './const';
    import { decode, isSolved, onOver, persist, rotateTile } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';
    import { findBlock, post } from './utils';

    const { tile } = $props();
    const spot = $derived(SPOTS[tile.sid]);
    const center = $derived(tile.sid === 1);
    const width = PGON_SIDE * TDX;
    const to = $derived(tile.rotate ? `${spot.x}% ${spot.y}%` : '0 0');
    const deg = $derived(tile.rotate ? spot[tile.rotate] : 0);
    const transform = $derived(`translate(${PGON_SIDE * spot.dx}px, ${PGON_SIDE * spot.dy}px) rotate(${deg}deg)`);
    let _this = $state();
    let duration = $derived(tile.rotate ? (ss.surrender ? '1s' : '0.5s') : 0);

    const disabled = $derived.by(() => {
        if (ss.rotating || spot.cix < 2 || ss.over || ss.cheer || ss.surrender || ss.flip) {
            return true;
        }

        for (const i of ss.rotoBlocks) {
            const block = BLOCKS[i - 1];

            if (block.includes(tile.id)) {
                return false;
            }
        }

        return true;
    });

    $effect(() => {
        const onTransitionEnd = () => {
            if (!tile.rotate) {
                return;
            }

            rotateTile(tile, tile.rotate === 'cw');
            persist();

            if (ss.rotating === tile.id) {
                _sound.play('cluck');

                post(() => {
                    delete ss.rotating;
                }, 400);
            }

            if (isSolved()) {
                post(() => _sound.play('won', { rate: 4 }), 100);
                onOver();
            }
        };

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });

    const onPointerDown = () => {
        _prompt.opacity = 0;

        if (spot.cix < 2) {
            return;
        }

        ss.rotating = tile.id;

        _sound.play('click');
        ss.steps += 1;

        const cw = spot.cix === 2;
        const block = findBlock(tile.sid);
        const tobs = block.map((sid) => ss.tiles.find((t) => t.sid === sid));

        for (let i = 0; i < 3; i++) {
            tobs[i].rotate = cw ? 'cw' : 'ccw';
        }
    };

    const pclass = $derived(
        `pentagon ${spot.flip ? 'flip' : ''} color-${spot.cix} ${disabled ? 'disabled' : ''} ${ss.over || ss.flip ? 'over' : ''} ${ss.over ? 'pulse' : ''}`,
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
        {@const _class = `char ${center ? 'gold' : ''} ${plus || num === 0 || center ? '' : 'negative'}`}
        <div class={_class} style="transform: {transform}; transition: transform {duration} linear;">
            {plus + num}
        </div>
    {/if}
    <!-- <div class='id'>{tile.id}</div> -->
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

    .id {
        grid-area: 1/1;
        z-index: 2;
        color: black;
        transform: translate(18px, 18px);
        font-family: Poppins;
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

    .over {
        filter: hue-rotate(-30deg);
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
