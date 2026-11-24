<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import ClockInForm from '#lib/organisms/ClockInForm.svelte'
	import Notice from '#lib/atoms/Notice.svelte'

	const { data } = $props()
	const { greeting, projects, clock } = $derived(data)
</script>

<PageHeader title={greeting} />
{#if clock}
	<Notice>You're already clocked in. <a href="/overview">Go to your overview</a></Notice>
{:else}
	<ClockInForm {projects} />
	<Notice><a href="/overview">Skip, go to overview</a></Notice>
{/if}
