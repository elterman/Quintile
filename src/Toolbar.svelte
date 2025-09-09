<script>
    import { PROMPT_RESET_STATS, PROMPT_SURRENDER } from './const';
    import { persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import TextButton from './Text Button.svelte';

    const onHome = () => {
        _sound.play('plop');
        ss.home = true;
    };

    const onSurrender = () => {
        if (_prompt.id == PROMPT_SURRENDER) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_SURRENDER);
    };

    const onResetStats = () => {
        if (_prompt.id == PROMPT_RESET_STATS) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_RESET_STATS);
    };

    const onSound = () => {
        _sound.sfx = !_sound.sfx;

        if (_sound.sfx) {
            _sound.play('won', { rate: 4 });
        }

        persist();
    };

    const onMusic = () => {
        _sound.music = !_sound.music;

        if (ss.tiles.length === 0) {
            return;
        }

        if (_sound.music) {
            _sound.playMusic();
        } else {
            _sound.stopMusic();
        }

        persist();
    };
</script>

<div class="toolbar">
    <TextButton id="tb-home" text={['HOME']} onClick={onHome} />
    <TextButton id="tb-surrender" text={['GIVE', 'UP']} onClick={onSurrender} disabled={ss.over || ss.surrender} />
    <TextButton id="tb-reset-stats" text={['RESET', 'STATS']} onClick={onResetStats} disabled={_stats.plays === 0} />
    <TextButton id="tb-sound" text={['SOUND', _sound.sfx ? 'ON' : 'OFF']} onClick={onSound} />
    <TextButton id="tb-music" text={['MUSIC', _sound.music ? 'ON' : 'OFF']} onClick={onMusic} />
</div>

<style>
    .toolbar {
        grid-area: 6/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        place-content: center;
        gap: 10px;
    }
</style>
