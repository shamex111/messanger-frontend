import { useQuery } from "@tanstack/react-query";

import userService from "@/services/user.service";

export const useUserQuery = (id: number | null) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ["findUserById", id],
    queryFn: async () => {
      if (typeof id === "number") {
        return userService.getUserById(id);
      }
      throw new Error("Invalid user ID");
    },
    enabled: !!id, 
  });

  return { isLoading, data, error };
};
