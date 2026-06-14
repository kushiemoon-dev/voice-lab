export function playSnapshot(
  snapshot: Float32Array<ArrayBufferLike>,
  sampleRate: number,
  audioCtx: AudioContext,
): void {
  const buffer = audioCtx.createBuffer(1, snapshot.length, sampleRate)
  buffer.copyToChannel(snapshot as Float32Array<ArrayBuffer>, 0)

  const source = audioCtx.createBufferSource()
  source.buffer = buffer
  source.connect(audioCtx.destination)
  source.start(0)
}
