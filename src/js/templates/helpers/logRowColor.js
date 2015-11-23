var colors = {
  'Error': 'error',
  'Exception': 'error',
  'Assert': 'error',
  'Warning': 'warning',
  'Info': 'info'
};

module.exports = function (logLevel) {
  return colors[logLevel] || '';
};
