<script>
	import { page } from '$app/state'
	import AppHeader from '#lib/organisms/AppHeader.svelte'
	import ClockStatus from '#lib/organisms/ClockStatus.svelte'

	// Template for all freelancer pages: header, clock and the page itself
	const { data, children } = $props()
	const { clock, supabase, timezone, profile } = $derived(data)
</script>

<AppHeader current={page.url.pathname} />
<ClockStatus
	{clock}
	{supabase}
	timeZone={timezone}
	checkInAfterMinutes={profile?.check_in_after_minutes ?? 120}
	current={page.url.pathname}
/>

<main>
	{@render children()}
</main>
