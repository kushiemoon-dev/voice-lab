export function playSnapshot(
  snapshot: Float32Array<ArrayBufferLike>,
  sampleRate: number,
  audioCtx: AudioContext,
  onEnded?: () => void,
): AudioBufferSourceNode {
  const buffer = audioCtx.createBuffer(1, snapshot.length, sampleRate)
  buffer.copyToChannel(snapshot as Float32Array<ArrayBuffer>, 0)

  const source = audioCtx.createBufferSource()
  source.buffer = buffer
  source.connect(audioCtx.destination)
  if (onEnded) source.onended = onEnded
  source.start(0)
  return source
}
