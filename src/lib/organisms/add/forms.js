import AddTaskForm from './AddTaskForm.svelte'
import AddMeetingForm from './AddMeetingForm.svelte'
import AddWorkForm from './AddWorkForm.svelte'
import AddErrandForm from './AddErrandForm.svelte'
import AddDeadlineForm from './AddDeadlineForm.svelte'
import AddRestForm from './AddRestForm.svelte'

/** The step 2 form for each type */
export const ADD_FORMS = {
	task: AddTaskForm,
	meeting: AddMeetingForm,
	work: AddWorkForm,
	errand: AddErrandForm,
	deadline: AddDeadlineForm,
	rest: AddRestForm
}
