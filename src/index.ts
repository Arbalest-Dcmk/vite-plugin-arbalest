import { createFilter } from '@rollup/pluginutils'
import magicString from 'magic-string'
import { parse } from '@vue/compiler-sfc'
import type { Plugin } from 'vite'

export default (): Plugin => {
    const filter = createFilter(['**/*.vue'], 'node_modules/**')
    const setupAttrs = (code: string) => {
        const arr = code.match(/<script\b[^>]*>/)
        let name = null, lang = null;
        if (arr&&arr[0]) {
            const tempName = /name=['"]([^'"]+)['"]/.exec(arr[0])
            const tempLang = /lang=['"]([^'"]+)['"]/.exec(arr[0])
            name = tempName ? tempName[1] : null
            lang = tempLang ? tempLang[1] : null
        }
        return { name, lang }
    }

    return {
        name: 'vite-plugin-arbalest',
        enforce: 'pre',
        transform(code, id) {
            if (!code || !filter(id)) return null
            const str = new magicString(code)
            const { descriptor } = parse(code)
            if (!descriptor.script) {
                const { name, lang } = setupAttrs(code)
                if (name) {
                    str.appendLeft(0, `
                    <script ${lang ? `lang="${lang}"` : ""}>
                    import { defineComponent } from 'vue'
                    export default defineComponent({ name: '${name}' })
                    <\/script>`
                    )
                    return {
                        map: str.generateMap(),
                        code: str.toString()
                    }
                } else {
                    return null
                }
            }
        }
    }
}