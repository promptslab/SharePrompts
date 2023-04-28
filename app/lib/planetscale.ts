import { connect } from "@planetscale/database";

export const pscale_config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

export const conn = connect(pscale_config);
