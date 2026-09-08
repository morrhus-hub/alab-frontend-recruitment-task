export const useAnnouncementQueue = (duration = 1500) => {
  const message = ref("");
  const queue: string[] = [];

  let active = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const processQueue = () => {
    if (active || queue.length === 0) {
      return;
    }

    active = true;
    message.value = queue.shift() ?? "";

    timeoutId = setTimeout(() => {
      message.value = "";
      active = false;
      timeoutId = undefined;

      processQueue();
    }, duration);
  };

  const announce = (text: string) => {
    queue.push(text);
    processQueue();
  };

  onBeforeUnmount(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    queue.length = 0;
  });

  return {
    message,
    announce,
  };
};
