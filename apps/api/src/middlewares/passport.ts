// ✅ 第三方模块
import passport from 'passport';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import {
  Strategy as BearerStrategy,
  VerifyFunction,
} from 'passport-http-bearer';

// ✅ 自定义模块 - alias 路径
import logger from '#libs/logger';
import { userSql } from '#libs/postgres';
import { redisClient } from '#libs/redis';

// ✅ 自定义模块 - 相对路径
import config from '../config.js';

const bearerVerify: VerifyFunction = async (token, done) => {
  try {
    if (config.apiAccessKey && token === config.apiAccessKey) {
	  	return done(null, true);
    }
    const cachedUser = await redisClient.get(`api_key:${token}`);
    if (cachedUser) {
      return done(null, JSON.parse(cachedUser));
    }

    const users = await userSql`
      SELECT
        u.*,
        k.id as key_id
      FROM
        api__users u
        LEFT JOIN api__keys k ON k.user_id = u.id
      WHERE
        k.token = ${token}
    `;

    const user = users?.[0];

    if (user) {
      await redisClient.set(
        `api_key:${token}`,
        JSON.stringify(user),
        'EX',
        86400,
      );

      return done(null, user);
    }

    return done(null, false);
  } catch (error) {
    logger.error(error);
    return done(null, false);
  }
};

export const anonymousStrategy = new AnonymousStrategy();
export const bearerStrategy = new BearerStrategy(bearerVerify);

export const bearerAuth = passport.authenticate(['bearer', 'anonymous'], {
  session: false,
});
