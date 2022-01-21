"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginutils_1 = require("@rollup/pluginutils");
const magic_string_1 = __importDefault(require("magic-string"));
const compiler_sfc_1 = require("@vue/compiler-sfc");
exports.default = () => {
    const filter = (0, pluginutils_1.createFilter)(['**/*.vue'], 'node_modules/**');
    const setupAttrs = (code) => {
        const arr = code.match(/<script\b[^>]*>/);
        let name = null, lang = null;
        if (arr && arr[0]) {
            const tempName = /name=['"]([^'"]+)['"]/.exec(arr[0]);
            const tempLang = /lang=['"]([^'"]+)['"]/.exec(arr[0]);
            name = tempName ? tempName[1] : null;
            lang = tempLang ? tempLang[1] : null;
        }
        return { name, lang };
    };
    return {
        name: 'vite-plugin-arbalest',
        enforce: 'pre',
        transform(code, id) {
            if (!code || !filter(id))
                return null;
            const str = new magic_string_1.default(code);
            const { descriptor } = (0, compiler_sfc_1.parse)(code);
            if (!descriptor.script) {
                const { name, lang } = setupAttrs(code);
                if (name) {
                    str.appendLeft(0, `
                    <script ${lang ? `lang="${lang}"` : ""}>
                    import { defineComponent } from 'vue'
                    export default defineComponent({ name: '${name}' })
                    <\/script>`);
                    return {
                        map: str.generateMap(),
                        code: str.toString()
                    };
                }
                else {
                    return null;
                }
            }
        }
    };
};
//# sourceMappingURL=index.js.map