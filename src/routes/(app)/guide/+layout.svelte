<script>
	import { page } from '$app/state'
	import SectionTabs from '#lib/molecules/SectionTabs.svelte'

	const { children } = $props()

	const TABS = [
		{ href: '/guide', text: 'Start', match: /^\/guide$/ },
		{ href: '/guide/app', text: 'How CRE8 THE PLATFORM works', match: /^\/guide\/app/ },
		{ href: '/guide/money', text: 'Money basics', match: /^\/guide\/money/ },
		{ href: '/guide/words', text: 'Words', match: /^\/guide\/words/ }
	]
</script>

<div class="guide">
	<SectionTabs label="Guide sections" current={page.url.pathname} tabs={TABS} />
	{@render children()}
</div>

<style>
	.guide {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		min-inline-size: 0;
		max-inline-size: var(--agenda-max-width);
	}
</style>
