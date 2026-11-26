<script>
	import { page } from '$app/state'
	import ErrorMessage from '#lib/organisms/ErrorMessage.svelte'
	import CenteredPage from '#lib/organisms/CenteredPage.svelte'
</script>

<CenteredPage>
	<ErrorMessage status={page.status} message={page.error?.message ?? ''} />
</CenteredPage>
