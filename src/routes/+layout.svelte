<script>
	import '@fontsource-variable/unbounded'
	import { invalidate } from '$app/navigation'

	const { data, children } = $props()

	$effect(() => {
		const { data: listener } = data.supabase.auth.onAuthStateChange((event) => {
			if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') invalidate('supabase:auth')
		})

		return () => listener.subscription.unsubscribe()
	})
</script>

<svelte:head>
	<title>CRE8</title>
</svelte:head>

{@render children()}
