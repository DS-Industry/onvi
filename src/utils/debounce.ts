const debounce = (mseconds: number, callback: any) => {
  setTimeout(() => {
    callback();
  }, mseconds);
};

export {debounce};
