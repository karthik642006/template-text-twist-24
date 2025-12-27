import { useState, useRef } from 'react';
import { Upload, Move, ZoomIn, ZoomOut, RotateCcw, Play } from 'lucide-react';
import { ShapeType } from '@/types/meme';

interface ShapeWithImageProps {
  shapeType: ShapeType;
  width: number;
  height: number;
  color: string;
  fillColor: string;
  strokeWidth: number;
  imageUrl?: string;
  videoUrl?: string;
  imageX?: number;
  imageY?: number;
  imageScale?: number;
  onClick?: () => void;
  onImagePositionChange?: (x: number, y: number, scale: number) => void;
  isSelected?: boolean;
  points?: { x: number; y: number }[];
}

export const ShapeWithImage = ({
  shapeType,
  width,
  height,
  color,
  fillColor,
  strokeWidth,
  imageUrl,
  videoUrl,
  imageX = 0,
  imageY = 0,
  imageScale = 1,
  onClick,
  onImagePositionChange,
  isSelected,
  points
}: ShapeWithImageProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getClipPath = (): string => {
    switch (shapeType) {
      case 'circle':
        return 'ellipse(50% 50% at 50% 50%)';
      case 'square':
      case 'rectangle':
        return 'inset(0)';
      case 'rounded-rectangle':
        return 'inset(0 round 12px)';
      case 'triangle':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'pentagon':
        return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'heart':
        return 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")';
      case 'custom':
        if (points && points.length > 2) {
          const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return `path("${path}")`;
        }
        return 'inset(0)';
      default:
        return 'inset(0)';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageUrl && !videoUrl) return;
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - imageX, y: e.clientY - imageY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    onImagePositionChange?.(newX, newY, imageScale);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!imageUrl && !videoUrl) return;
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, imageScale + delta));
    onImagePositionChange?.(imageX, imageY, newScale);
  };

  const renderSVGShape = () => {
    const sw = strokeWidth;
    
    switch (shapeType) {
      case 'circle':
        return <ellipse cx={width/2} cy={height/2} rx={width/2 - sw} ry={height/2 - sw} fill={fillColor} stroke={color} strokeWidth={sw} />;
      case 'square':
      case 'rectangle':
        return <rect x={sw/2} y={sw/2} width={width - sw} height={height - sw} fill={fillColor} stroke={color} strokeWidth={sw} />;
      case 'rounded-rectangle':
        return <rect x={sw/2} y={sw/2} width={width - sw} height={height - sw} rx="12" ry="12" fill={fillColor} stroke={color} strokeWidth={sw} />;
      case 'triangle':
        return <polygon points={`${width/2},${sw} ${width - sw},${height - sw} ${sw},${height - sw}`} fill={fillColor} stroke={color} strokeWidth={sw} />;
      case 'pentagon':
        const pPoints = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 90) * Math.PI / 180;
          pPoints.push(`${width/2 + (width/2 - sw) * Math.cos(angle)},${height/2 + (height/2 - sw) * Math.sin(angle)}`);
        }
        return <polygon points={pPoints.join(' ')} fill={fillColor} stroke={color} strokeWidth={sw} />;
      case 'star':
        const starPoints = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * 36 - 90) * Math.PI / 180;
          const radius = i % 2 === 0 ? (width/2 - sw) : (width/4);
          starPoints.push(`${width/2 + radius * Math.cos(angle)},${height/2 + radius * Math.sin(angle)}`);
        }
        return <polygon points={starPoints.join(' ')} fill={fillColor} stroke={color} strokeWidth={sw} />;
      case 'heart':
        const heartPath = `
          M ${width / 2},${height * 0.3}
          C ${width * 0.2},${height * 0.1} ${-width * 0.2},${height * 0.6} ${width / 2},${height * 0.9}
          C ${width * 1.2},${height * 0.6} ${width * 0.8},${height * 0.1} ${width / 2},${height * 0.3}
          Z`;
        return <path d={heartPath} fill={fillColor} stroke={color} strokeWidth={sw} />;
      case 'custom':
        if (points && points.length > 2) {
          const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return <path d={pathD} fill={fillColor} stroke={color} strokeWidth={sw} />;
        }
        return <rect x={sw/2} y={sw/2} width={width - sw} height={height - sw} fill={fillColor} stroke={color} strokeWidth={sw} />;
      default:
        return null;
    }
  };

  const hasMedia = imageUrl || videoUrl;

  return (
    <div
      ref={containerRef}
      className={`relative cursor-pointer ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
      style={{ width, height }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Base shape SVG */}
      <svg width={width} height={height} className="absolute inset-0">
        {renderSVGShape()}
      </svg>

      {/* Media content clipped to shape */}
      {hasMedia && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: getClipPath() }}
          onMouseDown={handleMouseDown}
        >
          {videoUrl ? (
            <video
              src={videoUrl}
              className="absolute object-cover cursor-move"
              style={{
                transform: `translate(${imageX}px, ${imageY}px) scale(${imageScale})`,
                width: '100%',
                height: '100%',
                transformOrigin: 'center'
              }}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={imageUrl}
              alt=""
              className="absolute object-cover cursor-move"
              style={{
                transform: `translate(${imageX}px, ${imageY}px) scale(${imageScale})`,
                width: '100%',
                height: '100%',
                transformOrigin: 'center'
              }}
              draggable={false}
            />
          )}
        </div>
      )}

      {/* Empty state - upload icon */}
      {!hasMedia && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ clipPath: getClipPath() }}
        >
          <div className="flex flex-col items-center text-gray-400 bg-gray-100 p-4 rounded-lg">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">Upload</span>
          </div>
        </div>
      )}

      {/* Media controls overlay when selected */}
      {hasMedia && isSelected && (
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-1">
          <button
            className="p-1 bg-gray-800 rounded text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onImagePositionChange?.(imageX, imageY, Math.min(3, imageScale + 0.1));
            }}
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button
            className="p-1 bg-gray-800 rounded text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onImagePositionChange?.(imageX, imageY, Math.max(0.5, imageScale - 0.1));
            }}
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button
            className="p-1 bg-gray-800 rounded text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onImagePositionChange?.(0, 0, 1);
            }}
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShapeWithImage;
