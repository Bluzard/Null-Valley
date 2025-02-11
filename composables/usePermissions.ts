// composables/usePermissions.ts
export const usePermissions = () => {
  interface User {
    role: "admin" | "guard" | "resident" | "supervisor";
  }

  const user = useState<User>("user");

  const can = (action: string) => {
    const permissions: any = {
      admin: [
        "manage_residents",
        "manage_expenses",
        "manage_facilities",
        "send_notifications",
      ],
      guard: ["register_visits", "manage_packages"],
      resident: ["view_expenses", "book_facilities"],
      supervisor: ["view_cameras", "manage_guards"],
    };

    return permissions[user.value.role].includes(action);
  };

  return { can };
};
