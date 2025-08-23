import { ReactNode, CSSProperties } from 'react'
import { useDepthNavigation, DepthLayer as DepthLayerType } from '../../contexts/DepthNavigationContext'

interface DepthLayerProps {
  layer: DepthLayerType
  children: ReactNode
  className?: string
  style?: CSSProperties
  interactive?: boolean
}

export function DepthLayer({ 
  layer, 
  children, 
  className = '', 
  style = {}, 
  interactive = true 
}: DepthLayerProps) {
  const { 
    getLayerTransform, 
    getLayerOpacity, 
    getLayerZIndex, 
    isLayerActive,
    navigateToLayer 
  } = useDepthNavigation()

  const handleClick = () => {
    if (interactive && !isLayerActive(layer)) {
      navigateToLayer(layer)
    }
  }

  const layerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: getLayerTransform(layer),
    opacity: getLayerOpacity(layer),
    zIndex: getLayerZIndex(layer),
    pointerEvents: isLayerActive(layer) ? 'auto' : 'none',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
    ...style
  }

  return (
    <div
      className={`depth-layer depth-layer-${layer} ${className}`}
      style={layerStyle}
      onClick={handleClick}
      data-layer={layer}
      data-active={isLayerActive(layer)}
    >
      {children}
    </div>
  )
}

export default DepthLayer