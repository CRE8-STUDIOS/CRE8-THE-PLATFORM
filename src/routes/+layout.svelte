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

<svg class="visually-hidden" aria-hidden="true" focusable="false">
	<filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
		<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="8" result="noise" />
		<feDisplacementMap
			in="SourceGraphic"
			in2="noise"
			scale="5"
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
</svg>
