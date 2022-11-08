import { useEffect, useState } from "react"

type BrowserInfo = {
    isChromium: boolean
    isChrome: boolean
    isIOSChrome: boolean
    isOpera: boolean
    isIEEdge: boolean
}

/**
 * // TODO: use https://www.npmjs.com/package/ua-parser-js
 * this works for now, but to not waist time in maintaing this, use a third party lib
 */

/**
 * ### useBrowserInfo hook
 */
export const useBrowserInfo = () => {
    const [info, setInfo] = useState<BrowserInfo>()

    useEffect(() => {
        const isChromium = Object.prototype.hasOwnProperty.call(
            window,
            "chrome"
        )

        const isIOSChrome = window.navigator.userAgent.match("CriOS") == null

        const isOpera = Object.prototype.hasOwnProperty.call(window, "opr")
        const isIEEdge = window.navigator.userAgent.indexOf("Edg") > -1

        const isChrome =
            isChromium != null &&
            window.navigator.vendor === "Google Inc." &&
            isOpera === false &&
            isIEEdge === false

        setInfo({
            isChromium,
            isIOSChrome,
            isChrome,
            isOpera,
            isIEEdge,
        })
    }, [])

    return { ...info }
}
