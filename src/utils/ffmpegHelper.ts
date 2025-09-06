
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const loadFFmpeg = async () => {
  if (ffmpeg?.loaded) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
};

export const trimVideo = async (file: File, startTime: number, endTime: number): Promise<string> => {
  const ffmpegInstance = await loadFFmpeg();
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';
  
  await ffmpegInstance.writeFile(inputName, await fetchFile(file));
  
  await ffmpegInstance.exec([
    '-i', inputName,
    '-ss', startTime.toString(),
    '-to', endTime.toString(),
    '-c', 'copy',
    outputName
  ]);
  
  const data = await ffmpegInstance.readFile(outputName);
  const blob = new Blob([data], { type: 'video/mp4' });
  return URL.createObjectURL(blob);
};

export const cropVideo = async (file: File, width: number, height: number): Promise<string> => {
  const ffmpegInstance = await loadFFmpeg();
  const inputName = 'input.mp4';
  const outputName = 'cropped.mp4';
  
  await ffmpegInstance.writeFile(inputName, await fetchFile(file));
  
  await ffmpegInstance.exec([
    '-i', inputName,
    '-vf', `crop=${width}:${height}`,
    '-c:a', 'copy',
    outputName
  ]);
  
  const data = await ffmpegInstance.readFile(outputName);
  const blob = new Blob([data], { type: 'video/mp4' });
  return URL.createObjectURL(blob);
};

export const changeVideoSpeed = async (file: File, speed: number): Promise<string> => {
  const ffmpegInstance = await loadFFmpeg();
  const inputName = 'input.mp4';
  const outputName = 'speed_changed.mp4';
  
  await ffmpegInstance.writeFile(inputName, await fetchFile(file));
  
  const videoFilter = `setpts=${1/speed}*PTS`;
  const audioFilter = `atempo=${speed}`;
  
  await ffmpegInstance.exec([
    '-i', inputName,
    '-filter_complex', `[0:v]${videoFilter}[v];[0:a]${audioFilter}[a]`,
    '-map', '[v]',
    '-map', '[a]',
    outputName
  ]);
  
  const data = await ffmpegInstance.readFile(outputName);
  const blob = new Blob([data], { type: 'video/mp4' });
  return URL.createObjectURL(blob);
};

export const addVideoFilter = async (file: File, brightness: number, contrast: number, saturation: number): Promise<string> => {
  const ffmpegInstance = await loadFFmpeg();
  const inputName = 'input.mp4';
  const outputName = 'filtered.mp4';
  
  await ffmpegInstance.writeFile(inputName, await fetchFile(file));
  
  const filter = `eq=brightness=${(brightness - 100) / 100}:contrast=${contrast / 100}:saturation=${saturation / 100}`;
  
  await ffmpegInstance.exec([
    '-i', inputName,
    '-vf', filter,
    '-c:a', 'copy',
    outputName
  ]);
  
  const data = await ffmpegInstance.readFile(outputName);
  const blob = new Blob([data], { type: 'video/mp4' });
  return URL.createObjectURL(blob);
};

export const convertToGif = async (file: File, width: number = 320): Promise<string> => {
  const ffmpegInstance = await loadFFmpeg();
  const inputName = 'input.mp4';
  const outputName = 'output.gif';
  
  await ffmpegInstance.writeFile(inputName, await fetchFile(file));
  
  await ffmpegInstance.exec([
    '-i', inputName,
    '-vf', `scale=${width}:-1:flags=lanczos,fps=15`,
    '-t', '10',
    outputName
  ]);
  
  const data = await ffmpegInstance.readFile(outputName);
  const blob = new Blob([data], { type: 'image/gif' });
  return URL.createObjectURL(blob);
};
