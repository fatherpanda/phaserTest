import { axios } from "@bundled-es-modules/axios";
// import vueCookies from 'vue-cookies'

const baseURL = "https://localhost:8080"
export const loader = axios.create({
    baseURL: baseURL,
    headers: { "content-type": "application/json" },
})

export const uploader = axios.create({
    baseURL: baseURL,
    headers: { "content-type": "multipart/form-data" },
})


// loader.interceptors.request.use(
//     config => {
//         config.headers['Content-Type'] = 'application/json';
//         const token = vueCookies.get("token")
//         if (token) {
//             config.headers['Authorization'] = token
//             //config.headers.common["Authorization"] = token
//         }
//         return config
//     },
//     error => {
//         // Do something with request error
//         Promise.reject(error)
//     }
// )


// uploader.interceptors.request.use(
//     config => {
//         config.headers['Content-Type'] = 'multipart/form-data';
//         const token = vueCookies.get("token")
//         if (token) {
//             config.headers['Authorization'] = token
//             //config.headers.common["Authorization"] = token
//         }
//         return config
//     },
//     error => {
//         // Do something with request error
//         Promise.reject(error)
//     }
// )
