/* tslint:disable */
/* eslint-disable */

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly main: (a: number, b: number) => number;
    readonly wasm_bindgen__closure__destroy__h4f121b77250bc5d5: (a: number, b: number) => void;
    readonly wasm_bindgen__closure__destroy__h5a7cd682e23350f8: (a: number, b: number) => void;
    readonly wasm_bindgen__closure__destroy__h5f03f67cf2f694e3: (a: number, b: number) => void;
    readonly wasm_bindgen__closure__destroy__h03fa493654c43674: (a: number, b: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__he3dc54c271dd86a6: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h950f328083cecaa0: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h13f972db709d9ebc: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h13f972db709d9ebc_2: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h13f972db709d9ebc_3: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h13f972db709d9ebc_4: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0bd72c59c282bc74: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0bd72c59c282bc74_8: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0bd72c59c282bc74_9: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0bd72c59c282bc74_10: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0bd72c59c282bc74_11: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0bd72c59c282bc74_12: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0bd72c59c282bc74_13: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0bd72c59c282bc74_14: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__ha79b72998612a01d: (a: number, b: number, c: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h6cc0fb62306c6f75: (a: number, b: number) => number;
    readonly wasm_bindgen__convert__closures_____invoke__hc4aa24e1f53551c8: (a: number, b: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hb99bc681e1e9bc54: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
