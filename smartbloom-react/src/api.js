import axios from 'axios'


const API_URL = 'http://127.0.0.1:8000'


export async function predictFlower(file) {
const fd = new FormData()
fd.append('file', file)
const { data } = await axios.post(`${API_URL}/predict_flower`, fd, {
headers: { 'Content-Type': 'multipart/form-data' },
})
return data
}


export async function predictDisease(file) {
const fd = new FormData()
fd.append('file', file)
const { data } = await axios.post(`${API_URL}/predict_disease`, fd, {
headers: { 'Content-Type': 'multipart/form-data' },
})
return data
}