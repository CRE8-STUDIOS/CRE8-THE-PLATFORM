<script>
	import Notice from '#lib/atoms/Notice.svelte'

	/** @type {{ form: { message?: string, success?: string } | null | undefined }} */
	const { form } = $props()
</script>

{#if form?.message}
	<Notice type="error">{form.message}</Notice>
{/if}
{#if form?.success}
	<Notice type="success">{form.success}</Notice>
{/if}
