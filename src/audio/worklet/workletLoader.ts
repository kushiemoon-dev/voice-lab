export const loadCaptureWorklet = async (
  ctx: AudioContext,
  stream: MediaStream,
  onFrame: (frame: Float32Array) => void,
): Promise<AudioWorkletNode> => {
  try {
    await ctx.audioWorklet.addModule('/worklet/capture-processor.js')
  } catch (e) {
    throw new Error(`Audio worklet load failed: ${e instanceof Error ? e.message : String(e)}`)
  }

  const source = ctx.createMediaStreamSource(stream)
  const workletNode = new AudioWorkletNode(ctx, 'capture-processor')

  workletNode.port.onmessage = (e: MessageEvent<Float32Array>) => {
    onFrame(e.data)
  }

  source.connect(workletNode)
  // Ne pas connecter à destination — on veut juste capturer, pas reproduire

  return workletNode
}
