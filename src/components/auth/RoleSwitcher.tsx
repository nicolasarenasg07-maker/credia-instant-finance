import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, User, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {user.role === 'ADMIN' ? (
            <Shield className="w-4 h-4 text-primary" />
          ) : (
            <User className="w-4 h-4" />
          )}
          {user.role}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Demo: Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => switchRole('SME')}
          className={user.role === 'SME' ? 'bg-muted' : ''}
        >
          <User className="w-4 h-4 mr-2" />
          SME (Default)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchRole('ADMIN')}
          className={user.role === 'ADMIN' ? 'bg-muted' : ''}
        >
          <Shield className="w-4 h-4 mr-2 text-primary" />
          Admin (credIA Team)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
