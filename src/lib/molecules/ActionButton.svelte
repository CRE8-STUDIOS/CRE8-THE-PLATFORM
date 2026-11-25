<script>
	import Button from '#lib/atoms/Button.svelte'
	import Input from '#lib/atoms/Input.svelte'

	/** @type {{ action: string, label: string, fields?: Record<string, string | number | boolean | null | undefined>, confirm?: string, variant?: 'primary' | 'secondary' | 'danger' }} */
	const { action, label, fields = {}, confirm, variant = 'secondary' } = $props()

	const askFirst = (/** @type {SubmitEvent} */ event) => {
		if (confirm && !window.confirm(confirm)) event.preventDefault()
	}
</script>

<form class="action-button" method="POST" {action} onsubmit={askFirst}>
	{#each Object.entries(fields) as [name, value] (name)}
		<Input type="hidden" {name} value={value ?? ''} />
	{/each}
	<Button {variant}>{label}</Button>
</form>

<style>
	.action-button {
		display: inline;
	}
</style>
