export declare function voice(voiceName?: string): (pat: any) => any;
export declare function wavetable(pos: number): (pat: any) => any;
export declare function filterCutoff(freq: number): (pat: any) => any;
export declare function filterRes(q: number): (pat: any) => any;
export declare function unison(voices: number): (pat: any) => any;
export declare function detune(cents: number): (pat: any) => any;
export declare function initVoiceBridge(url?: string): WebSocket | null;
declare const _default: {
    voice: typeof voice;
    wavetable: typeof wavetable;
    filterCutoff: typeof filterCutoff;
    filterRes: typeof filterRes;
    unison: typeof unison;
    detune: typeof detune;
    initVoiceBridge: typeof initVoiceBridge;
};
export default _default;
