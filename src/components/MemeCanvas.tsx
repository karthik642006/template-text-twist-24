
import { forwardRef } from "react";
import { TextField, ImageField, LineField } from "@/types/meme";
import { CANVAS_CONFIG } from "@/components/meme-editor/MemeEditorCanvas";

interface MemeCanvasProps {
  templateImage: string;
  imageStyle: string;
  textFields: TextField[];
  imageFields: ImageField[];
  lineFields: LineField[];
  selectedTextId: number;
  selectedImageId: number | null;
  selectedLineId: number | null;
  onMouseDown: (e: React.MouseEvent, elementId: number, elementType: 'text' | 'image' | 'line') => void;
  onTouchStart: (e: React.TouchEvent, elementId: number, elementType: 'text' | 'image' | 'line') => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const MemeCanvas = forwardRef<HTMLDivElement, MemeCanvasProps>(({
  templateImage,
  imageStyle,
  textFields,
  imageFields,
  lineFields,
  selectedTextId,
  selectedImageId,
  selectedLineId,
  onMouseDown,
  onTouchStart,
  onMouseMove,
  onMouseUp,
  onTouchMove,
  onTouchEnd
}, ref) => {
  const headerText = textFields.find(field => field.type === 'header');
  const footerText = textFields.find(field => field.type === 'footer');
  const regularTextFields = textFields.filter(field => field.type === 'text');

  return (
    <div className="relative w-full" style={{ 
      marginLeft: CANVAS_CONFIG.containerMargins.left, 
      marginRight: CANVAS_CONFIG.containerMargins.right 
    }}>
      {/* Export Wrapper: includes header, image area, and footer so downloads match preview */}
      <div
        ref={ref}
        data-meme-container
        className="meme-container"
        style={{ 
          margin: `${CANVAS_CONFIG.containerMargins.top} 0 ${CANVAS_CONFIG.containerMargins.bottom} 0`
        }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Top Text */}
        {headerText && headerText.text && (
          <div
            className="top-text"
            style={{ 
              fontSize: `${headerText.fontSize * CANVAS_CONFIG.textArea.header.fontSize}px`,
              color: headerText.color,
              opacity: headerText.opacity / 100,
              transform: `rotate(${headerText.rotation}deg) scale(${headerText.scale})`,
              userSelect: 'none',
              touchAction: 'none',
              zIndex: selectedTextId === headerText.id ? 10 : 1,
              fontFamily: 'Impact, Arial, sans-serif',
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              background: 'white',
              width: '100%',
              padding: '0.5em 0',
              textShadow: headerText.color === '#ffffff' || headerText.color === 'white' 
                ? '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
                : 'none'
            }}
            onMouseDown={e => onMouseDown(e, headerText.id, 'text')}
            onTouchStart={e => onTouchStart(e, headerText.id, 'text')}
          >
            {headerText.text}
            {/* Selection ring - will be ignored in download */}
            {selectedTextId === headerText.id && (
              <div className="absolute inset-0 ring-2 ring-blue-400 ring-opacity-50 bg-blue-50 bg-opacity-20 pointer-events-none" data-selection-ring />
            )}
          </div>
        )}

        {/* Template Image with overlays */}
        <div className="relative">
          <img
            src={templateImage}
            alt="Meme template"
            className="w-full block"
            draggable={false}
            style={{ filter: imageStyle }}
          />

          {/* Regular Text Fields */}
          {regularTextFields.map(field => (
            <div
              key={field.id}
              data-text-element={field.id}
              data-placeholder={!field.text}
              className={`absolute cursor-move select-none font-bold text-center px-2 py-1 transition-all duration-300`}
              style={{
                left: `${field.x}%`,
                top: `${field.y}%`,
                fontSize: `${field.fontSize * CANVAS_CONFIG.textArea.regular.fontSize}px`,
                color: field.color,
                fontFamily: field.fontFamily,
                fontWeight: CANVAS_CONFIG.textArea.regular.fontWeight,
                opacity: field.opacity / 100,
                transform: `translate(-50%, -50%) rotate(${field.rotation}deg) scale(${field.scale})`,
                minWidth: '60px',
                userSelect: 'none',
                touchAction: 'none',
                zIndex: selectedTextId === field.id ? 10 : 1,
                whiteSpace: 'pre',
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
              }}
              onMouseDown={e => onMouseDown(e, field.id, 'text')}
              onTouchStart={e => onTouchStart(e, field.id, 'text')}
            >
              {field.text || "Place your text here"}
              {/* Selection ring - will be ignored in download */}
              {selectedTextId === field.id && (
                <div className="absolute inset-0 ring-2 ring-blue-400 ring-opacity-50 bg-blue-50 bg-opacity-20 pointer-events-none" data-selection-ring />
              )}
            </div>
          ))}

          {/* Image Fields */}
          {imageFields.map(field => (
            <div
              key={field.id}
              data-image-element={field.id}
              className={`absolute cursor-move transition-all duration-300`}
              style={{
                left: `${field.x}%`,
                top: `${field.y}%`,
                width: `${field.width * field.scale}px`,
                height: `${field.height * field.scale}px`,
                opacity: field.opacity / 100,
                transform: `translate(-50%, -50%) rotate(${field.rotation}deg)`,
                touchAction: 'none',
                zIndex: selectedImageId === field.id ? 10 : 1
              }}
              onMouseDown={e => onMouseDown(e, field.id, 'image')}
              onTouchStart={e => onTouchStart(e, field.id, 'image')}
            >
              <img src={field.src} alt="Uploaded" className="w-full h-full object-cover" draggable={false} />
              {/* Selection ring - will be ignored in download */}
              {selectedImageId === field.id && (
                <div className="absolute inset-0 ring-2 ring-blue-400 ring-opacity-50 pointer-events-none" data-selection-ring />
              )}
            </div>
          ))}
          {/* Line Fields */}
          {lineFields.map(field => (
            <svg
              key={field.id}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                zIndex: selectedLineId === field.id ? 10 : 2
              }}
            >
              <line
                x1={`${field.x1}%`}
                y1={`${field.y1}%`}
                x2={`${field.x2}%`}
                y2={`${field.y2}%`}
                stroke={field.color}
                strokeWidth={field.thickness}
                opacity={field.opacity / 100}
                className="pointer-events-auto cursor-move"
                onMouseDown={e => {
                  e.preventDefault();
                  onMouseDown(e as any, field.id, 'line');
                }}
                onTouchStart={e => {
                  e.preventDefault();
                  onTouchStart(e as any, field.id, 'line');
                }}
              />
              {/* Selection indicator */}
              {selectedLineId === field.id && (
                <>
                  <circle
                    cx={`${field.x1}%`}
                    cy={`${field.y1}%`}
                    r="4"
                    fill="#3b82f6"
                    className="pointer-events-none"
                    data-selection-ring
                  />
                  <circle
                    cx={`${field.x2}%`}
                    cy={`${field.y2}%`}
                    r="4"
                    fill="#3b82f6"
                    className="pointer-events-none"
                    data-selection-ring
                  />
                  <line
                    x1={`${field.x1}%`}
                    y1={`${field.y1}%`}
                    x2={`${field.x2}%`}
                    y2={`${field.y2}%`}
                    stroke="#3b82f6"
                    strokeWidth={field.thickness + 2}
                    opacity="0.3"
                    className="pointer-events-none"
                    data-selection-ring
                  />
                </>
              )}
            </svg>
          ))}
        </div>

        {/* Bottom Text */}
        {footerText && footerText.text && (
          <div
            className="bottom-text"
            style={{
              fontSize: `${footerText.fontSize * CANVAS_CONFIG.textArea.footer.fontSize}px`,
              color: footerText.color,
              opacity: footerText.opacity / 100,
              transform: `rotate(${footerText.rotation}deg) scale(${footerText.scale})`,
              userSelect: 'none',
              touchAction: 'none',
              zIndex: selectedTextId === footerText.id ? 10 : 1,
              fontFamily: 'Impact, Arial, sans-serif',
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              background: 'white',
              width: '100%',
              padding: '0.5em 0',
              textShadow: footerText.color === '#ffffff' || footerText.color === 'white' 
                ? '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
                : 'none'
            }}
            onMouseDown={e => onMouseDown(e, footerText.id, 'text')}
            onTouchStart={e => onTouchStart(e, footerText.id, 'text')}
          >
            {footerText.text}
            {/* Selection ring - will be ignored in download */}
            {selectedTextId === footerText.id && (
              <div className="absolute inset-0 ring-2 ring-blue-400 ring-opacity-50 bg-blue-50 bg-opacity-20 pointer-events-none" data-selection-ring />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

MemeCanvas.displayName = "MemeCanvas";

export default MemeCanvas;
