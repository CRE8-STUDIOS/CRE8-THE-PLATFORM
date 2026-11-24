<script>
	import Notice from '#lib/atoms/Notice.svelte'

	/**
	 * Shows what a form action returned: an error message or a confirmation.
	 * @type {{ form: { message?: string, success?: string } | null | undefined }}
	 */
	const { form } = $props()
</script>

{#if form?.message}
	<Notice type="error">{form.message}</Notice>
{/if}
{#if form?.success}
	<Notice type="success">{form.success}</Notice>
{/if}
