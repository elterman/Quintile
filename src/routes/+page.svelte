<script>
    import GamePage from '../Game Page.svelte';
    import Intro from '../Intro.svelte';
    import Splash from '../Splash.svelte';
    import { ss } from '../state.svelte';
    import { post, underMouse, windowSize } from '../utils';

    const SZX = 380;
    const SZY = 740;
    let scale = $state(1);
    let wsz = $state(0);

    $effect(() => {
        const disable = (e) => {
            e.preventDefault();
        };

        const onResize = () => {
            let scx = 1;
            let scy = 1;

            const { w, h } = windowSize();
            wsz = w;

            if (w < SZX) {
                scx = w / SZX;
            } else if (w < 440) {
                scx = w / SZX;
            }

            if (SZY * scx <= h) {
                scy = scx;
            } else if (h < SZY) {
                scy = h / SZY;
            }

            scale = Math.min(scx, scy);
        };

        onResize();

        window.addEventListener('contextmenu', disable);
        window.addEventListener('dblclick', disable);
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('contextmenu', disable);
            window.removeEventListener('dblclick', disable);
            window.removeEventListener('resize', onResize);
        };
    });

    let splash = $state(true);
    post(() => (splash = false), 2000);

    const onPointerDown = (e) => {
        if (ss.keyboard) {
            if (!underMouse(e, ['.keyboard', '#tb-sound'])) {
                delete ss.keyboard;
            }

            return;
        }
    };
</script>

<div class="vignette"></div>
<div class="app" onpointerdown={onPointerDown}>
    {#if splash}
        <Splash />
    {:else}
        <div class="content" style="scale: {scale};">
            <div class="frame {wsz > 600 ? '' : 'hidden'}" style="width: {SZX}px; height: {SZY}px;"></div>
            <GamePage />
            <Intro />
        </div>
    {/if}
</div>
{#if !ss.intro}
    <div class="disclaimer">
        <span>MUSIC BY ERIC MATYAS  •  WWW.SOUNDIMAGE.ORG</span>
    </div>
{/if}

<style>
    :global {
        body {
            margin: 0;
            overflow: hidden;
            --gold: #ffe087;
            --silver: #dfe1e5;
            --bronze: #eeae93;
            color: var(--bronze);
            --background: #27160c;
            background: var(--background);
            --aqua: #adffe4;
            --pink: #ffc0cb;
            --blue: #74d6fe;
        }

        .button-base {
            box-sizing: border-box;
            cursor: pointer;
            display: grid;
            place-content: center;
            transition: transform 0.1s;
        }

        .button-base:focus {
            outline: none !important;
        }

        .no-highlight {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .gradient-gray {
            background: -webkit-linear-gradient(-90deg, #888888, #888888 50%, #888888 100%);
        }

        .gradient-gold {
            background: -webkit-linear-gradient(-90deg, #ede2c5, #ffe4ad 50%, #d8ac3c 100%);
        }

        .gradient-silver {
            background: -webkit-linear-gradient(-90deg, #dfe1e5, #b3b5b6 50%, #b6b5ba 100%);
        }

        .gradient-bronze {
            background: -webkit-linear-gradient(-90deg, #d7adb2, #c1909a 50%, #a1768a 100%);
        }

        .clip-text {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: none;
            background-size: cover;
            background-position: center;
        }

        .background-aqua-radial {
            background-image: url('$lib/images/Aqua Radial.webp');
        }

        .background-gold-radial {
            background-image: url('$lib/images/Gold Radial.webp');
        }

        .background-silver-radial {
            background-image: url('$lib/images/Silver Radial.webp');
        }

        .background-bronze-radial {
            background-image: url('$lib/images/Bronze Radial.webp');
        }

        .background-gold {
            background-image: url('$lib/images/Gold.webp');
        }

        .background-silver {
            background-image: url('$lib/images/Silver.webp');
        }

        .background-bronze {
            background-image: url('$lib/images/Bronze.webp');
        }

        .color-0 {
            background: #0000;
        }

        .color-1 {
            background-image: url('$lib/images/Purple Radial.webp');
            background-size: cover;
        }

        .color-over {
            background-image: url('$lib/images/Green Radial.webp');
            background-size: cover;
        }

        .color-2 {
            background-image: url('$lib/images/Gold Radial.webp');
            background-size: cover;
        }

        .color-3 {
            background-image: url('$lib/images/Blue Radial.webp');
            background-size: cover;
        }
    }

    .app {
        display: grid;
        height: 100dvh;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
        touch-action: manipulation;
        outline: none !important;
        background-image: url('$lib/images/Pattern.webp');
        background-size: 400px;
        place-content: center;
    }

    .vignette {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(transparent, black 300%);
    }

    .content {
        grid-area: 1/1;
        display: grid;
        place-content: center;
        touch-action: none;
    }

    .frame {
        grid-area: 1/1;
        place-self: center;
        touch-action: none;
        background: #00000050;
    }

    .hidden {
        opacity: 0;
    }

    .disclaimer {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, -100%);
        opacity: 0.8;
        font-family: Roboto;
        font-size: calc(min(1.5dvh, 10px));
    }

    @font-face {
        font-family: Trajan;
        src: url('$lib/fonts/Trajan.otf');
    }

    @font-face {
        font-family: Poppins;
        src: url('$lib/fonts/Poppins.ttf');
    }

    @font-face {
        font-family: Roboto;
        src: url('$lib/fonts/Roboto.ttf');
    }

    @font-face {
        font-family: Roboto Condensed;
        src: url('$lib/fonts/Roboto Condensed.ttf');
    }

    @font-face {
        font-family: Roboto Mono;
        src: url('$lib/fonts/Roboto Mono.ttf');
    }
</style>
