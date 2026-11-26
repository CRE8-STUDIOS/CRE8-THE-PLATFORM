import {
	id,
	checkbox,
	file,
	failMessage,
	failWith,
	storagePath,
	signedUrls
} from '#lib/server/form.js'
import { fileSize } from '#lib/utils/format.js'

const BUCKET = 'project-files'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const { supabase } = locals
	const { data } = await supabase
		.from('project_files')
		.select('id, name, file_path, size_bytes, shared_with_client')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false })

	const files = data ?? []
	const urls = await signedUrls(
		supabase,
		BUCKET,
		files.map(({ file_path }) => file_path)
	)

	return {
		files: files.map(({ id: fileId, name, file_path, size_bytes, shared_with_client }) => ({
			id: fileId,
			name,
			size: fileSize(size_bytes),
			shared: shared_with_client,
			url: urls[file_path] ?? null
		}))
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	upload: async ({ request, locals, params }) => {
		const { supabase, user } = locals
		const formData = await request.formData()
		const upload = file(formData, 'file')
		if (!upload) return failMessage('Choose a file first.')

		const path = storagePath(user?.id ?? '', ['projects', params.id], upload.name)
		const { error: uploadError } = await supabase.storage
			.from(BUCKET)
			.upload(path, upload, { contentType: upload.type })
		if (uploadError) return failWith(uploadError)

		const { error } = await supabase.from('project_files').insert({
			project_id: params.id,
			name: upload.name,
			file_path: path,
			type: upload.type || null,
			size_bytes: upload.size,
			shared_with_client: checkbox(formData, 'shared_with_client')
		})
		if (error) {
			await supabase.storage.from(BUCKET).remove([path])
			return failWith(error)
		}
		return { success: 'File uploaded.' }
	},

	share: async ({ request, locals }) => {
		const formData = await request.formData()
		const { error } = await locals.supabase
			.from('project_files')
			.update({ shared_with_client: checkbox(formData, 'shared') })
			.eq('id', id(formData))
		if (error) return failWith(error)
		return { success: 'Updated.' }
	},

	delete: async ({ request, locals }) => {
		const { supabase } = locals
		const fileId = id(await request.formData())
		const { data: row } = await supabase
			.from('project_files')
			.select('file_path')
			.eq('id', fileId)
			.single()

		const { error } = await supabase.from('project_files').delete().eq('id', fileId)
		if (error) return failWith(error)
		if (row) await supabase.storage.from(BUCKET).remove([row.file_path])
		return { success: 'File deleted.' }
	}
}
