import { lessonActions, loadLesson } from '#lib/server/lesson.js'

/** The first lesson as a chat, next to its comparison page */
/** @type {import('./$types').PageServerLoad} */
export const load = ({ locals }) => loadLesson(locals.supabase, 'business-types')

export const actions = lessonActions(() => 'business-types')
