<script>
	import { page } from '$app/state'
	import ErrorMessage from '#lib/organisms/ErrorMessage.svelte'
</script>

<ErrorMessage status={page.status} message={page.error?.message ?? ''} />
