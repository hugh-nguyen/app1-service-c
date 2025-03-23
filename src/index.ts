// app1-service-b
import express, { Request, Response } from 'express';
import axios from 'axios';
import { instrumentWithAxon } from 'cortex-axon-js';

const app = express();

app.use(instrumentWithAxon("app1"));

axios.defaults.proxy = {
  host: 'envoy',
  port: 8080
};

app.get('/getresult', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`http://localhost/shared-app/service-s/getresult/`);
    return res.status(response.status).json(["C=0.0.2", ...response.data]);
  } catch (err: any) {
    console.error("Error calling /c/getresult:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(80, () => {
  console.log('service-c listening on port 80');
});
