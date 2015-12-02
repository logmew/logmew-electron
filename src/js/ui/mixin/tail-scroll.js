'use strict';

function withTailScroll() {
  this.isScrolledBottom = function () {
    var body = document.body;
    return (body.scrollHeight - body.offsetHeight) <= window.scrollY;
  };

  this.scrollToTop = function () {
    window.scrollTo(0, document.body.scrollHeight);
  };

  this.scrollToBottom = function () {
    window.scrollTo(0, document.body.scrollHeight);
  };
};

module.exports = withTailScroll;
