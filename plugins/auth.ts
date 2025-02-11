// plugins/auth.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      auth: {
        user: useState("user", () => null),
        login: (userData: any) => {
          useState("user").value = userData;
        },
        logout: () => {
          useState("user").value = null;
          navigateTo("/login");
        },
      },
    },
  };
});
