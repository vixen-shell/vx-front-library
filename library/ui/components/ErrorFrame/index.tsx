import vixenLogo from '../../assets/vixen_logo.svg'

interface ErrorFrameProps {
    message?: string
}

export default function ErrorFrame({ message }: ErrorFrameProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                gap: '32px',
                overflow: 'auto',
            }}
        >
            <div style={{ display: 'flex', gap: '16px' }}>
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
            </div>
            {message && <p style={{ fontSize: '32px' }}>{message}</p>}
        </div>
    )
}
