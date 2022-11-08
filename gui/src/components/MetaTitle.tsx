import Head from "next/head"
import React from "react"

type TitleProps = {
    /**
     * Tab Title
     */
    title: string
    /**
     * optional affix
     * @default '| Fakultät für Mathematik unf Informatik'
     */
    suffix?: string
    /**
     * optional affix
     */
    prefix?: string
}

/**
 * `<title></title>` Component with `<Head></Head>`.
 * @param {TitleProps} param
 * @returns
 */
const MetaTitle: React.FC<TitleProps> = ({
    title,
    prefix,
    suffix = "| Fakultät für Mathematik und Informatik",
}) => (
    <Head>
        <title>
            {prefix ? prefix + "" : ""}
            {title} {suffix}
        </title>
    </Head>
)

export default MetaTitle
