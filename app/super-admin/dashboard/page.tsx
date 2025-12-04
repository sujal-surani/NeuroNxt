import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, ShieldCheck, LogOut, LayoutDashboard } from "lucide-react"
import { AddInstituteAdminDialog } from "./add-institute-admin-dialog"

export default async function SuperAdminDashboard() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata.role !== 'super_admin') {
        redirect('/auth/login')
    }

    const adminClient = createAdminClient()

    // Fetch all users (limit 1000)
    const { data: { users }, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 })

    if (error) {
        console.error("Error fetching users:", error)
        return <div>Error loading dashboard</div>
    }

    const instituteAdmins = users.filter(u => u.user_metadata.role === 'institute_admin')

    return (
        <div className="min-h-screen bg-background/50">
            <div className="container mx-auto py-10 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            Super Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">Manage Institutes and System Configuration</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden md:block">
                            <div className="font-medium">Super Admin</div>
                            <div className="text-muted-foreground">{user.email}</div>
                        </div>
                        <form action={async () => {
                            "use server"
                            const supabase = createClient()
                            await supabase.auth.signOut()
                            redirect('/auth/login')
                        }}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-100 dark:border-purple-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Total Institutes</CardTitle>
                            <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{instituteAdmins.length}</div>
                            <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Registered institutes</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-100 dark:border-blue-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">System Status</CardTitle>
                            <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">Active</div>
                            <p className="text-xs text-blue-600/80 dark:text-blue-400/80">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold tracking-tight">Registered Institutes</h2>
                        <AddInstituteAdminDialog />
                    </div>
                    <Card>
                        <CardContent className="pt-6">
                            {instituteAdmins.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                    <Building2 className="w-12 h-12 mb-4 text-muted-foreground/50" />
                                    <p className="text-lg font-medium">No institutes found</p>
                                    <p className="text-sm">Add your first institute to get started.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {instituteAdmins.map(admin => (
                                        <div key={admin.id} className="flex flex-col p-5 border rounded-xl bg-card hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    {admin.user_metadata.institute_code?.substring(0, 2) || "IN"}
                                                </div>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">Active</Badge>
                                            </div>

                                            <div className="space-y-1 mb-4">
                                                <div className="font-semibold text-lg line-clamp-1" title={admin.user_metadata.full_name}>
                                                    {admin.user_metadata.full_name}
                                                </div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                                        {admin.user_metadata.institute_code}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 border-t text-xs text-muted-foreground">
                                                {admin.email}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
