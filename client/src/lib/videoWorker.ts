import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

interface WorkerMessage {
  file: File;
  type: 'start';
  modelConfig: {
    maxFaces: number;
  };
}

const processVideo = async (file: File, modelConfig: { maxFaces: number }) => {
  await tf.ready();
  await tf.setBackend('webgl');

  // Carregar o modelo BlazeFace
  const model = await blazeface.load({
    maxFaces: modelConfig.maxFaces,
  });

  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);

  await new Promise((resolve) => {
    video.onloadedmetadata = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d")!;

  const frameRate = 1; // Process 1 frame per second
  const duration = video.duration;
  const totalFrames = Math.floor(duration * frameRate);

  for (let i = 0; i < totalFrames; i++) {
    video.currentTime = i / frameRate;
    await new Promise((resolve) => {
      video.onseeked = resolve;
    });

    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const predictions = await model.estimateFaces(imageData);

    // Report progress
    self.postMessage({
      type: "progress",
      progress: (i / totalFrames) * 100,
      faces: predictions.length
    });
  }

  URL.revokeObjectURL(video.src);
  self.postMessage({ type: "complete" });
};

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { file, modelConfig, type } = e.data;
  if (type === 'start') {
    await processVideo(file, modelConfig);
  }
};