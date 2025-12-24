import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: 'admin' | 'customer';
  created_at: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Fetch profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const usersWithRoles = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        return {
          ...profile,
          role: (userRole?.role || 'customer') as 'admin' | 'customer',
        };
      });

      return usersWithRoles as UserProfile[];
    },
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      // Search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const emailMatch = user.email?.toLowerCase().includes(searchLower);
        const nameMatch = user.full_name?.toLowerCase().includes(searchLower);
        if (!emailMatch && !nameMatch) return false;
      }

      // Role filter
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;

      return true;
    });
  }, [users, search, roleFilter]);

  const handleRowClick = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <AdminLayout title="Users">
      <title>Admin Users — WNM</title>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
      </p>

      {/* Desktop Table */}
      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {search || roleFilter !== 'all'
            ? 'No users match your filters'
            : 'No users found'}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-xs uppercase tracking-wider">Email</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Name</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Role</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.user_id}
                    onClick={() => handleRowClick(user.user_id)}
                    className="cursor-pointer hover:bg-muted/20"
                  >
                    <TableCell className="font-mono text-sm">
                      {user.email || '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.full_name || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        <span className="flex items-center gap-1">
                          {user.role === 'admin' ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {user.role.toUpperCase()}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                onClick={() => handleRowClick(user.user_id)}
                className="border border-border p-4 cursor-pointer hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm truncate">{user.email || '—'}</p>
                    <p className="text-sm text-muted-foreground">{user.full_name || '—'}</p>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    <span className="flex items-center gap-1">
                      {user.role === 'admin' ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {user.role.toUpperCase()}
                    </span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
