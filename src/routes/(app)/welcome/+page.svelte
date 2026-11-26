<script>
	import IntroGreeting from '#lib/organisms/IntroGreeting.svelte'
	import IntroPlanning from '#lib/organisms/IntroPlanning.svelte'

	const { data } = $props()
</script>

{#if data.step === 'planning'}
	<IntroPlanning summary={data.summary} />
{:else}
	<IntroGreeting partOfDay={data.partOfDay} firstName={data.firstName} />
{/if}
