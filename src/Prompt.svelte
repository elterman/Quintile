<script>
    import {
        BLOCKS,
        PROMPT_NO,
        PROMPT_PLAY_AGAIN,
        PROMPT_RESET_STATS,
        PROMPT_SURRENDER,
        YOU_GAVE_UP,
        YOU_GAVE_UP_STATS_RESET,
    } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { isSolved, onOver, onResetStats, onStart } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import { post } from './utils';

    const label = $derived(_prompt.id);
    const cheer = $derived(label.endsWith('!'));

    const onSurrender = () => {
        ss.surrender = _stats.plays && !ss.replay ? YOU_GAVE_UP_STATS_RESET : YOU_GAVE_UP;

        if (isSolved()) {
            onOver();
        } else {
            let delay = 0;

            for (const block of BLOCKS) {
                const id = block[0];
                const tile = ss.tiles.find((tile) => tile.id === id);

                if (tile.id !== tile.sid) {
                    const cw = tile.sid === block[2];
                    const tobs = block.map((sid) => ss.tiles.find((t) => t.sid === sid));

                    post(() => {
                        _sound.play('click');

                        for (let i = 0; i < 3; i++) {
                            tobs[i].rotate = cw ? 'cw' : 'ccw';
                        }
                    }, delay);

                    delay += 1000;
                }
            }
        }

        if (!ss.replay) {
            onResetStats();
        }
    };

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'prompt') {
                return false;
            }

            if (e.propertyName !== 'opacity') {
                return;
            }

            if (_prompt.opacity == 0) {
                _prompt.set(ss.over ? PROMPT_PLAY_AGAIN : null);
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div id="prompt" class="prompt {_prompt.opacity ? 'visible' : ''}">
    {#if label === PROMPT_PLAY_AGAIN}
        <PromptPanel
            ops={[
                { label: 'replay?', onClick: () => onStart(true) },
                { label: 'play new?', onClick: onStart },
            ]} />
    {:else if label === PROMPT_SURRENDER}
        <PromptPanel ops={[{ label, onClick: onSurrender }, { label: PROMPT_NO }]} />
    {:else if label === PROMPT_RESET_STATS}
        <PromptPanel ops={[{ label, onClick: onResetStats }, { label: PROMPT_NO }]} />
    {:else if label}
        <PromptPanel ops={[{ label }]} readOnly={cheer} />
    {:else}
        <div class="placeholder"></div>
    {/if}
</div>

<style>
    .prompt {
        grid-area: 5/1;
        place-self: center;
        margin-top: 15px;
        transform: scale(0);
        opacity: 0;
        z-index: 1;
        transition: 0.3s;
    }

    .visible {
        opacity: 1;
        transform: scale(1);
    }

    .placeholder {
        height: 36px;
    }
</style>
