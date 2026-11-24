<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import SignupForm from '#lib/organisms/SignupForm.svelte'

	const { form } = $props()
</script>

<PageHeader title="Create your CRE8 account" />
<SignupForm kind="freelancer" {form} />
