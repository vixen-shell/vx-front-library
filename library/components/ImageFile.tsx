import { ImageBroken } from './ImageBroken'
import { useImageFile } from './hooks'

interface ImageFileProps
    extends Omit<
        React.ImgHTMLAttributes<HTMLImageElement>,
        'style' | 'width' | 'height' | 'src'
    > {
    filePath: string
    style?: React.CSSProperties
    width?: string | number
    height?: string | number
    minWidth?: string | number
    minHeight?: string | number
    radius?: string | number
    fit?: 'fill' | 'contain' | 'cover'
}

export const ImageFile: React.FC<ImageFileProps> = ({
    filePath,
    style = undefined,
    width = undefined,
    height = undefined,
    minWidth = undefined,
    minHeight = undefined,
    radius = undefined,
    fit = 'fill',
    ...props
}) => {
    const { url, error } = useImageFile(filePath)

    return error ? (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '10px',
                border: '1px dashed grey',
                borderRadius: radius,
                width: width || 'auto',
                height: height || 'auto',
                padding: '10px',
            }}
        >
            <ImageBroken size={32} color="grey" />
            <p
                style={{
                    color: 'grey',
                    fontSize: '0.75rem',
                    overflowWrap: 'anywhere',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                {filePath}
            </p>
        </div>
    ) : url === '' ? (
        <div
            style={{
                backgroundColor: '#00000033',
                borderRadius: radius,
                width: width || 'auto',
                height: height || 'auto',
            }}
        ></div>
    ) : (
        <img
            {...props}
            style={{
                ...style,
                borderRadius: radius,
                objectFit: fit,
                minWidth: minWidth || width || 'auto',
                minHeight: minHeight || height || 'auto',
            }}
            width={width || 'auto'}
            height={height || 'auto'}
            src={url}
        />
    )
}
