<script>
	import PillGroup from '#lib/molecules/PillGroup.svelte'
	import CalmField from '#lib/molecules/CalmField.svelte'

	/**
	 * The extras behind "+ more options": notes, checklist, reminder, repeat, people.
	 * @type {{ answers: Record<string, string>, show: ('notes' | 'checklist' | 'reminder' | 'repeat' | 'people')[] }}
	 */
	const { answers, show } = $props()

	const REMINDERS = [
		{ value: '', label: 'None' },
		{ value: '0', label: 'At the start' },
		{ value: '15', label: '15 min before' },
		{ value: '60', label: '1 hour before' },
		{ value: '1440', label: '1 day before' }
	]
	const REPEATS = [
		{ value: '', label: 'Once' },
		{ value: 'daily', label: 'Every day' },
		{ value: 'weekly', label: 'Every week' },
		{ value: 'monthly', label: 'Every month' }
	]
</script>

{#if show.includes('people')}
	<fieldset class="more-people">
		<legend>People</legend>
		{#each [0, 1] as row (row)}
			<div class="more-person">
				<CalmField label="Name" name="person_name" id="person-name-{row}" />
				<CalmField label="Role" name="person_role" id="person-role-{row}" />
				<CalmField label="Email" name="person_email" id="person-email-{row}" type="email" />
				<CalmField label="Phone" name="person_phone" id="person-phone-{row}" type="tel" />
			</div>
		{/each}
	</fieldset>
{/if}
{#if show.includes('checklist')}
	<div class="more-text">
		<label for="field-checklist">Checklist <span>one per line</span></label>
		<textarea id="field-checklist" name="checklist" rows="3"></textarea>
	</div>
{/if}
{#if show.includes('reminder')}
	<PillGroup
		legend="Remind me"
		name="reminder"
		options={REMINDERS}
		value={answers.reminder ?? ''}
	/>
{/if}
{#if show.includes('repeat')}
	<PillGroup legend="Repeat" name="repeat" options={REPEATS} value={answers.repeat ?? ''} />
{/if}
{#if show.includes('notes')}
	<div class="more-text">
		<label for="field-notes">Notes</label>
		<textarea id="field-notes" name="notes" rows="3">{answers.notes ?? ''}</textarea>
	</div>
{/if}

<style>
	.more-people {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		margin: 0;
		padding: 0;
		border: 0;
	}

	.more-person {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: var(--space-xs);
		padding-block-end: var(--space-s);
		border-block-end: var(--line-dashed);
	}

	legend,
	.more-text label {
		margin-block-end: var(--space-xs);
		font-size: var(--font-size-label);
		font-weight: var(--font-weight-heading);
		letter-spacing: var(--letter-spacing-display);
		text-transform: uppercase;
	}

	.more-text {
		display: flex;
		flex-direction: column;
	}

	.more-text label span {
		color: var(--color-text-calm);
		font-weight: 500;
		text-transform: none;
	}

	textarea {
		min-block-size: 5rem;
		padding: var(--space-xs) var(--space-s);
		border: var(--line);
		border-radius: var(--radius-item);
		background: transparent;
	}
</style>
