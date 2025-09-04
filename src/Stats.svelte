<script>
    import NumberFlow from '@number-flow/svelte';
    import { _stats } from './state.svelte';

    const classes = $derived(`item ${_stats.reset ? 'reset' : ''}`);
    const ave = $derived(_stats.ave());
</script>

<div class="stats">
    <div class={classes}>
        <span class="label">puzzles</span>
        <div class="flow"><NumberFlow value={_stats.plays} /></div>
    </div>
    <div class={classes}>
        <span class="label">ave</span>
        {#if _stats.plays}
            {`${ave < 1 ? '' : '+'}`}
            <div class="flow"><NumberFlow value={ave} /></div>
        {:else}
            <div class="flow">N/A</div>
        {/if}
    </div>
    <div class={classes}>
        <span class="label">best</span>
        {#if _stats.plays}
            {`${_stats.best < 1 ? '' : '+'}`}
            <div class="flow"><NumberFlow value={_stats.best} /></div>
        {:else}
            <div class="flow">N/A</div>
        {/if}
    </div>
</div>

<style>
    .stats {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        height: 28px;
        gap: 20px;
        place-self: center;
    }

    .item {
        width: 94%;
        box-sizing: border-box;
        font-family: Trajan;
        font-size: 17px;
        border-radius: 50vh;
        height: 90%;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        place-content: center;
        place-self: center;
        transition: 0.2s;
        color: var(--aqua);
    }

    .reset {
        color: var(--gold);
    }

    .label {
        color: var(--bronze);
        margin-right: 10px;
    }

    .flow {
        margin-bottom: -2px;
    }
</style>
