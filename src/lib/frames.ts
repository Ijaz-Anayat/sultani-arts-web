import type { FrameDTO } from "@/lib/types";

export function sizeKey(label: string) {
  return label.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
}

export function frameMatchesSize(frameSize: string, productSize: string) {
  const frame = frameSize.trim().toLowerCase();
  const product = productSize.trim().toLowerCase();
  if (frame === product) return true;
  return sizeKey(frameSize) === sizeKey(productSize);
}

export function framesForSize(frames: FrameDTO[], productSize: string) {
  return frames.filter((frame) => frameMatchesSize(frame.sizeLabel, productSize));
}
