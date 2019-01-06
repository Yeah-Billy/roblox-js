// Includes
var http = require('../util/http.js').func;
var options = require('../options.js');
var settings = require('../../settings.json');
var clearSession = require('../util/clearSession.js').func;
var getGeneralToken = require('../util/getGeneralToken.js').func;
var getJar = require('../util/jar.js').func;
 
// Args
exports.required = ['cookie'];
exports.optional = ['jar'];
 
// Define
function login (jar, rbxsec) {
                  clearSession({jar: jar});
                  jar.session = rbxsec;
    return true;
}
const relog = (cookie) => {
  if (!cookie) throw new Error('no cookie supplied?')
  options.jar.session = cookie
  return getVerification({url: 'https://www.roblox.com/my/account#!/security'})
    .then((ver) => {
      if (!ver.header) console.log(`Bad cookie.`)
      return getGeneralToken({}).then((token) => {
        return http({
          url: 'https://www.roblox.com/authentication/signoutfromallsessionsandreauthenticate',
          options: {
            method: 'POST',
            resolveWithFullResponse: true,
            verification: ver.header,
            jar: null,
            headers: {
              'X-CSRF-TOKEN': token
            },
            form: {
              __RequestVerificationToken: ver.inputs.__RequestVerificationToken
            }
          }
        }).then((res) => {
          var cookies = res.headers['set-cookie']
          if (cookies) {
            options.jar.session = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1];
 
              return true;
           
          }
        })
      })
    })
}
 
exports.func = function (args) {
var jar = getJar();
  var cookie = args.cookie;
  var sa = login(jar, cookie );
  if (cookie) {
    try {
      relog(cookie).then((lala)=>{
    return getCurrentUser({});      
      });
    } catch (e) {
      console.error(e)
    }
  }
console.log(jar);
    return true;
};
