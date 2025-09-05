<script>
    import NumberFlow from '@number-flow/svelte';
    import { ROWS } from './const';
    import { sumAt } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import { post } from './utils';

    const onPointerDown = (ri) => {
        for (let i = 0; i < ss.cells.length; i++) {
            const cell = ss.cells[i];

            if (ROWS[ri - 1].includes(cell.pos)) {
                ss.cells[i].blink = true;
                post(() => delete ss.cells[i].blink, 1000);
            }
        }
    };
</script>

<div class="sums {ss.over || _prompt.id ? 'hidden' : ''}">
    {#each [3, 1, 2] as i (i)}
        {@const sum = sumAt(i)}
        <div class="sum no-highlight color-{i}" onpointerdown={() => onPointerDown(i)}>
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

    .hidden {
        opacity: 0;
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
        cursor: pointer;
    }

    .sum:hover {
        filter: sepia(0.35);
    }
</style>
