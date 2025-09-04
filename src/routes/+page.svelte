<script>
    import GamePage from '../Game Page.svelte';
    import Intro from '../Intro.svelte';
    import Splash from '../Splash.svelte';
    import { ss } from '../state.svelte';
    import { post, underMouse, windowSize } from '../utils';

    let scale = $state(1);

    $effect(() => {
        const disable = (e) => {
            e.preventDefault();
        };

        const onResize = () => {
            let scx = 1;
            let scy = 1;

            const { w, h } = windowSize();

            if (w < 450) {
                scx = w / 450;
            }

            if (h < 788) {
                scy = h / 788;
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
            <div class="frame"></div>
            <GamePage />
            <Intro />
            {#if !ss.intro}
                <div class="disclaimer">
                    <span>MUSIC BY ERIC MATYAS  •  WWW.SOUNDIMAGE.ORG</span>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    :global {
        body {
            margin: 0;
            overflow: hidden;
            --gold: #ffe4ad;
            --silver: #dfe1e5;
            --bronze: #eeae93;
            --background: #3c2213;
            --aqua: #adffe4;
            --pink: #ffc0cb;
            --blue: #c0cbff;
            background: var(--background);
            color: var(--bronze);
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
            background-size: cover;
        }

        .background-gold-radial {
            background-image: url('$lib/images/Gold Radial.webp');
            background-size: cover;
        }

        .background-silver-radial {
            background-image: url('$lib/images/Silver Radial.webp');
            background-size: cover;
        }

        .background-bronze-radial {
            background-image: url('$lib/images/Bronze Radial.webp');
            background-size: cover;
        }

        .background-gold {
            background-image: url('$lib/images/Gold.webp');
            background-size: cover;
        }

        .background-silver {
            background-image: url('$lib/images/Silver.webp');
            background-size: cover;
        }

        .background-bronze {
            background-image: url('$lib/images/Bronze.webp');
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
        width: 450px;
        height: 788px;
        background: #00000050;
    }

    .disclaimer {
        grid-area: 1/1;
        place-self: end center;
        margin-right: 25px;
        font-family: SS3;
        font-size: 11px;
        transform: translateY(-10px);
        display: grid;
        justify-items: center;
        gap: 3px;
        opacity: 0.8;
    }

    @font-face {
        font-family: SS3;
        src: url('$lib/fonts/Source Sans 3.ttf');
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

    @font-face {
        font-family: Trajan;
        src: url('$lib/fonts/Trajan.otf');
    }
</style>
