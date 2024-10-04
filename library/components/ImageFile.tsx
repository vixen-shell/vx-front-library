import { ImageBroken } from './ImageBroken'
import { useImageFile } from './hooks'

export const ImageFile: React.FC<{
    filePath: string
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
    radius?: number
    fit?: 'fill' | 'contain' | 'cover'
}> = ({
    filePath,
    width = undefined,
    height = undefined,
    minWidth = undefined,
    minHeight = undefined,
    radius = 0,
    fit = 'fill',
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
                borderRadius: `${radius}px`,
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
                borderRadius: `${radius}px`,
                width: width || 'auto',
                height: height || 'auto',
            }}
        ></div>
    ) : (
        <img
            style={{
                borderRadius: `${radius}px`,
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
