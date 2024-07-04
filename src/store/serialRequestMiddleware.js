// Create a middleware that manages a queue of requests
export const serialRequestMiddleware = store => next => action => {
    // Assuming all RTK Query actions have a type prefix, or you can customize this check
    if (action.type.startsWith('api/')) {
      queue.push(action); // Add new API actions to the queue
  
      // If there's only one item in the queue, process it immediately
      if (queue.length === 1) {
        processNext();
      }
    } else {
      // For all other actions, pass them through
      return next(action);
    }
  
    function processNext() {
      if (queue.length === 0) return; // No more actions to process
      const nextAction = queue[0]; // Get the first action in the queue
  
      // Dispatch the next action and wait for it to complete
      Promise.resolve(next(nextAction)).then(() => {
        queue.shift(); // Remove the completed action from the queue
        processNext(); // Process the next action
      }).catch(() => {
        queue.shift(); // Remove the failed action from the queue
        processNext(); // Continue with the next action
      });
    }
  };
  
  const queue = []; // Initialize the queue to hold pending actions
  