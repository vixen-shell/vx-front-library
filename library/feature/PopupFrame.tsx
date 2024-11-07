import React, { useEffect, useRef, useState } from 'react'
import { usePopupFrame } from '../api'
import { useVxState } from '../stateHook'
import { Paper } from '@mantine/core'
import { Resizable } from 're-resizable'
import { PhosphorIcon } from '../components/PhosphorIcon'

interface PopupFrameProps {
    children: React.ReactElement
}

export const PopupFrame: React.FC<PopupFrameProps> = ({ children }) => {
    const child = React.Children.only(children)

    const popup = usePopupFrame()
    const state = useVxState()

    // INITIAL OPTIONS
    // ---------------------------------------------------------- - - -
    const options: {
        position: { x: number; y: number } | null
        size: { width: number; height: number } | null
        resizable: boolean
        exit_on_leave: boolean
    } = state.get.vx_popup_frame

    const screenPosition: { x: number; y: number } | null = options.position
        ? {
              x: options.position.x / state.get.vx_ui_scale,
              y: options.position.y / state.get.vx_ui_scale,
          }
        : null

    // SIZE AND POSITION SNAPSHOT
    // ---------------------------------------------------------- - - -
    const sizeSnapshot = useRef<{
        width: number
        height: number
    } | null>(options.size)

    const positionSnapshot = useRef<{
        top: number
        left: number
    } | null>(null)

    const takeSizeSnapShot = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect()

        sizeSnapshot.current = {
            width: rect.width,
            height: rect.height,
        }
    }
    const takePositionSnapShot = (element: HTMLElement) => {
        positionSnapshot.current = {
            top: parseFloat(element.style.top),
            left: parseFloat(element.style.left),
        }
    }

    // SCREEN
    // ---------------------------------------------------------- - - -
    const screen = useRef<HTMLDivElement | null>(null)
    const [screenSize, setScreenSize] = useState<{
        width: number
        height: number
    } | null>(null)

    useEffect(() => {
        setTimeout(() => {
            if (screen.current) {
                const screenRect = screen.current.getBoundingClientRect()

                setScreenSize({
                    width: screenRect.width,
                    height: screenRect.height,
                })

                screen.current.style.opacity = '1'
            }
        }, 100)
    }, [])

    // ORIGIN FUNCTIONS
    // ---------------------------------------------------------- - - -
    const getXAxisOriginEdge = (x: number, width: number): 'left' | 'right' => {
        const right = x + width
        return right > screenSize!.width ? 'right' : 'left'
    }
    const getYAxisOriginEdge = (
        y: number,
        height: number
    ): 'top' | 'bottom' => {
        const bottom = y + height
        return bottom > screenSize!.height ? 'bottom' : 'top'
    }
    const getOriginCorner = (
        coordinates: { x: number; y: number } | null,
        size: { width: number; height: number }
    ) => {
        return coordinates
            ? getYAxisOriginEdge(coordinates.y, size.height) +
                  getXAxisOriginEdge(coordinates.x, size.width)
            : 'null'
    }
    const getXOrigin = (x: number, width: number): number => {
        return getXAxisOriginEdge(x, width) === 'right' ? x - width : x
    }
    const getYOrigin = (y: number, height: number): number => {
        return getYAxisOriginEdge(y, height) === 'bottom' ? y - height : y
    }

    // CSS SIZE AND POSITION
    // ---------------------------------------------------------- - - -
    const CSSSize = () =>
        sizeSnapshot.current
            ? sizeSnapshot.current
            : {
                  width: screenSize!.width / 2,
                  height: screenSize!.height / 2,
              }

    const CSSPosition = () =>
        screenPosition
            ? ({
                  position: 'absolute',
                  top: getYOrigin(screenPosition.y, CSSSize().height),
                  left: getXOrigin(screenPosition.x, CSSSize().width),
              } as React.CSSProperties)
            : ({
                  position: 'relative',
              } as React.CSSProperties)

    // RESIZABLE CORNER
    // ---------------------------------------------------------- - - -
    const handleResizableCorner = () => {
        const originCorner = getOriginCorner(screenPosition, CSSSize())

        const enable = {
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
        }

        switch (originCorner) {
            case 'topleft':
                enable.bottomRight = true
                break
            case 'topright':
                enable.bottomLeft = true
                break
            case 'bottomright':
                enable.topLeft = true
                break
            case 'bottomleft':
                enable.topRight = true
                break
            default:
                return undefined
        }

        return enable
    }

    // NOTCHES CORNER POSTION
    // ---------------------------------------------------------- - - -
    const handleNotchesStyles = () => {
        const originCorner = getOriginCorner(screenPosition, CSSSize())

        const style = { position: 'absolute' } as React.CSSProperties

        switch (originCorner) {
            case 'topleft':
                style.top = '100%'
                style.left = '100%'
                style.transform = 'translate(-100%, -100%)'
                break
            case 'topright':
                style.top = '100%'
                style.left = 0
                style.transform = 'translate(0, -100%) rotate(90deg)'
                break
            case 'bottomright':
                style.top = 0
                style.left = 0
                style.transform = 'rotate(180deg)'
                break
            case 'bottomleft':
                style.top = 0
                style.left = '100%'
                style.transform = 'translate(-100%, 0) rotate(270deg)'
                break
            default:
                style.display = 'none'
                break
        }

        return style
    }

    // MAXIMUM SIZES
    // ---------------------------------------------------------- - - -
    const handleMaxSize = () => {
        const originCorner = getOriginCorner(screenPosition, CSSSize())

        const maxSize: {
            maxWidth: number | undefined
            maxHeight: number | undefined
        } = {
            maxWidth: undefined,
            maxHeight: undefined,
        }

        switch (originCorner) {
            case 'topleft':
                maxSize.maxWidth = screenSize!.width - screenPosition!.x
                maxSize.maxHeight = screenSize!.height - screenPosition!.y
                break
            case 'topright':
                maxSize.maxWidth = -screenSize!.width - screenPosition!.x
                maxSize.maxHeight = screenSize!.height - screenPosition!.y
                break
            case 'bottomright':
                maxSize.maxWidth = -screenSize!.width - screenPosition!.x
                maxSize.maxHeight = -screenSize!.height - screenPosition!.y
                break
            case 'bottomleft':
                maxSize.maxWidth = screenSize!.width - screenPosition!.x
                maxSize.maxHeight = -screenSize!.height - screenPosition!.y
                break
            default:
                break
        }

        return maxSize
    }

    // EXIT POPUP
    // ---------------------------------------------------------- - - -
    const exitPopup = () => {
        if (screen.current) {
            screen.current.style.opacity = '0'
        }
        state.set('vx_popup_frame_callback_data', {
            position: options.position,
            size: sizeSnapshot.current,
        })
        popup.hide()
    }

    // WRAPPERS
    // ---------------------------------------------------------- - - -
    const DefaultWrapper = () => (
        <Paper
            shadow="sm"
            withBorder
            style={{
                ...CSSSize(),
                ...CSSPosition(),
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => {
                if (options.exit_on_leave) exitPopup()
            }}
        >
            {child}
        </Paper>
    )

    const ResizableWrapper = () => (
        <Resizable
            defaultSize={CSSSize()}
            resizeRatio={1 / state.get.vx_ui_scale}
            style={{ ...CSSPosition() }}
            enable={handleResizableCorner()}
            maxWidth={handleMaxSize().maxWidth}
            maxHeight={handleMaxSize().maxHeight}
            onResizeStart={(_event, _direction, elementRef) => {
                if (!positionSnapshot.current) {
                    takePositionSnapShot(elementRef)
                }
            }}
            onResize={(_event, direction, elementRef, delta) => {
                if (['left', 'bottomLeft', 'topLeft'].includes(direction)) {
                    elementRef.style.left = `${
                        positionSnapshot.current!.left - delta.width
                    }px`
                }
                if (['top', 'topRight', 'topLeft'].includes(direction)) {
                    elementRef.style.top = `${
                        positionSnapshot.current!.top - delta.height
                    }px`
                }
            }}
            onResizeStop={(_event, _direction, elementRef) => {
                takePositionSnapShot(elementRef)
                takeSizeSnapShot(elementRef)
            }}
        >
            <Paper
                shadow="sm"
                withBorder
                style={{
                    width: '100%',
                    height: '100%',
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseLeave={() => {
                    if (options.exit_on_leave) exitPopup()
                }}
            >
                {child}
                <PhosphorIcon
                    iconName="notches"
                    iconStyle="thin"
                    size={32}
                    style={handleNotchesStyles()}
                />
            </Paper>
        </Resizable>
    )

    return (
        <div
            ref={screen}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'clip',
                transition: 'opacity 0.25s ease-in-out',
                opacity: 0,
            }}
            onClick={() => exitPopup()}
        >
            {screenSize ? (
                options.resizable ? (
                    <ResizableWrapper />
                ) : (
                    <DefaultWrapper />
                )
            ) : (
                <></>
            )}
        </div>
    )
}
