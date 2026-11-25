<script>
	import favicon from '#lib/assets/favicon.svg'
	import { invalidate } from '$app/navigation'

	const { data, children } = $props()

	// Refresh the data when the user logs in or out (also in another tab)
	$effect(() => {
		const { data: listener } = data.supabase.auth.onAuthStateChange((event) => {
			if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') invalidate('supabase:auth')
		})

		return () => listener.subscription.unsubscribe()
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>CRE8</title>
</svelte:head>

{@render children()}
