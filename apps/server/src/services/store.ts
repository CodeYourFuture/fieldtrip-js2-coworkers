/**
 * Store metadata in a file.
 * Inspired by https://github.com/probot/metadata
 * With support added for arrays and quasi sets
 * Processes updates synchronously so they don't overwrite each other
 * Requirements grew out of hand. Should be replaced with a DB.
 */

import PQueue from "p-queue";
import { promises as fs } from "fs";
import { emitter } from "../emitter";
import type { StoreData } from "../types";

type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type Repo = {
  owner: string;
  repo: string;
};

const qs = new Map();

export class Store {
  private repo: Repo;
  private key: string;
  private q: PQueue;

  constructor(repo: Repo) {
    this.repo = repo;
    this.key = `cyf:lab:${repo.owner}:${repo.repo}`;
    if (!qs.has(this.key)) qs.set(this.key, new PQueue({ concurrency: 1 }));
    this.q = qs.get(this.key);
  }

  async wasInitialised() {
    try {
      const data = await this.readData();
      return Boolean(data);
    } catch {
      return false;
    }
  }

  async getAll() {
    return this.readData();
  }

  async get<K extends keyof StoreData>(key: K): Promise<StoreData[K]> {
    const data = await this.readData();
    return data[key];
  }

  async set(key: keyof StoreData | [keyof StoreData, string], value: any) {
    const data = await this.readData();
    if (Array.isArray(key)) {
      const [k1, k2] = key;
      if (!data[k1]) (data as any)[k1] = {};
      (data as any)[k1][k2] = value;
    } else {
      data[key] = value;
    }
    await this.writeData(data);
  }

  async push(key: KeysMatching<StoreData, Array<any>>, value: any) {
    const data = await this.readData();
    if (!data[key]) data[key] = [];
    if (!Array.isArray(data[key])) throw new Error("Property is not an array");
    data[key].push(value);
    await this.writeData(data);
    return data[key];
  }

  async add(key: KeysMatching<StoreData, Array<any>>, value: any) {
    const data = await this.readData();
    if (!data[key]) data[key] = [];
    if (!Array.isArray(data[key])) throw new Error("Property is not an array");
    if (data[key].includes(value)) return false;
    data[key].push(value);
    await this.writeData(data);
    return true;
  }

  async init(initialStore?: StoreData) {
    await this.writeData(initialStore || {});
  }

  private readData(): Promise<StoreData> {
    return this.q.add(async () => {
      try {
        return await fs
          .readFile("./store.json", { encoding: "utf-8" })
          .then((data) => JSON.parse(data)[this.key]);
      } catch (err: any) {
        if (err.code === "ENOENT") return {};
        throw err;
      }
    });
  }

  private async writeData(data: Record<string, unknown>) {
    const update = async () => {
      const current = await fs
        .readFile("./store.json", { encoding: "utf-8" })
        .then((data) => JSON.parse(data));
      const next = { ...current, [this.key]: data };
      await fs.writeFile("./store.json", JSON.stringify(next, null, 2));
      emitter.emit(`${this.repo.owner}:store:updated`, data);
    };

    await this.q.add(update, { priority: 1 });
  }
}
