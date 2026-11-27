import { lessonActions, loadLesson } from '#lib/server/lesson.js'

/** @type {import('./$types').PageServerLoad} */
export const load = ({ locals, params }) => loadLesson(locals.supabase, params.slug)

export const actions = lessonActions((params) => params.slug)
