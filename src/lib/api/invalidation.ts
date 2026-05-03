import { QueryClient } from '@tanstack/react-query';

/**
 * Helper functions to invalidate query cache after mutations.
 */

export const invalidateQueries = {
  currentUser: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  },

  tutors: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: ['tutors'] });
  },

  bookings: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: ['bookings'] });
  },

  reviews: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: ['reviews'] });
  },

  categories: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: ['categories'] });
  },

  all: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries();
  },
};
