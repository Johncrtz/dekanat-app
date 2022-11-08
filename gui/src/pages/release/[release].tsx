import { ReleaseProps } from "components/Release Notes/Release"
import type {
    GetStaticPaths,
    GetStaticProps,
    InferGetStaticPropsType,
    NextPage,
} from "next"
import { releases } from "public/releases"
import { ParsedUrlQuery } from "querystring"
import { VersionTag } from "types/VersionTag"
import Release from "components/Release Notes/Release"

type SerializedReleaseProps = Omit<ReleaseProps, "date"> & { date: number }

const serialize = (release: ReleaseProps): SerializedReleaseProps => {
    const { date, ...rest } = release
    return {
        date: date.getTime(),
        ...rest,
    }
}

const deserialize = (release: SerializedReleaseProps): ReleaseProps => {
    const { date, ...rest } = release
    return {
        date: new Date(date),
        ...rest,
    }
}

type ReleasePageSlug = {
    release: VersionTag
}

const ReleasePage: NextPage<
    InferGetStaticPropsType<typeof getStaticProps>
> = props => {
    const release = deserialize(props.release as SerializedReleaseProps)

    return <Release {...release} />
}

export const getStaticPaths: GetStaticPaths<ReleasePageSlug> = () => {
    const paths = releases.map(r => ({
        params: { release: r.version },
    }))

    return {
        paths,
        fallback: false,
    }
}

type ReleasePageSlugContext = ReleasePageSlug & ParsedUrlQuery

export const getStaticProps: GetStaticProps = async context => {
    const params = context.params as ReleasePageSlugContext

    const release = releases.find(r => r.version === params.release)

    if (release == null)
        return {
            notFound: true,
        }

    return {
        props: {
            release: serialize(release),
        },
    }
}

export default ReleasePage
