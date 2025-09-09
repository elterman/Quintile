<script>
    import NumberFlow from '@number-flow/svelte';
    import { fade } from 'svelte/transition';
    import { ss } from './state.svelte';

    const scoreReport = $derived.by(() => {
        const score = ss.score();
        return `${score === 0 ? 'even' : `${Math.abs(score)} ${score > 0 ? 'over' : 'under'}`} par`;
    });
</script>

<div class="steps">
    {#if ss.cheer}
        <div class="message" transition:fade>
            {ss.cheer}
        </div>
    {:else if !ss.surrender}
        <div id="steps" class="flow" transition:fade={{ duration: ss.surrender ? 0 : 400 }}>
            <NumberFlow value={ss.steps} />
            <span>{` rotation${ss.steps === 1 ? '' : 's'}`}</span>
            {#if ss.over && ss.steps > 0}
                <span class="bullet">  •  </span>
                <span class='report'>{scoreReport}</span>
            {/if}
        </div>
    {/if}
</div>

<style>
    .steps {
        grid-area: 2/1;
        display: grid;
        height: 40px;
        grid-auto-flow: column;
        font-family: Trajan;
        font-size: 22px;
        place-self: center;
        place-items: center;
    }

    .message {
        grid-area: 1/1;
        color: var(--aqua);
    }

    .flow {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
    }

    .bullet {
        font-family: Poppins;
        margin-top: -6px;
    }

    .report {
        color: var(--aqua);
    }
</style>
