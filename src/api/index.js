import { loader, uploader } from "./modules/loader";

const baseUrl = 'http://localhost:8080'
async function spriteList (info) {
  info.isStart = true
  const url = baseUrl + '/api/list/' + info.idx;
  const response = await loader.get(url, "");
  return Promise.resolve(response.data);
}

export {
  spriteList,

}