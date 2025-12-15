
export const logAction = async (action: 'click_apply' | 'click_hire', postId?: number) => {
  const payload = {
    action,
    post_id: postId,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent
  };

  console.log(`[Analytics] Logging action to /api/log_action:`, payload);

  // Simulate fire-and-forget API call
  try {
    // In a real app, this would be:
    // await fetch('/api/log_action', { 
    //   method: 'POST', 
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload) 
    // });
  } catch (error) {
    console.warn("Failed to log action:", error);
  }
};
