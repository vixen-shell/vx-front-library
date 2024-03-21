import Frame from '../Frame'
import vixenLogo from '../../assets/vixen_logo.svg'

interface ErrorFrameProps {
    message?: string
}

export default function ErrorFrame({ message }: ErrorFrameProps) {
    return (
        <Frame gap={32}>
            <Frame direction="row" height={100} gap={16}>
                <span
                    style={{
                        color: '#008080',
                        fontSize: '64px',
                        fontWeight: 'bold',
                    }}
                >
                    !
                </span>
                <img src={vixenLogo} height={96} />
            </Frame>
            {message && <p style={{ fontSize: '32px' }}>{message}</p>}
        </Frame>
    )
}
