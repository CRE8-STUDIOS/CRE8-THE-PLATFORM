import { describe, expect, it } from 'vitest'
import { domainOf, iconError, initialOf, normalizeUrl, validateTile } from './tiles.js'
import { countText } from './tools.js'

describe('links', () => {
	it('adds https to a bare domain and refuses other schemes', () => {
		expect(normalizeUrl('figma.com')).toBe('https://figma.com/')
		expect(normalizeUrl(' http://kvk.nl/login ')).toBe('http://kvk.nl/login')
		expect(normalizeUrl('javascript:alert(1)')).toBeNull()
		expect(normalizeUrl('just words')).toBeNull()
		expect(normalizeUrl('')).toBeNull()
	})

	it('shows the domain without www', () => {
		expect(domainOf('https://www.belastingdienst.nl/btw')).toBe('belastingdienst.nl')
	})

	it('takes the first letter or number of a name', () => {
		expect(initialOf('  figma')).toBe('F')
		expect(initialOf('@123')).toBe('1')
	})
})

describe('validateTile', () => {
	it('needs a name up to 60 characters and a web address', () => {
		expect(validateTile({ name: ' ', url: '' }, 'app').errors).toEqual({
			name: 'Give the app a name.',
			url: 'Paste the link.'
		})
		expect(validateTile({ name: 'x'.repeat(61), url: 'nope' }, 'link').errors).toEqual({
			name: 'Keep it under 60 characters.',
			url: 'This does not look like a web address.'
		})
		expect(validateTile({ name: ' Figma ', url: 'figma.com' }, 'app')).toEqual({
			values: { name: 'Figma', url: 'https://figma.com/' },
			errors: {}
		})
	})
})

describe('icons', () => {
	it('accepts png, jpg, svg and webp up to 1 MB', () => {
		expect(iconError({ type: 'image/png', size: 2000 })).toBeNull()
		expect(iconError({ type: 'image/gif', size: 2000 })).toBe('Use a PNG, JPG, SVG or WEBP file.')
		expect(iconError({ type: 'image/svg+xml', size: 2 * 1024 * 1024 })).toBe(
			'The icon can be 1 MB at most.'
		)
	})
})

describe('tools', () => {
	it('counts boards and notes', () => {
		expect(countText(0, 'board', 'boards')).toBe('No boards yet')
		expect(countText(1, 'note', 'notes')).toBe('1 note')
		expect(countText(3, 'board', 'boards')).toBe('3 boards')
	})
})

describe('order', async () => {
	const { applyMove, moveItem } = await import('./tiles.js')

	it('moves a tile left, right and by dragging', () => {
		expect(applyMove(['a', 'b', 'c'], 'b:left')).toEqual(['b', 'a', 'c'])
		expect(applyMove(['a', 'b', 'c'], 'b:right')).toEqual(['a', 'c', 'b'])
		expect(applyMove(['a', 'b', 'c'], 'a:left')).toEqual(['a', 'b', 'c'])
		expect(applyMove(['a', 'b', 'c'], 'x:left')).toEqual(['a', 'b', 'c'])
		expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
	})
})
