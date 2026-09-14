import { createApp } from './create-app.js';

const app = await createApp();
const port = Number(process.env.PORT ?? 4000);
await app.listen(port, process.env.HOST ?? '127.0.0.1');
console.log(`ReanMate API → http://localhost:${port}`);
