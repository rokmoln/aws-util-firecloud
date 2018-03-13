'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrap = exports.express = exports.getPageUrl = exports.getSelfUrl = exports._xForward = exports._initExpress = exports._reqGetBody = exports._resSendError = exports._resSend = exports._resAddLink = undefined;

var _bluebird = require('bluebird/js/release/bluebird');

var _lodashFirecloud = require('lodash-firecloud');

var _lodashFirecloud2 = _interopRequireDefault(_lodashFirecloud);

var _express2 = require('express');

var _express3 = _interopRequireDefault(_express2);

var _expressBearerToken = require('express-bearer-token');

var _expressBearerToken2 = _interopRequireDefault(_expressBearerToken);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _responseTime = require('response-time');

var _responseTime2 = _interopRequireDefault(_responseTime);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _lambda = require('./lambda');

var _expressMiddleware = require('./express-middleware');

var _httpLambda = require('http-lambda');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-invalid-this */
let _resAddLink = exports._resAddLink = function (link) {
  let { target } = link;
  delete link.target;
  let linkStr = [`<${target}>`];

  // eslint-disable-next-line lodash/prefer-map
  _lodashFirecloud2.default.forEach(link, function (value, key) {
    linkStr.push(`${key}="${value}"`);
  });

  linkStr = linkStr.join('; ');
  this._headers.link = _lodashFirecloud2.default.defaultTo(this._headers.link, []);
  this._headers.link.push(linkStr);
};

let _resSend = exports._resSend = function (oldSend, body, mediaType) {
  this.send = oldSend;

  if (mediaType) {
    this.set('content-type', mediaType);
  }

  if (!_lodashFirecloud2.default.isUndefined(this.validate) && _lodashFirecloud2.default.startsWith(this.get('content-type'), this.validate.schema.mediaType)) {
    let valid = this.validate(body);
    if (!valid) {
      this.log.error({
        errors: this.validate.errors,
        body,
        schema: this.validate.schema,
        req: this.req,
        res: this
      }, 'Response validation failed!');
    }
  }

  return this.send(body);
};

let _resSendError = exports._resSendError = function (status, extensions = {}) {
  this.status(status);

  let contentType = 'application/problem+json';
  let body = _lodashFirecloud2.default.merge({
    type: 'about:blank',
    title: _http2.default.STATUS_CODES[status],
    status,
    instance: this.instance
  }, extensions);
  this.send(body, contentType);

  let err = new Error();
  err.contentType = 'application/problem+json';
  err.body = body;
  return err;
};

let _reqGetBody = exports._reqGetBody = function () {
  let { body } = this;
  try {
    if (/[/+]json$/.test(this.get('content-type'))) {
      body = JSON.parse(this.body);
    }
  } catch (syntaxErrors) {
    return this.res.sendError(400, { errors: syntaxErrors });
  }

  if (!_lodashFirecloud2.default.isUndefined(this.validate)) {
    let valid = this.validate(body);
    if (!valid) {
      return this.res.sendError(422, {
        errors: this.validate.errors,
        schema: this.validate.schema
      });
    }
  }

  return body;
};

let _initExpress = exports._initExpress = function () {
  return (0, _expressMiddleware.bootstrap)((() => {
    var _ref = (0, _bluebird.coroutine)(function* (req, res, next) {
      req.log = req.ctx.log;
      res.log = req.log;
      res.instance = (0, _lambda.getRequestInstance)(req);
      req.getBody = _lodashFirecloud2.default.memoize(exports._reqGetBody.bind(req));
      let oldSend = res.send;
      res.addLink = _lodashFirecloud2.default.bind(exports._resAddLink, res);
      res.send = _lodashFirecloud2.default.bind(exports._resSend, res, oldSend);
      res.sendError = _lodashFirecloud2.default.bind(exports._resSendError, res);
      next();
    });

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  })());
};

let _xForward = exports._xForward = function () {
  return (0, _expressMiddleware.bootstrap)((() => {
    var _ref2 = (0, _bluebird.coroutine)(function* (req, _res, next) {
      req.headers = _lodashFirecloud2.default.mapKeys(req.headers, function (_value, key) {
        return _lodashFirecloud2.default.replace(key, /^X-Forward-/, '');
      });
      next();
    });

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  })());
};

let getSelfUrl = exports.getSelfUrl = function ({ req }) {
  let { env } = req.ctx;
  let selfUrl = _url2.default.parse(`${env.API_SECONDARY_BASE_URL}${req.originalUrl}`, true, true);
  delete selfUrl.search;
  return selfUrl;
};

let getPageUrl = exports.getPageUrl = function ({ req, per_page, ref }) {
  let pageUrl = exports.getSelfUrl({ req });
  _lodashFirecloud2.default.merge(pageUrl, {
    query: {
      per_page,
      ref
    }
  });
  return pageUrl;
};

let express = exports.express = function ({ e }) {
  let app = (0, _express3.default)();

  app.disable('x-powered-by');
  app.disable('etag');
  app.enable('trust proxy');
  app.set('json spaces', 2);
  app.validate = exports.validate;

  // FIXME hack!!!
  let host = _lodashFirecloud2.default.get(e, 'headers.Host', _lodashFirecloud2.default.get(e, 'headers.host'));
  if (_lodashFirecloud2.default.startsWith(host, 'api-git.')) {
    // using the api-git apigateway-domainname (ci stack)
    let basePath = _lodashFirecloud2.default.split(_url2.default.parse(e.path).pathname, '/')[1];
    app.lazyrouter();
    app.use(`/${basePath}`, app._router);
  }

  app.use((0, _responseTime2.default)());
  app.use((0, _cors2.default)({
    exposedHeaders: ['location', 'x-response-time'],
    maxAge: 24 * 60 * 60 // 24 hours
  }));
  app.use((0, _expressBearerToken2.default)());
  app.use(exports._initExpress());
  app.use(exports._xForward());

  app.use((0, _expressMiddleware.bootstrap)((() => {
    var _ref3 = (0, _bluebird.coroutine)(function* (_req, res, next) {
      res.set('cache-control', 'max-age=0, no-store');
      next();
    });

    return function (_x7, _x8, _x9) {
      return _ref3.apply(this, arguments);
    };
  })()));

  return app;
};

// using console.log instead of the logger on purpose
let bootstrap = exports.bootstrap = function (fn, { pkg }) {
  return (0, _lambda.bootstrap)((() => {
    var _ref4 = (0, _bluebird.coroutine)(function* (e, ctx, next) {
      // eslint-disable-next-line no-console
      console.log('aws-util-firecloud.express.bootstrap: Setting up timeout handler...');

      let timeoutInterval = 500;
      let timeoutIntervalId = setInterval(function () {
        let remainingTime = ctx.getRemainingTimeInMillis();
        if (remainingTime + timeoutInterval > 1000) {
          return;
        }

        clearInterval(timeoutIntervalId);

        let statusCode = 524;
        let title = 'A Timeout Occurred';

        // eslint-disable-next-line no-console
        console.error(`aws-util-firecloud.express.bootstrap: Lambda will timeout in ${remainingTime} ms`);
        // eslint-disable-next-line no-console
        console.error(`aws-util-firecloud.express.bootstrap: Terminating with ${statusCode} ${title}...`);

        next(undefined, { // eslint-disable-line callback-return
          statusCode,
          headers: {
            'content-type': 'application/problem+json'
          },
          body: JSON.stringify({
            type: 'about:blank',
            title,
            status: statusCode,
            instance: (0, _lambda.getRequestInstance)({ ctx }),
            renderer: 'lambda-util'
          })
        });

        // don't process.exit()
      }, timeoutInterval);

      yield _lodashFirecloud2.default.consoleLogTime('aws-util-firecloud.express.bootstrap: Running httpLambda...', (0, _bluebird.coroutine)(function* () {
        (0, _httpLambda.httpLambda)(function (http, e, ctx, _next) {
          (0, _bluebird.coroutine)(function* () {
            let app;

            yield _lodashFirecloud2.default.consoleLogTime('aws-util-firecloud.express.bootstrap: Creating express app...', (0, _bluebird.coroutine)(function* () {
              app = exports.express({ e });
            }));

            yield _lodashFirecloud2.default.consoleLogTime('aws-util-firecloud.express.bootstrap: Setting up custom express...', (0, _bluebird.coroutine)(function* () {
              yield fn(app, e, ctx, next);
            }));

            yield _lodashFirecloud2.default.consoleLogTime('aws-util-firecloud.express.bootstrap: Creating HTTP server = running request...', (0, _bluebird.coroutine)(function* () {
              http.createServer(app);
            }));
          })();
        })(e, ctx, function () {
          clearInterval(timeoutInterval);
          // eslint-disable-next-line fp/no-arguments
          next(...arguments);
        });
      }));
    });

    return function (_x10, _x11, _x12) {
      return _ref4.apply(this, arguments);
    };
  })(), { pkg });
};

exports.default = exports;

//# sourceMappingURL=express.js.map