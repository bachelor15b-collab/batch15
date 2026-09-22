<?php
/**
 * Role-based access control middleware.
 * Checks if the authenticated user has one of the allowed roles.
 */
namespace App\Middleware;

use App\Helpers\Response;
use App\Models\User;

class RoleMiddleware
{
    /**
     * Require one or more roles to access this route.
     */
    public static function require(string|array $roles, ?User $user = null): void
    {
        if ($user === null) {
            Response::unauthorized('Authentication required.');
        }

        $allowed = is_array($roles) ? $roles : [$roles];

        if (!in_array($user->role_slug, $allowed, true)) {
            Response::forbidden('You do not have permission to perform this action.');
        }
    }

    /**
     * Require Super Admin specifically.
     */
    public static function requireSuperAdmin(?User $user = null): void
    {
        self::require('super_admin', $user);
    }

    /**
     * Require SOC Team or Super Admin.
     */
    public static function requireSocOrSuperAdmin(?User $user = null): void
    {
        self::require(['soc_team', 'super_admin', 'admin_monitor'], $user);
    }

    /**
     * Require any admin role.
     */
    public static function requireAnyAdmin(?User $user = null): void
    {
        $adminRoles = [
            'admin_financial',
            'admin_educational',
            'admin_general',
            'admin_monitor',
            'admin_sports',
            'super_admin',
            'soc_team',
            'operations_manager',
        ];
        self::require($adminRoles, $user);
    }

    /**
     * Check if user has a specific role.
     */
    public static function hasRole(User $user, string $role): bool
    {
        return $user->role_slug === $role;
    }

    /**
     * Check if user has any of the given roles.
     */
    public static function hasAnyRole(User $user, array $roles): bool
    {
        return in_array($user->role_slug, $roles, true);
    }

    /**
     * Require the user has one of the specified roles.
     */
    public static function requireAnyRole(?User $user, array $roles): void
    {
        self::require($roles, $user);
    }
}
