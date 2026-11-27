/**
 * Small sound effects drawn with the Web Audio API, so no audio files are needed.
 * Browsers only allow sound after the first click or key press, so effects
 * before that stay silent.
 */

const STORAGE_KEY = 'cre8-sound'

/** @type {AudioContext | null} */
let context = null

export const soundEnabled = () => {
	try {
		return localStorage.getItem(STORAGE_KEY) !== 'off'
	} catch {
		return true
	}
}

/** @param {boolean} on */
export const setSoundEnabled = (on) => {
	try {
		localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
	} catch {
		// Sound stays on for this visit only
	}
}

const audio = () => {
	if (typeof window === 'undefined' || !soundEnabled()) return null
	context ??= new AudioContext()
	if (context.state === 'suspended') context.resume()
	return context.state === 'running' ? context : null
}

/**
 * @param {AudioContext} ctx
 * @param {{ type?: OscillatorType, from: number, to?: number, start?: number, length: number, volume?: number }} tone
 */
const tone = (ctx, { type = 'sine', from, to = from, start = 0, length, volume = 0.2 }) => {
	const at = ctx.currentTime + start
	const osc = ctx.createOscillator()
	const gain = ctx.createGain()
	osc.type = type
	osc.frequency.setValueAtTime(from, at)
	osc.frequency.exponentialRampToValueAtTime(to, at + length)
	gain.gain.setValueAtTime(volume, at)
	gain.gain.exponentialRampToValueAtTime(0.0001, at + length)
	osc.connect(gain).connect(ctx.destination)
	osc.start(at)
	osc.stop(at + length)
}

/**
 * @param {AudioContext} ctx
 * @param {{ start?: number, length: number, volume?: number, filter?: BiquadFilterType, frequency?: number, to?: number }} noise
 */
const noise = (
	ctx,
	{ start = 0, length, volume = 0.2, filter = 'bandpass', frequency = 1000, to = frequency }
) => {
	const at = ctx.currentTime + start
	const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate)
	const data = buffer.getChannelData(0)
	for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
	const source = ctx.createBufferSource()
	const shape = ctx.createBiquadFilter()
	const gain = ctx.createGain()
	source.buffer = buffer
	shape.type = filter
	shape.frequency.setValueAtTime(frequency, at)
	shape.frequency.exponentialRampToValueAtTime(to, at + length)
	gain.gain.setValueAtTime(volume, at)
	gain.gain.exponentialRampToValueAtTime(0.0001, at + length)
	source.connect(shape).connect(gain).connect(ctx.destination)
	source.start(at)
}

/** @param {(ctx: AudioContext) => void} play */
const effect = (play) => () => {
	const ctx = audio()
	if (ctx) play(ctx)
}

export const sounds = {
	/** One key of the typewriter */
	tick: effect((ctx) =>
		tone(ctx, { type: 'square', from: 1700 + Math.random() * 500, length: 0.03, volume: 0.03 })
	),
	/** A soap bubble popping */
	bubble: effect((ctx) =>
		tone(ctx, { from: 500 + Math.random() * 400, to: 1400, length: 0.08, volume: 0.08 })
	),
	/** The scream when it sees you */
	scream: effect((ctx) => {
		tone(ctx, { type: 'sawtooth', from: 520, to: 1250, length: 0.25, volume: 0.09 })
		tone(ctx, { type: 'sawtooth', from: 1250, to: 380, start: 0.22, length: 0.8, volume: 0.09 })
	}),
	/** The foam spinning off */
	poof: effect((ctx) =>
		noise(ctx, { length: 0.45, volume: 0.25, filter: 'highpass', frequency: 300, to: 4000 })
	),
	/** Sparkles when it is clean or new */
	sparkle: effect((ctx) => {
		for (const [index, note] of [1319, 1568, 2093, 2637].entries()) {
			tone(ctx, { type: 'triangle', from: note, start: index * 0.07, length: 0.25, volume: 0.06 })
		}
	}),
	/** Tape slapped on its mouth */
	tape: effect((ctx) =>
		noise(ctx, { length: 0.25, volume: 0.3, filter: 'bandpass', frequency: 2500, to: 600 })
	),
	/** Talking with tape on */
	mmph: effect((ctx) => {
		for (const [index, note] of [180, 150, 200].entries()) {
			tone(ctx, { type: 'triangle', from: note, to: note * 0.8, start: index * 0.22, length: 0.18 })
		}
	}),
	/** A choice is picked */
	pick: effect((ctx) => tone(ctx, { from: 660, to: 990, length: 0.12, volume: 0.12 })),
	/** Squishing into a new shape */
	squish: effect((ctx) => tone(ctx, { from: 220, to: 520, length: 0.2, volume: 0.15 })),
	/** Curtains moving */
	swoosh: effect((ctx) =>
		noise(ctx, { length: 0.7, volume: 0.15, filter: 'lowpass', frequency: 400, to: 2500 })
	),
	/** A drum roll for the given seconds */
	drumroll: (/** @type {number} */ seconds) =>
		effect((ctx) => {
			for (let at = 0; at < seconds; at += 0.045) {
				const swell = 0.08 + (at / seconds) * 0.2
				noise(ctx, { start: at, length: 0.05, volume: swell, frequency: 180 })
			}
		})(),
	/** The big reveal */
	boom: effect((ctx) => {
		tone(ctx, { from: 140, to: 40, length: 0.6, volume: 0.5 })
		noise(ctx, { length: 0.3, volume: 0.3, filter: 'lowpass', frequency: 1200, to: 200 })
		for (const [index, note] of [523, 659, 784, 1047].entries()) {
			tone(ctx, {
				type: 'triangle',
				from: note,
				start: 0.2 + index * 0.08,
				length: 0.4,
				volume: 0.07
			})
		}
	})
}

/** Call on the first click or key press so later effects can play */
export const unlockSound = () => {
	audio()
}
