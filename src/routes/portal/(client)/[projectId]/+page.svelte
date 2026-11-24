<script>
	import PageHeader from '#lib/molecules/PageHeader.svelte'
	import FormNotice from '#lib/molecules/FormNotice.svelte'
	import ProjectBriefing from '#lib/organisms/ProjectBriefing.svelte'
	import UpdateList from '#lib/organisms/UpdateList.svelte'
	import PortalContract from '#lib/organisms/PortalContract.svelte'
	import PortalRequests from '#lib/organisms/PortalRequests.svelte'
	import PortalMeetings from '#lib/organisms/PortalMeetings.svelte'
	import PortalInvoices from '#lib/organisms/PortalInvoices.svelte'
	import FileList from '#lib/organisms/FileList.svelte'
	import PortalMoodboards from '#lib/organisms/PortalMoodboards.svelte'

	// Times in the portal are shown in the client's own (browser) time zone
	const { data, form } = $props()
	const { project, updates, contract, requests, meetings, slots, invoices, files, boards } =
		$derived(data)
</script>

<PageHeader title={project.title} back={{ href: '/portal', text: 'My projects' }} />
<FormNotice {form} />
<ProjectBriefing {project} />
<UpdateList {updates} editable={false} title="Progress" />
<PortalContract {contract} />
<PortalRequests {requests} />
<PortalMeetings {meetings} {slots} />
<PortalInvoices {invoices} />
<FileList {files} editable={false} title="Shared files" />
<PortalMoodboards {boards} />
