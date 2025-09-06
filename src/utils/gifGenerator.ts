
import { encode } from 'modern-gif';

export interface GifFrame {
  canvas: HTMLCanvasElement;
  delay: number;
}

export class SimpleGifGenerator {
  private frames: ImageData[] = [];
  private delays: number[] = [];
  private width: number = 0;
  private height: number = 0;

  addFrame(imageElement: HTMLImageElement, delay: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');

    // Set canvas size based on first frame
    if (this.frames.length === 0) {
      this.width = Math.min(imageElement.naturalWidth || imageElement.width, 500);
      this.height = Math.min(imageElement.naturalHeight || imageElement.height, 500);
    }

    canvas.width = this.width;
    canvas.height = this.height;

    // Draw image to canvas with proper scaling
    const aspectRatio = imageElement.width / imageElement.height;
    const canvasAspectRatio = this.width / this.height;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    
    if (aspectRatio > canvasAspectRatio) {
      // Image is wider than canvas
      drawWidth = this.width;
      drawHeight = this.width / aspectRatio;
      offsetY = (this.height - drawHeight) / 2;
    } else {
      // Image is taller than canvas
      drawHeight = this.height;
      drawWidth = this.height * aspectRatio;
      offsetX = (this.width - drawWidth) / 2;
    }

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw image
    ctx.drawImage(imageElement, offsetX, offsetY, drawWidth, drawHeight);

    // Get image data for the GIF encoder
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    this.frames.push(imageData);
    this.delays.push(Math.max(delay, 100)); // Minimum 100ms delay
  }

  async generateGif(): Promise<string> {
    if (this.frames.length === 0) {
      throw new Error('No frames added');
    }

    try {
      console.log(`Creating GIF with ${this.frames.length} frames, size: ${this.width}x${this.height}`);
      
      // Convert ImageData to the format expected by modern-gif
      const frames = this.frames.map((frame, index) => ({
        data: frame.data,
        delay: this.delays[index]
      }));

      // Generate GIF using modern-gif
      const gifBuffer = await encode({
        width: this.width,
        height: this.height,
        frames: frames,
        maxColors: 256
      });

      // Convert buffer to blob URL
      const blob = new Blob([gifBuffer], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      
      console.log('GIF generation successful');
      return url;
      
    } catch (error) {
      console.error('Error in GIF generation:', error);
      throw new Error('Failed to generate GIF: ' + (error as Error).message);
    }
  }

  // Alternative: Create animated WebP
  async generateAnimatedWebP(): Promise<string> {
    if (this.frames.length === 0) {
      throw new Error('No frames added');
    }

    // For WebP, we'll create a simple canvas animation
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');

    // Put first frame image data
    ctx.putImageData(this.frames[0], 0, 0);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Failed to create WebP blob'));
        }
      }, 'image/webp', 0.8);
    });
  }

  // Create an MP4-style output (actually JPEG for simplicity)
  async generateMP4(): Promise<string> {
    if (this.frames.length === 0) {
      throw new Error('No frames added');
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');

    // Put first frame image data
    ctx.putImageData(this.frames[0], 0, 0);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      }, 'image/jpeg', 0.9);
    });
  }
}
