<script>
	import ProgressLine from '#lib/molecules/ProgressLine.svelte'
	import LessonPath from '#lib/organisms/guide/LessonPath.svelte'
	import RulesBox from '#lib/organisms/guide/RulesBox.svelte'

	const { data } = $props()
</script>

<svelte:head><title>Money basics · CRE8</title></svelte:head>

<div class="money">
	<div class="money-main">
		<div class="money-heading">
			<h1>Money basics</h1>
			<p>
				{data.progress.total} short lessons. From choosing what you are to your first tax return.
			</p>
		</div>
		<ProgressLine done={data.progress.done} total={data.progress.total} />
		<LessonPath lessons={data.progress.items} />
	</div>
	<aside class="money-aside" aria-labelledby="rules-heading">
		<RulesBox year={data.year} rules={data.rules} />
	</aside>
</div>

<style>
	.money {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: var(--space-xl);
	}

	.money-main {
		display: flex;
		flex: 999 1 30rem;
		flex-direction: column;
		gap: var(--space-m);
		min-inline-size: 0;
	}

	.money-heading {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	h1 {
		font-size: var(--font-size-agenda-heading);
		line-height: 1;
		text-transform: uppercase;
	}

	.money-heading p {
		color: var(--color-text-calm);
		font-size: var(--font-size-small);
	}

	.money-aside {
		flex: 1 1 16rem;
		min-inline-size: 0;
	}
</style>
