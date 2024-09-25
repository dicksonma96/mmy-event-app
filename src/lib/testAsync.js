export default async (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms); // Wait for 3 seconds (3000 milliseconds)
  });
};
