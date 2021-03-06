import _ from 'lodash-firecloud';
import env from './env';

import {
  Account,
  Env
} from './types';

export let get = function({env}: {
  env: Env;
}): {[key: string]: Account;} {
  let awsAccountIdVars = _.filter(_.keys(env), function(varName) {
    return _.endsWith(varName, '_AWS_ACCOUNT_ID');
  });
  let accounts = {};

  _.forEach(awsAccountIdVars, function(awsAccountIdVar) {
    let prefix = _.replace(awsAccountIdVar, /_AWS_ACCOUNT_ID$/, '');
    let NAME = _.toLower(prefix);
    let ID = env[awsAccountIdVar];

    let account = {
      NAME,
      ID
    } as Partial<Account>;

    let prefixedEnvVars = _.pickBy(env, function(_value, key) {
      return _.startsWith(key, `${prefix}_`);
    });
    prefixedEnvVars = _.mapKeys(prefixedEnvVars, function(_value, key) {
      return _.replace(key, new RegExp(`^${prefix}_`), '');
    });
    _.merge(account, prefixedEnvVars);

    account.NS = _.split(_.defaultTo(account.NS as unknown as string, ''), ',');

    account = account as Account;
    accounts[ID] = account;
    accounts[prefix] = account;
    accounts[NAME] = account;
  });

  _.assign(accounts, accounts[env.AWS_ACCOUNT_ID]);

  return accounts;
};

export let current = {} as Env;

// lazy init
// eslint-disable-next-line fp/no-proxy
export let currentProxy = new Proxy(current, {
  get: function(target, property, _receiver) {
    property = property as Exclude<typeof property, symbol>;
    if (_.isEmpty(current)) {
      _.merge(current, get({env}));
    }

    return target[property];
  }
});

export default currentProxy;
