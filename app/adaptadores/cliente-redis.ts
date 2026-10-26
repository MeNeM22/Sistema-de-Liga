import "dotenv/config";
import { createClient, RedisClientType } from "redis";

export default async function <T>(callback: (cliente: RedisClientType<any>) => Promise<T>): Promise<T> {
  const url = process.env.REDIS_URL;
  const cliente: RedisClientType<any> = createClient({ url });

  await cliente.connect();
  try {
    return await callback(cliente);
  } finally {
    await cliente.quit();
  }
}
