module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter('code', (content) => {
    return content.replace(/=&gt;/g, '=>');
  });

  return {
    dir: {
      input: 'content',
      output: 'lessons',
      quiet: true,
    },
  };
};
