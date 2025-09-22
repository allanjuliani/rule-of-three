import { useEffect, useRef, useState } from 'react';
import { decodeToCanvas } from './utils/blurhash';

interface ShaderUniforms {
  time: number;
  width: number;
  height: number;
  mouseX: number;
  mouseY: number;
  tintR: number;
  tintG: number;
  tintB: number;
  saturation: number;
  distortion: number;
  blur: number;
  text: string;
  iconSize: number;
  iconColorR: number;
  iconColorG: number;
  iconColorB: number;
  glassMode: 'light' | 'dark';
  shadowIntensity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  cornerRadius: number;
  chromaticAberration: number;
  shape: string;
  donutThickness: number;
  starPoints: number;
  starInnerRadius: number;
}

interface BackgroundMedia {
  url: string;
  type: 'image' | 'video';
  blurhash?: string;
}

interface CSSGlassShaderProps {
  backgroundMedia: BackgroundMedia;
  uniforms: ShaderUniforms;
  className?: string;
  isTransitioning?: boolean;
  onReady?: () => void;
}

export default function CSSGlassShader({ backgroundMedia, uniforms, className, isTransitioning = false, onReady }: CSSGlassShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  // Load background image or video
  useEffect(() => {
    if (backgroundMedia.url) {
      if (backgroundMedia.type === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          setBackgroundImage(`url(${backgroundMedia.url})`);
          setIsImageLoaded(true);
          onReady?.();
        };
        img.onerror = () => {
          console.warn('Failed to load image:', backgroundMedia.url);
          // Use blurhash as fallback if available
          if (backgroundMedia.blurhash) {
            try {
              const canvas = decodeToCanvas(backgroundMedia.blurhash, 64, 64, 1);
              setBackgroundImage(`url(${canvas.toDataURL()})`);
            } catch (error) {
              console.warn('Failed to decode blurhash:', error);
              setBackgroundImage('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
            }
          } else {
            setBackgroundImage('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
          }
          setIsImageLoaded(true);
          onReady?.();
        };
        img.src = backgroundMedia.url;
      } else if (backgroundMedia.type === 'video') {
        // For video, we'll use a poster frame or fallback
        setBackgroundImage('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        setIsImageLoaded(true);
        onReady?.();
      }
    } else {
      setBackgroundImage('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      setIsImageLoaded(true);
      onReady?.();
    }
  }, [backgroundMedia, onReady]);

  // Update glass styles based on uniforms
  useEffect(() => {
    if (!glassRef.current || !textRef.current) return;

    const glass = glassRef.current;
    const text = textRef.current;

    // Calculate tint color
    const tintColor = `rgb(${Math.round(uniforms.tintR * 255)}, ${Math.round(uniforms.tintG * 255)}, ${Math.round(uniforms.tintB * 255)})`;
    
    // Apply glass properties
    const glassStyles: any = {
      width: `${uniforms.width}px`,
      height: `${uniforms.height}px`,
      left: `${uniforms.mouseX}px`,
      top: `${uniforms.mouseY}px`,
      borderRadius: getShapeBorderRadius(uniforms.shape, uniforms.cornerRadius),
      backdropFilter: `blur(${uniforms.blur * 3}px) saturate(${uniforms.saturation * 100}%)`,
      WebkitBackdropFilter: `blur(${uniforms.blur * 3}px) saturate(${uniforms.saturation * 100}%)`,
      backgroundColor: uniforms.glassMode === 'dark' 
        ? `rgba(${Math.round(uniforms.tintR * 255 * 0.3)}, ${Math.round(uniforms.tintG * 255 * 0.3)}, ${Math.round(uniforms.tintB * 255 * 0.3)}, 0.3)`
        : `rgba(${Math.round(uniforms.tintR * 255 * 0.8)}, ${Math.round(uniforms.tintG * 255 * 0.8)}, ${Math.round(uniforms.tintB * 255 * 0.8)}, 0.1)`,
      border: uniforms.glassMode === 'dark' 
        ? '1px solid rgba(255, 255, 255, 0.2)'
        : '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: `${uniforms.shadowOffsetX}px ${uniforms.shadowOffsetY}px ${uniforms.shadowBlur}px rgba(0, 0, 0, ${uniforms.shadowIntensity})`,
      clipPath: getShapeClipPath(uniforms.shape, uniforms.donutThickness, uniforms.starPoints, uniforms.starInnerRadius),
    };

    // Special handling for donut shape - use border instead of clip-path
    if (uniforms.shape === 'donut') {
      const borderWidth = uniforms.width * uniforms.donutThickness * 0.5;
      glassStyles.border = `${borderWidth}px solid ${glassStyles.backgroundColor}`;
      glassStyles.backgroundColor = 'transparent';
      glassStyles.borderRadius = '50%';
      glassStyles.clipPath = 'none';
    }

    // Apply styles
    Object.assign(glass.style, glassStyles);

    // Text styling
    const iconColor = `rgb(${Math.round(uniforms.iconColorR * 255)}, ${Math.round(uniforms.iconColorG * 255)}, ${Math.round(uniforms.iconColorB * 255)})`;
    text.style.color = iconColor;
    text.style.fontSize = `${uniforms.iconSize * 100}px`;
    text.textContent = uniforms.text;

  }, [uniforms]);

  const getShapeBorderRadius = (shape: string, cornerRadius: number): string => {
    switch (shape) {
      case 'circle':
        return '50%';
      case 'rectangle':
        return `${Math.min(cornerRadius, 50)}px`;
      case 'hexagon':
      case 'star':
      case 'donut':
        return '0';
      default:
        return `${Math.min(cornerRadius, 50)}px`;
    }
  };

  const getShapeClipPath = (shape: string, donutThickness: number, starPoints: number, starInnerRadius: number): string => {
    switch (shape) {
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'hexagon':
        return 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)';
      case 'star':
        // Simplified 5-point star
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'donut':
        // CSS doesn't support subtract operations in clip-path, so we'll use border-radius instead
        return 'circle(50% at 50% 50%)';
      case 'rectangle':
      default:
        return 'none';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className || ''}`}
      style={{
        background: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: `saturate(${uniforms.saturation * 100}%)`,
      }}
    >
      {/* Background layer */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          background: backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Glass element */}
      <div 
        ref={glassRef}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          willChange: 'transform, backdrop-filter',
        }}
      >
        {/* Text/Icon */}
        <div 
          ref={textRef}
          className="text-center leading-none select-none"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        />
      </div>

      {/* Fallback notice */}
      {isImageLoaded && (
        <div className="absolute bottom-4 right-4 text-xs opacity-50 bg-black/20 text-white px-2 py-1 rounded">
          CSS Fallback Mode
        </div>
      )}
    </div>
  );
}