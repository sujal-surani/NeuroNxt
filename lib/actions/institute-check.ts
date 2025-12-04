"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function validateInstituteCode(code: string) {
    const supabase = createAdminClient()

    // In our current schema, institute admins have the institute_code in their metadata
    // We can check if any user exists with this institute code and role='institute_admin'
    // This confirms the institute is registered

    const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })

    if (error) {
        console.error("Error validating institute code:", error)
        return { valid: false, error: error.message }
    }

    const instituteExists = users.some(u =>
        u.user_metadata.institute_code === code &&
        u.user_metadata.role === 'institute_admin'
    )

    return { valid: instituteExists }
}
