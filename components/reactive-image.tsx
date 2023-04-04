type ImageProps = {
    src: string
    alt: string
    divClass?: string
    imgClass?: string
}

const ReactiveImage = ({ props }: { props: ImageProps }) => {
    const { src, alt, divClass = "", imgClass = "" } = props
    return <>
        <div className={divClass}>
            <img src={src} alt={alt} className={`${imgClass} object-scale-down`} />
        </div>
    </>
}

export default ReactiveImage