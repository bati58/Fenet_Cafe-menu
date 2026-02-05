// frontend/src/lib/meta.js

export const setPageMeta = (title, description) => {
  if (title) {
    document.title = title;
  }
  if (description) {
    const tag = document.querySelector('meta[name="description"]');
    if (tag) {
      tag.setAttribute('content', description);
    }
  }
};
