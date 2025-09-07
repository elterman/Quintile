<script>
    import NumberFlow from '@number-flow/svelte';
    import { sumAt } from './shared.svelte';
</script>

<div class="sums">
    {#each [3, 1, 2] as i (i)}
        {@const sum = sumAt(i)}
        <div class="sum no-highlight color-{i}">
            <NumberFlow prefix={sum > 0 ? '+' : ''} value={sum} />
        </div>
    {/each}
</div>

<style>
    .sums {
        grid-area: 4/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        gap: 15px;
        border-radius: 50%;
        align-items: center;
        transition: opacity 0.2s;
    }

    .sum {
        display: grid;
        place-content: center;
        width: 40px;
        aspect-ratio: 1;
        box-sizing: border-box;
        border-radius: 50%;
        transition: opacity 0.3s;
        font-family: Poppins;
        font-weight: bold;
        color: var(--background);
    }
</style>
