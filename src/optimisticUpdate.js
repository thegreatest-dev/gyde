// General Optimistic Update Utility
// Usage:
// optimisticUpdate({
//   update: () => setState(newState), // apply optimistic UI update
//   request: () => apiCall(),         // return a promise for the server request
//   rollback: () => setState(prev),   // revert UI if request fails
//   onSuccess: (data) => {},          // optional: handle server response
//   onError: (error) => {},           // optional: handle error
// })

export async function optimisticUpdate({ update, request, rollback, onSuccess, onError }) {
  let rolledBack = false;
  try {
    update(); // Optimistically update UI
    const result = await request();
    if (onSuccess) onSuccess(result);
    return result;
  } catch (error) {
    rolledBack = true;
    rollback(); // Revert UI
    if (onError) onError(error);
    return Promise.reject(error);
  } finally {
    // Optionally, you can log or track the optimistic update result here
    if (rolledBack) {
      // e.g., console.warn('Optimistic update rolled back');
    }
  }
} 