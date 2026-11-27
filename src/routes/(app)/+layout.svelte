<script>
	import { page } from '$app/state'
	import Sidebar from '#lib/organisms/Sidebar.svelte'
	import ClockStatus from '#lib/organisms/ClockStatus.svelte'
	import TourCallout from '#lib/organisms/guide/TourCallout.svelte'

	const { data, children } = $props()
	const { clock, supabase, timezone, profile } = $derived(data)
	const bare = $derived(
		(page.route.id?.endsWith('/welcome') ?? false) || Boolean(page.data.onboarding)
	)
</script>

{#snippet clockStatus()}
	<ClockStatus
		{clock}
		{supabase}
		timeZone={timezone}
		checkInAfterMinutes={profile?.check_in_after_minutes ?? 120}
		current={page.url.pathname}
	/>
{/snippet}

<a class="skip-link" href="#content">Skip to content</a>

{#if bare}
	{#if clock}<div class="bare-clock">{@render clockStatus()}</div>{/if}
	<main id="content" class="bare-main" class:flush={Boolean(page.data.onboarding)}>
		{@render children()}
	</main>
{:else}
	<div class="app-shell">
		<Sidebar current={page.url.pathname} clock={clockStatus} />
		<main id="content" class="app-main">
			{#if data.tour}{#key data.tour.inApp.here}<TourCallout tour={data.tour} />{/key}{/if}
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.skip-link {
		position: absolute;
		inset-block-start: var(--space-xs);
		inset-inline-start: var(--space-xs);
		z-index: 10;
		padding: var(--space-xs) var(--space-s);
		border-radius: var(--radius-pill);
		background-color: var(--color-button-primary);
		color: var(--color-button-primary-text);
		transform: translateY(-200%);
	}

	.skip-link:focus-visible {
		transform: none;
	}

	.app-main {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-content: start;
		gap: var(--space-xl);
		inline-size: 100%;
		max-inline-size: var(--size-content);
		padding: var(--space-xl);
		padding-inline: var(--space-m);
	}

	.bare-main {
		display: grid;
		place-items: center;
		min-block-size: 100dvh;
		padding: var(--space-xl) var(--space-m);
	}

	/* The onboarding fills the screen itself */
	.bare-main.flush {
		display: block;
		padding: 0;
	}

	.bare-clock {
		display: flex;
		justify-content: end;
		padding: var(--space-s) var(--space-m);
	}

	@media (min-width: 48em) {
		.app-main {
			padding-inline: var(--space-xl);
		}
	}

	@media (min-width: 64em) {
		.app-shell {
			display: grid;
			grid-template-columns: var(--size-sidebar) minmax(0, 1fr);
			align-items: start;
		}
	}
</style>
