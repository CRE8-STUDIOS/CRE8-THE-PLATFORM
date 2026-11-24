<script>
	import Heading from '#lib/atoms/Heading.svelte'
	import Button from '#lib/atoms/Button.svelte'
	import TextField from '#lib/molecules/TextField.svelte'
	import ActionButton from '#lib/molecules/ActionButton.svelte'

	/** @type {{ rules: { id: string, year: number, key: string, value: number, description: string | null }[], year: number }} */
	const { rules, year } = $props()
</script>

<section class="tax-rules">
	<Heading>Tax rules (admin)</Heading>
	<p>
		Shared by all freelancers: zelfstandigenaftrek, startersaftrek, kor_limit, hours_criterion...
		Update them every year.
	</p>
	<table>
		<thead>
			<tr>
				<th scope="col">Year</th><th scope="col">Key</th><th scope="col">Value</th><th scope="col">
					Description
				</th><th scope="col"><span class="visually-hidden">Delete</span></th>
			</tr>
		</thead>
		<tbody>
			{#each rules as { id, year: ruleYear, key, value, description } (id)}
				<tr>
					<td>{ruleYear}</td>
					<td>{key}</td>
					<td>{value}</td>
					<td>{description ?? ''}</td>
					<td>
						<ActionButton action="?/delete" label="Delete" variant="danger" fields={{ id }} />
					</td>
				</tr>
			{:else}
				<tr><td colspan="5">No tax rules yet.</td></tr>
			{/each}
		</tbody>
	</table>

	<Heading level={3}>Add or update</Heading>
	<p>The same year and key updates the existing value.</p>
	<form method="POST" action="?/save">
		<TextField label="Year" name="year" inputmode="numeric" value={year} required />
		<TextField label="Key" name="key" placeholder="e.g. hours_criterion" required />
		<TextField label="Value" name="value" inputmode="decimal" required />
		<TextField label="Description" name="description" />
		<Button variant="primary">Save</Button>
	</form>
</section>
