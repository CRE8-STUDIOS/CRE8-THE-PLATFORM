<script>
	import LessonHeading from '#lib/organisms/guide/LessonHeading.svelte'
	import LessonChat from '#lib/organisms/guide/LessonChat.svelte'

	const { data, form } = $props()

	/** A wrong quiz answer comes back from the answer action */
	const feedback = $derived(
		form?.feedback ? /** @type {{ step: number, label: string, feedback: string }} */ (form) : null
	)
</script>

<svelte:head><title>{data.lesson.title} · CRE8</title></svelte:head>

<LessonHeading {...data.lesson} />

{#key data.lesson.slug}
	<LessonChat
		step={data.step}
		history={data.history}
		current={data.current}
		last={data.last}
		{feedback}
	/>
{/key}
