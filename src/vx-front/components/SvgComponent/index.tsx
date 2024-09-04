import React, { useState, useEffect } from 'react'

interface SvgComponentProps {
    src: string
    size: number
    color: string
}

const SvgComponent: React.FC<SvgComponentProps> = ({ src, size, color }) => {
    const [svgContent, setSvgContent] = useState('')

    useEffect(() => {
        fetch(src)
            .then((response) => response.text())
            .then((text) => setSvgContent(text))
    }, [src, size, color])

    return (
        <svg
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
                width: `${String(size)}px`,
                height: 'auto',
                fill: color,
            }}
        ></svg>
    )
}

export default SvgComponent
