<script>
	import SignatureCanvas from '#lib/atoms/SignatureCanvas.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'

	/** @type {{ label?: string, name?: string, width?: number, height?: number }} */
	const { label = 'Draw your signature', name = 'signature', width = 400, height = 150 } = $props()

	/** @type {string[]} */
	let paths = $state([])

	const svg = $derived(
		paths.length
			? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${paths.join(' ')}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
			: ''
	)

	const clear = () => (paths = [])
</script>

<fieldset class="signature-field">
	<legend>{label}</legend>
	<SignatureCanvas bind:paths {width} {height} />
	<Button type="button" onclick={clear}>Clear signature</Button>
	<Input type="hidden" {name} value={svg} />
</fieldset>
