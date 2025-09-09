<script>
    import NumberFlow from '@number-flow/svelte';
    import { fade } from 'svelte/transition';
    import { ss } from './state.svelte';
    import { YOU_GAVE_UP_STATS_RESET } from './const';

    const scoreReport = $derived.by(() => {
        const score = ss.score();
        return `${score === 0 ? 'even' : `${Math.abs(score)} ${score > 0 ? 'over' : 'under'}`} par`;
    });
</script>

<div class="steps">
    {#if ss.cheer}
        <div class="message" transition:fade>
            {#if ss.cheer === YOU_GAVE_UP_STATS_RESET}
            {@const cheers = ss.cheer.split('•')}
                <span class='bronze'>{cheers[0]}</span>
                <span>{cheers[1]}</span>
            {:else}
                {ss.cheer}
            {/if}
        </div>
    {:else if !ss.surrender}
        <div id="steps" class="flow" transition:fade={{ duration: ss.surrender ? 0 : 400 }}>
            <NumberFlow value={ss.steps} />
            <span>{` rotation${ss.steps === 1 ? '' : 's'}`}</span>
            {#if ss.over && ss.steps > 0}
                <span class="bullet">•</span>
                <span class="report">{scoreReport}</span>
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
        display: grid;
        grid-auto-flow: column;
        gap: 10px;
    }

    .bronze {
        color: var(--bronze);
    }

    .flow {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
    }

    .bullet {
        font-family: Poppins;
        margin: -6px 10px 0 10px;
    }

    .report {
        color: var(--aqua);
    }
</style>
