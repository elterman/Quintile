<script>
    import { onMount } from 'svelte';
    import { onStart } from './Demo/demo shared.svelte';
    import { ds } from './state.svelte';

    const hi = '<span style=\'color: var(--aqua);\'>';
    const gold = '<span style=\'color: var(--gold);\'>';
    const blue = '<span style=\'color: var(--blue);\'>';
    const ul = '<ul style="margin: 15px 0 0 0;">';
    const li = '<li style="margin: 10px 0 0 -20px;">';

    const intro = `
        <span>Rotate ${hi}clusters of three</span> connected tiles until the ${hi}sum of each color group</span> matches the number at the ${hi}center</span>.</span>
        ${ul}
        ${li}Tap a ${gold}yellow</span> tile to rotate the cluster ${gold}clockwise</span>.</li>
        ${li}Tap a ${blue}blue</span> tile to rotate it ${blue}counterclockwise</span>.</li>
        ${li}Solve the puzzle in as few steps as possible. </li>
        </ul>`;

    onMount(() => {
        delete ds.cells;
        delete ds.started;

        onStart();
    });
</script>

<div class="help">
    <div class="content" tabindex="-1">
        {@html intro}
    </div>
</div>

<style>
    .help {
        grid-area: 2/1;
        justify-self: center;
        display: grid;
        border-radius: 20px;
        padding: 20px;
        box-sizing: border-box;
        /* font-family: 'Source Sans 3'; */
        font-family: Trajan;
        font-size: 18px;
        width: calc(min(90dvw, 340px));
        max-height: 470px;
        color: var(--bronze);
    }

    .content {
        display: grid;
        align-content: start;
        gap: 10px;
    }
</style>
