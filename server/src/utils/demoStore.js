import { randomUUID } from 'crypto';

export const demoStore = {
  users: [],
  resumes: new Map(),
  interviews: new Map(),
};

export const createDemoId = () => randomUUID();
