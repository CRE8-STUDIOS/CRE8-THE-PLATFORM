<script>
	import IntroGreeting from '#lib/organisms/IntroGreeting.svelte'

	const { data } = $props()
</script>

<IntroGreeting partOfDay={data.partOfDay} firstName={data.firstName} />
