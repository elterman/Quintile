import { APP_STATE, PROMPT_TRANSITION } from './const';
import { post } from './utils';

export const ss = $state({
    mode: 1,
    home: true,
    steps: 0,
    score: () => ss.steps - ss.par,
    appKey: () => `${APP_STATE} • ${ss.mode}`,
});

export const _prompt = $state({
    id: '',
    opacity: 0,

    set: (id) => {
        const doSet = () => {
            _prompt.id = id;
            _prompt.opacity = id ? 1 : 0;
        };

        if (_prompt.id && _prompt.id !== id) {
            _prompt.opacity = 0;
            post(() => { _prompt.id = null; doSet(); }, PROMPT_TRANSITION);
        } else {
            doSet();
        }
    }
});

export const _stats = $state({
    steps: 0,
    plays: 0,
    total_score: 0,
    best: null,
    ave: () => _stats.plays ? Math.round(_stats.total_score / _stats.plays) : 0,
});
