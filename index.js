const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const acceptMineTypes = /\b(xhtml|html|htm|xml)\b/;
function isHtmlType(headers) {
  return acceptMineTypes.test(headers['content-type'] || '');
}

module.exports = {
  // Ref: https://docs.svrx.io/en/plugin/contribution.html#schema
  configSchema: {},

  hooks: {
    // Ref: https://docs.svrx.io/en/plugin/contribution.html#server
    async onCreate({ middleware, config, logger }) {
      // TODO

      let serveConfig = config.get('$.serve');
      if (serveConfig === true) {
        serveConfig = {
          base: config.get('$.root'),
          index: 'index.html',
        };
      }

      middleware.add('middleware-ssi', async (ctx, next) => {
        await next();
        if (isHtmlType(ctx.response.header)) {
          if (ctx.body && ctx.body.pipe) {
            const targetPath = ctx.body.path;
            if (!targetPath) return;
            ctx.body = ctx.body.pipe(
              new Transform({
                transform(chunk, enc, callback) {
                  let initStr = chunk.toString();
                  let replaceStr;

                  let tries = 0;
                  // max replace
                  const MAX_REPLACE = 100;
                  while (tries < MAX_REPLACE) {
                    tries += 1;
                    replaceStr = initStr.replace(
                      /<!--#\s+include\s+file=["'](.*)["']\s+-->/,
                      (all, cap) => {
                        try {
                          return fs.readFileSync(
                            path.resolve(path.dirname(targetPath), cap),
                          );
                        } catch (e) {
                          logger.error(`include file [${cap}] is not found`);
                          return '';
                        }
                      },
                    );
                    if (replaceStr === initStr) break;
                    else initStr = replaceStr;
                  }
                  this.push(replaceStr);
                  callback();
                },
                flush(callback) {
                  callback();
                },
              }),
            );
          }
        }
      });
    },
  },
};
