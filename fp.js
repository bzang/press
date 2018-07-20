const FP = require('firefox-profile');
const fp = new FP();
fp.setPreference('javascript.enabled', false);
fp.encoded((err, res) => {
  console.log(res);
});

